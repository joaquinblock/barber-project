import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { handleDbExceptions } from '@/common/utils/handle-db-exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  //Se le pasa un manager porque 
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
}
