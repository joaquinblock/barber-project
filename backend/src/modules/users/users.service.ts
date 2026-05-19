import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { handleDbExceptions } from '@/common/utils/handle-db-exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { UserResponseDTO } from '@business/shared/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  //Se le pasa un manager porque la transaccion corre por cuenta de professional.service.ts
  async registerUser(
    createUserDto: CreateUserDto,
    manager?: EntityManager,
  ): Promise<UserResponseDTO> {
    const { password, ...userData } = createUserDto;

    //Decidimos que repositorio usar dependiendo de si se pasó un manager o no
    const repo = manager ? manager.getRepository(User) : this.usersRepository;

    try {
      const user = repo.create({
        ...userData,
        password: await bcrypt.hash(password, 10),
      });
      return this.mapToResponse(await repo.save(user));
    } catch (error) {
      handleDbExceptions(error, 'user');
      throw error; //Nunca llega a ejecutarse, pero es necesario para que TypeScript no marque un error de tipo en el método create, ya que handleDbExceptions lanza una excepción y no retorna nada.
    }
  }

  async findOneByEmail(email: string): Promise<UserResponseDTO | null> {
    const user = await this.usersRepository.findOne({
      where: { email, isActive: true },
      relations: ['professional', 'customer'],
    });

    if (!user) return null;

    return this.mapToResponse(user);
  }

  /* Este método se usa únicamente para el login, por lo que no se mapea al contrato compartido, porque no se expone en el controlador, se expone en auth.controller.ts */
  async findPrivateByEmail(email: string): Promise<User | null> { 
    const user = await this.usersRepository.findOne({
      where: { email, isActive: true },
      relations: ['professional', 'customer'],
      select: { 
        id: true, 
        password: true, // Vital para login
        email: true, 
        fullName: true, 
        phone: true,
        roles: true,
        isActive: true,
        professional: { id: true },
        customer: { id: true },
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) return null;

    return user;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    manager?: EntityManager, //La transaccion corre por cuenta de professional.service.ts
  ): Promise<UserResponseDTO> {
    const repo = manager ? manager.getRepository(User) : this.usersRepository;
    
    // Si viene password, hay que hashearla
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    try {
      const user = await repo.preload({
        id,
        ...updateUserDto,
      });

      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }

      return this.mapToResponse(await repo.save(user));
    } catch (error) {
      handleDbExceptions(error, 'user');
      throw error;
    }
  }

  /**
   * Mapea un usuario de la base de datos al contrato compartido User.
   * Utiliza class-transformer para aplicar los decoradores @Expose y limpiar la respuesta.
   */
  mapToResponse(user: User): UserResponseDTO {
    return plainToInstance(UserResponseDto, user, { 
      excludeExtraneousValues: true,
      enableImplicitConversion: true 
    });
  }
}
