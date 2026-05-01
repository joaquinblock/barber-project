import { Injectable } from '@nestjs/common';
import { CreateApptDto } from './dto/create-appt.dto';
import { UpdateApptDto } from './dto/update-appt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appt } from './entities/appt.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ApptsService {
  constructor(
    @InjectRepository(Appt)
    private readonly apptRepository: Repository<Appt>,
  ) {}

  create(createApptDto: CreateApptDto) {
    return 'This action adds a new appointment';
  }

  async findByBarber(barberId: string): Promise<Appt[]> {
    return this.apptRepository.find({
      where: { barberId },
      relations: {
        barber: true,
        customer: true,
        offer: true,
      },
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateApptDto: UpdateApptDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
