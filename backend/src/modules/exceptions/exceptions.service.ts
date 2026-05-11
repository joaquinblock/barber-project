import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExceptionFullDayDto } from './dto/create-exception-full-day.dto';
import { UpdateExceptionRangeDto } from './dto/update-exception-range.dto';
import { UpdateExceptionFullDayDto } from './dto/update-exception-full-day.dto';
import { CreateExceptionRangeDto } from './dto/create-exception-range.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Exception } from './entities/exception.entity';
import { Repository } from 'typeorm';
import { ExceptionResponseDTO } from '@barber/shared';
import { plainToInstance } from 'class-transformer';
import { ExceptionResponseDto } from './dto/exception-response.dto';
import { handleDbExceptions } from '@/common/utils/handle-db-exceptions';

@Injectable()
export class ExceptionsService {
  constructor(
    @InjectRepository(Exception)
    private readonly exceptionsRepository: Repository<Exception>,
  ) {}

  async findAllExceptionsByBarber(barbershopId: string, barberId: string): Promise<ExceptionResponseDTO[]> {
    const exceptions = await this.exceptionsRepository.find({
      where: {
        barbershopId,
        barberId,
      },
    });
    return plainToInstance(ExceptionResponseDto, exceptions, { excludeExtraneousValues: true });
  }

  async createExceptionFullDay(dto: CreateExceptionFullDayDto, barbershopId: string, barberId: string): Promise<ExceptionResponseDTO> {
    const exception = this.exceptionsRepository.create({
      ...dto,
      endDate: dto.startDate,
      barbershopId,
      barberId,
    });
    try {
      const savedException = await this.exceptionsRepository.save(exception);
      return plainToInstance(ExceptionResponseDto, savedException, { excludeExtraneousValues: true });
    } catch (error) {
      handleDbExceptions(error, 'exceptions');
      throw error; //Nunca llega a ejecutarse, pero es necesario para que TypeScript no marque un error de tipo en el método createException, ya que handleDbExceptions lanza una excepción y no retorna nada.
    }  
  }

  async createExceptionRange(dto: CreateExceptionRangeDto, barbershopId: string, barberId: string): Promise<ExceptionResponseDTO> {
    const exception = this.exceptionsRepository.create({
      ...dto,
      barbershopId,
      barberId,
    });
    try {
      const savedException = await this.exceptionsRepository.save(exception);
      return plainToInstance(ExceptionResponseDto, savedException, { excludeExtraneousValues: true });
    } catch (error) {
      handleDbExceptions(error, 'exceptions');
      throw error; //Nunca llega a ejecutarse, pero es necesario para que TypeScript no marque un error de tipo en el método createException, ya que handleDbExceptions lanza una excepción y no retorna nada.
    }  
  }

  async deleteException(id: string, barbershopId: string, barberId: string): Promise<void> {
    try {
      const exception = await this.exceptionsRepository.findOne({
        where: {
          id,
          barbershopId,
          barberId,
        },
      });

      if (!exception) {
        throw new NotFoundException('Excepción no encontrada');
      }

      await this.exceptionsRepository.remove(exception);
    } catch (error) {
      handleDbExceptions(error, 'exceptions');
      throw error; 
    }  
  }
}
