import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { handleDbExceptions } from '@/common/utils/handle-db-exceptions';
import { CreateBarbershopDto } from './dto/create-barbershop.dto';
import { Barbershop } from './entities/barbershop.entity';
import { slugify } from '@/common/utils/slugify';

@Injectable()
export class BarbershopService {
  constructor(
    @InjectRepository(Barbershop)
    private readonly barbershopRepository: Repository<Barbershop>,
  ) {}

  async create(createBarbershopDto: CreateBarbershopDto): Promise<Barbershop> {
    const slug = slugify(createBarbershopDto.name);

    const barbershop = this.barbershopRepository.create({
      ...createBarbershopDto,
      slug: slug,
    });

    try {
      return await this.barbershopRepository.save(barbershop);
    } catch (error) {
      handleDbExceptions(error, 'barbershop');
      throw error; //Nunca llega a ejecutarse, pero es necesario para que TypeScript no marque un error de tipo en el método create, ya que handleDbExceptions lanza una excepción y no retorna nada.
    }
  }

  async findOneBySlug(slug: string): Promise<Barbershop> {
    const barbershop = await this.barbershopRepository.findOneBy({ slug });

    if (!barbershop) {
      throw new NotFoundException(`Barbería con slug "${slug}" no encontrada.`);
    }

    return barbershop;
  }

  async remove(id: string): Promise<void> {
    const result = await this.barbershopRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Barbería con ID "${id}" no encontrada.`);
    }
  }
}
