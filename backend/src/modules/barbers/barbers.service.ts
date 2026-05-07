import { Injectable, NotFoundException } from '@nestjs/common';
import { ErrorCode } from '@barber/shared/errors';
import { CreateBarberDto } from './dto/create-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';
import { Barber } from './entities/barber.entity';
import { DataSource, Repository } from 'typeorm';
import { handleDbExceptions } from '@/common/utils/handle-db-exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '@barber/shared/types';
import { UsersService } from '../users/users.service';
import { BarberUser } from '@barber/shared/types';
import { plainToInstance } from 'class-transformer';
import { BarberUserDto } from './dto/barber-user.dto';

@Injectable()
export class BarbersService {
  constructor(
    @InjectRepository(Barber)
    private readonly barbersRepository: Repository<Barber>,

    private readonly usersService: UsersService,

    private readonly dataSource: DataSource,
  ) {}

  /** Crea un nuevo barbero junto con su usuario asociado de forma atómica usando una transacción.
   * El barbero puede ser un administrador
   * @param createBarberDto - DTO que contiene los datos necesarios para crear el barbero y su usuario.
   * @returns El barbero creado con su usuario asociado.
   */
  async registerBarber(createBarberDto: CreateBarberDto): Promise<BarberUser> {
    const { email, password, fullName, phone, isAdmin, roles: rolesFromDto, ...barberData } =
      createBarberDto;
    //Usamos dataSource.transaction para asegurarnos de que la creación del usuario y el barbero se realicen de forma atómica.
    //  Si ocurre un error en cualquiera de las dos operaciones, toda la transacción se revertirá y no quedará ningún registro inconsistente en la base de datos.
    return await this.dataSource.transaction(async (manager) => {
      let roles = (rolesFromDto && rolesFromDto.length > 0)
        ? rolesFromDto
        : (isAdmin ? [UserRole.BARBER, UserRole.ADMIN] : [UserRole.BARBER]);

      // Al ser un barbero, nos aseguramos de que tenga el rol BARBER
      if (!roles.includes(UserRole.BARBER)) {
        roles = [...roles, UserRole.BARBER];
      }

      const user = await this.usersService.registerUser({
        email,
        password,
        fullName,
        phone,
        roles,
        isActive: true,
      }, manager); // Pasamos el manager a la función registerUser para que use el mismo contexto transaccional

       const barber = manager.create(Barber, {
        ...barberData,
        userId: user.id, // Esperamos a que se cree el usuario para asignarlo al barbero
      });


      try {
        const savedBarber = await manager.save(barber);
        // Cargamos la relación user que acabamos de crear/actualizar para el mapeo
        savedBarber.user = user;
        return this.mapToBarberUser(savedBarber);
      } catch (error) {
        return handleDbExceptions(error, 'barber');
      }
    });
  }

  async updateBarber(id: string, updateBarberDto: UpdateBarberDto): Promise<BarberUser> {
    const { email, password, fullName, phone, isAdmin, isActive, ...barberData } =
      updateBarberDto;

    // Buscamos el barbero con su usuario para poder mapear después
    const barberToUpdate = await this.barbersRepository.findOne({ where: { id }, relations: { user: true } });
    if (!barberToUpdate) {
      throw new NotFoundException({ code: ErrorCode.BARBER_NOT_FOUND, message: `Barber with id ${id} not found` });
    }

    return await this.dataSource.transaction(async (manager) => {
      let user = barberToUpdate.user;

      // 1. Actualizar Usuario si hay campos de usuario
      if (email || password || fullName || phone || isAdmin !== undefined || isActive !== undefined) {
        const userUpdate: any = { email, password, fullName, phone, isActive };
        
        if (isAdmin !== undefined || updateBarberDto.roles) {
          let roles = (updateBarberDto.roles && updateBarberDto.roles.length > 0)
            ? updateBarberDto.roles
            : (isAdmin ? [UserRole.BARBER, UserRole.ADMIN] : [UserRole.BARBER]);

          // Al ser un barbero, nos aseguramos de que tenga el rol BARBER
          if (!roles.includes(UserRole.BARBER)) {
            roles = [...roles, UserRole.BARBER];
          }
          userUpdate.roles = roles;
        }

        user = await this.usersService.updateUser(barberToUpdate.userId, userUpdate, manager);
      }

      // 2. Actualizar Barbero
      if (isActive === false) {
        barberData.isAvailable = false;
      }

      const barber = await manager.preload(Barber, {
        id,
        ...barberData,
      });

      try {
        const savedBarber = await manager.save(barber!);
        savedBarber.user = user; // Aseguramos que tenga el usuario actualizado
        return this.mapToBarberUser(savedBarber);
      } catch (error) {
        return handleDbExceptions(error, 'barber');
      }
    });
  }

  async getBarberByBarberId(barberId: string): Promise<BarberUser> {
    const barber = await this.barbersRepository.findOne({ where: { id: barberId }, relations: { user: true } });
    if (!barber) {
      throw new NotFoundException({ code: ErrorCode.BARBER_NOT_FOUND, message: `Barber with id ${barberId} not found` });
    }
    
    return this.mapToBarberUser(barber);
  }

  async getBarbersByBarbershopId(barbershopId: string): Promise<BarberUser[]> {
    const barbers = await this.barbersRepository.find({ where: { barbershopId }, relations: { user: true } });
    return barbers.map(barber => this.mapToBarberUser(barber));
  }

  /**
   * Helper para transformar una entidad Barber (con su relación user cargada)
   * al formato BarberUserDto que cumple el contrato con el frontend.
   */
  private mapToBarberUser(barber: Barber): BarberUserDto {
    if (!barber.user) {
      throw new Error('User relationship not loaded for barber mapping');
    }

    // Estructuramos el objeto para que coincida con lo que espera BarberUserDto:
    // Los campos de BaseUser al primer nivel, y el perfil del barbero en la propiedad 'barber'.
    const mappingData = {
      ...barber.user,
      barber: barber
    };

    return plainToInstance(BarberUserDto, mappingData, { excludeExtraneousValues: true });
  }
}
