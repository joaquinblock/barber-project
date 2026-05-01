import { Injectable } from '@nestjs/common';
import { CreateBarberDto } from './dto/create-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';
import { Barber } from './entities/barber.entity';
import { DataSource, Repository } from 'typeorm';
import { handleDbExceptions } from '@/common/utils/handle-db-exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../users/enum/user-role.enum';
import { UsersService } from '../users/users.service';

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
  async registerBarber(createBarberDto: CreateBarberDto): Promise<Barber> {
    const { email, password, fullName, phone, isAdmin, ...barberData } =
      createBarberDto;
    //Usamos dataSource.transaction para asegurarnos de que la creación del usuario y el barbero se realicen de forma atómica.
    //  Si ocurre un error en cualquiera de las dos operaciones, toda la transacción se revertirá y no quedará ningún registro inconsistente en la base de datos.
    return await this.dataSource.transaction(async (manager) => {
      const roles = isAdmin
        ? [UserRole.BARBER, UserRole.ADMIN]
        : [UserRole.BARBER];

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
        return await manager.save(barber);
      } catch (error) {
        return handleDbExceptions(error, 'barber');
      }
    });
  }

  async updateBarber(id: string, updateBarberDto: UpdateBarberDto): Promise<Barber> {

    if (updateBarberDto.isActive === false) {
      updateBarberDto.isAvailable === false; // Si el barbero se desactiva, también se marca como no disponible
    }

    return Promise.reject(new Error('Method not implemented.')); // Implementar la lógica de actualización del barbero, incluyendo la actualización del estado activo y disponible según corresponda.
  }
}
