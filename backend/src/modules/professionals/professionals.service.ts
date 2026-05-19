import { Injectable, NotFoundException } from '@nestjs/common';
import { ErrorCode } from '@business/shared/errors';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { Professional } from './entities/professional.entity';
import { DataSource, Repository } from 'typeorm';
import { handleDbExceptions } from '@/common/utils/handle-db-exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '@business/shared/types';
import { UsersService } from '../users/users.service';
import { ProfessionalUser } from '@business/shared/types';
import { plainToInstance } from 'class-transformer';
import { ResponseProfessionalDto } from './dto/response-professional.dto';

@Injectable()
export class ProfessionalsService {
  constructor(
    @InjectRepository(Professional)
    private readonly professionalsRepository: Repository<Professional>,

    private readonly usersService: UsersService,

    private readonly dataSource: DataSource,
  ) {}

  /** Crea un nuevo professionalo junto con su usuario asociado de forma atómica usando una transacción.
   * El professionalo puede ser un administrador
   * @param createProfessionalDto - DTO que contiene los datos necesarios para crear el professionalo y su usuario.
   * @returns El professionalo creado con su usuario asociado.
   */
  async registerProfessional(createProfessionalDto: CreateProfessionalDto): Promise<ProfessionalUser> {
    const { email, password, fullName, phone, isAdmin, roles: rolesFromDto, ...professionalData } =
      createProfessionalDto;
      
    //Usamos dataSource.transaction para asegurarnos de que la creación del usuario y el professionalo se realicen de forma atómica.
    //  Si ocurre un error en cualquiera de las dos operaciones, toda la transacción se revertirá y no quedará ningún registro inconsistente en la base de datos.
    return await this.dataSource.transaction(async (manager) => {
      let roles = (rolesFromDto && rolesFromDto.length > 0)
        ? rolesFromDto
        : (isAdmin ? [UserRole.PROFESSIONAL, UserRole.ADMIN] : [UserRole.PROFESSIONAL]);

      // Al ser un professionalo, nos aseguramos de que tenga el rol PROFESSIONAL
      if (!roles.includes(UserRole.PROFESSIONAL)) {
        roles = [...roles, UserRole.PROFESSIONAL];
      }

      const user = await this.usersService.registerUser({
        email,
        password,
        fullName,
        phone,
        roles,
        isActive: true,
      }, manager); // Pasamos el manager a la función registerUser para que use el mismo contexto transaccional

       const professional = manager.create(Professional, {
        ...professionalData,
        userId: user.id, // Esperamos a que se cree el usuario para asignarlo al professionalo
      });


      try {
        const savedProfessional = await manager.save(professional);
        // Cargamos la relación user que acabamos de crear/actualizar para el mapeo
        savedProfessional.user = user;
        return this.mapToProfessionalUser(savedProfessional);
      } catch (error) {
        return handleDbExceptions(error, 'professional');
      }
    });
  }

  async updateProfessional(id: string, updateProfessionalDto: UpdateProfessionalDto): Promise<ProfessionalUser> {
    const { email, password, fullName, phone, isAdmin, isActive, ...professionalData } =
      updateProfessionalDto;

    // Buscamos el professionalo con su usuario para poder mapear después
    const professionalToUpdate = await this.professionalsRepository.findOne({ where: { id }, relations: { user: true } });
    if (!professionalToUpdate) {
      throw new NotFoundException({ code: ErrorCode.PROFESSIONAL_NOT_FOUND, message: `Professional with id ${id} not found` });
    }

    return await this.dataSource.transaction(async (manager) => {
      let user = professionalToUpdate.user;

      // 1. Actualizar Usuario si hay campos de usuario
      if (email || password || fullName || phone || isAdmin !== undefined || isActive !== undefined) {
        const userUpdate: any = { email, password, fullName, phone, isActive };
        
        if (isAdmin !== undefined || updateProfessionalDto.roles) {
          let roles = (updateProfessionalDto.roles && updateProfessionalDto.roles.length > 0)
            ? updateProfessionalDto.roles
            : (isAdmin ? [UserRole.PROFESSIONAL, UserRole.ADMIN] : [UserRole.PROFESSIONAL]);

          // Al ser un professionalo, nos aseguramos de que tenga el rol PROFESSIONAL
          if (!roles.includes(UserRole.PROFESSIONAL)) {
            roles = [...roles, UserRole.PROFESSIONAL];
          }
          userUpdate.roles = roles;
        }

        user = await this.usersService.updateUser(professionalToUpdate.userId, userUpdate, manager);
      }

      // 2. Actualizar Professionalo
      if (isActive === false) {
        professionalData.isAvailable = false;
      }

      const professional = await manager.preload(Professional, {
        id,
        ...professionalData,
      });

      try {
        const savedProfessional = await manager.save(professional!);
        savedProfessional.user = user; // Aseguramos que tenga el usuario actualizado
        return this.mapToProfessionalUser(savedProfessional);
      } catch (error) {
        return handleDbExceptions(error, 'professional');
      }
    });
  }

  async getProfessionalByProfessionalId(professionalId: string): Promise<ProfessionalUser> {
    const professional = await this.professionalsRepository.findOne({ where: { id: professionalId }, relations: { user: true } });
    if (!professional) {
      throw new NotFoundException({ code: ErrorCode.PROFESSIONAL_NOT_FOUND, message: `Professional with id ${professionalId} not found` });
    }
    
    return this.mapToProfessionalUser(professional);
  }

  async getProfessionalsByBusinessId(businessId: string): Promise<ProfessionalUser[]> {
    const professionals = await this.professionalsRepository.find({ where: { businessId }, relations: { user: true } });
    return professionals.map(professional => this.mapToProfessionalUser(professional));
  }

}
