import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { handleDbExceptions } from '@/common/utils/handle-db-exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  //Se le pasa un manager porque la transaccion corre por cuenta de barber.service.ts
  async registerUser(
    createUserDto: CreateUserDto,
    manager?: EntityManager,
  ): Promise<User> {
    const { password, ...userData } = createUserDto;

    //Decidimos que repositorio usar dependiendo de si se pasó un manager o no
    const repo = manager ? manager.getRepository(User) : this.usersRepository;

    try {
      const user = repo.create({
        ...userData,
        password: await bcrypt.hash(password, 10),
      });
      return await repo.save(user);
    } catch (error) {
      handleDbExceptions(error, 'user');
      throw error; //Nunca llega a ejecutarse, pero es necesario para que TypeScript no marque un error de tipo en el método create, ya que handleDbExceptions lanza una excepción y no retorna nada.
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email, isActive: true },
      relations: ['barber', 'customer'],
    });
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    manager?: EntityManager, //La transaccion corre por cuenta de barber.service.ts
  ): Promise<User> {
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

      return await repo.save(user);
    } catch (error) {
      handleDbExceptions(error, 'user');
      throw error;
    }
  }
}
