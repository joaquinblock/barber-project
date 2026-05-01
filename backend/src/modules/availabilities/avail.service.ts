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

  create(createAvailDto: CreateAvailDto) {
    return 'This action adds a new availability';
  }

  async findByBarber(barberId: string): Promise<Avail[]> {
    return this.availRepository.find({
      where: { barberId },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} availability`;
  }

  update(id: number, updateAvailDto: UpdateAvailDto) {
    return `This action updates a #${id} availability`;
  }

  remove(id: number) {
    return `This action removes a #${id} availability`;
  }
}
