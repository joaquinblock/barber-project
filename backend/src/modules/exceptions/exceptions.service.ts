import { Injectable } from '@nestjs/common';
import { CreateExceptionFullDayDto } from './dto/create-exception-full-day.dto';
import { UpdateExceptionRangeDto } from './dto/update-exception-range.dto';
import { UpdateExceptionFullDayDto } from './dto/update-exception-full-day.dto';
import { CreateExceptionRangeDto } from './dto/create-exception-range.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Exception } from './entities/exception.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExceptionsService {
  constructor(
    @InjectRepository(Exception)
    private readonly exceptionsRepository: Repository<Exception>,
  ) {}

  create(createExceptionDto: CreateExceptionFullDayDto | CreateExceptionRangeDto) {
    return 'This action adds a new exception';
  }

  async findByBarber(barberId: string): Promise<Exception[]> {
    return this.exceptionsRepository.find({
      where: { barberId },
      order: { startDate: 'ASC' },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} exception`;
  }

  update(id: number, updateExceptionDto: UpdateExceptionFullDayDto | UpdateExceptionRangeDto) {
    return `This action updates a #${id} exception`;
  }

  remove(id: number) {
    return `This action removes a #${id} exception`;
  }
}
