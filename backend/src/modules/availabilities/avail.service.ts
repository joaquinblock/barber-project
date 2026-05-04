import { Injectable } from '@nestjs/common';
import { CreateAvailDto } from './dto/create-avail.dto';
import { UpdateAvailDto } from './dto/update-availability.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Avail } from './entities/avail.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AvailService {
  constructor(
    @InjectRepository(Avail)
    private readonly availRepository: Repository<Avail>,
  ) {}

  async create(createAvailDto: CreateAvailDto): Promise<Avail> {
    const newAvail = this.availRepository.create(createAvailDto);
    return this.availRepository.save(newAvail);
  }

  async findByBarber(barberId: string): Promise<Avail[]> {
    return this.availRepository.find({
      where: { barberId },
    });
  }

  findOne(id: string) {
    return this.availRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    await this.availRepository.delete(id);
  }

  async removeByDay(barberId: string, dayOfWeek: string) {
    await this.availRepository.delete({ barberId, dayOfWeek: dayOfWeek as any });
  }
}
