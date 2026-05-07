import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateAvailDto } from './dto/create-avail.dto';
import { UpdateAvailDto } from './dto/update-availability.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Avail } from './entities/avail.entity';
import { Repository, LessThan, MoreThan, Not } from 'typeorm';
import { DayOfWeek } from '@/common/enums/day-of-week.enum';
import { ErrorCode } from '@barber/shared/errors';
import { handleDbExceptions } from '@/common/utils/handle-db-exceptions';
import { AvailResponseDTO } from '@barber/shared';
import { plainToInstance } from 'class-transformer';
import { AvailResponseDto } from './dto/avail-response.dto';

@Injectable()
export class AvailService {
  constructor(
    @InjectRepository(Avail)
    private readonly availRepository: Repository<Avail>,
  ) {}

  /**
   * Crea una disponibilidad para un barbero
   * 
   * @param createAvailDto - Datos de la disponibilidad
   * @param barber - Datos del barbero
   * @returns Promise<Avail> - Disponibilidad creada
   */
  async createAvailByBarber(createAvailDto: CreateAvailDto, barberId: string, barbershopId: string ): Promise<AvailResponseDTO> {
    const { startTime, endTime, dayOfWeek } = createAvailDto;

    // Verificar si hay solapamiento: (nuevoStart < existenteEnd) AND (nuevoEnd > existenteStart)
    const overlapping = await this.availRepository.findOne({
      where: {
        barberId,
        barbershopId,
        dayOfWeek,
        startTime: LessThan(endTime),
        endTime: MoreThan(startTime),
      },
    });

    if (overlapping) {
      throw new ConflictException({
        code: ErrorCode.AVAIL_OVERLAP,
        message: 'El horario se solapa con uno existente',
      });
    }

    const newAvail = this.availRepository.create({
      ...createAvailDto,
      barberId,
      barbershopId,
    });
    try {
      const savedAvail = await this.availRepository.save(newAvail);
      return plainToInstance(AvailResponseDto, savedAvail, { excludeExtraneousValues: true });
    } catch (error) {
      handleDbExceptions(error, 'availabilities');
      throw error;
    }
  }

  /**
   * Busca todas las disponibilidades de un barbero
   * 
   * find() : Retorna un array de objetos que coinciden con la condición.
   * 
   * @param barberId - ID del barbero
   * @returns Promise<Avail[]> - Lista de disponibilidades
   * 
   */
  async findAllAvailsByBarber(barberId: string, barbershopId: string): Promise<AvailResponseDTO[]> {
    const avails = await this.availRepository.find({
      where: { barberId, barbershopId },
      order: {
        dayOfWeek: 'ASC',
        startTime: 'ASC',
      },
    });
    return plainToInstance(AvailResponseDto, avails, { excludeExtraneousValues: true });
  }

  /**
   * Actualiza un intervalo de disponibilidad para un barbero
   * 
   * Object.assign() es un método de JavaScript que copia las propiedades del objeto de la derecha y la sobreescribe en el objeto de la izquierda.
   * findOne() : Retorna un objeto que coincide con la condición.
   * 
   * 
   * @param id - ID de la disponibilidad
   * @param updateAvailDto - Datos a actualizar
   * @param barberId - ID del barbero
   * @returns Promise<Avail> - Disponibilidad actualizada
   * @throws NotFoundException - Si la disponibilidad no existe
   * @throws ConflictException - Si el horario se solapa con uno existente
   */
  async updateAvailByBarber(id: string, updateAvailDto: UpdateAvailDto, barberId: string, barbershopId: string ): Promise<AvailResponseDTO> {
    const avail = await this.availRepository.findOne({ where: { id, barberId, barbershopId } });
    if (!avail) throw new NotFoundException({
      code: ErrorCode.AVAIL_NOT_FOUND,
      message: 'Disponibilidad no encontrada',
    });

    const startTime = updateAvailDto.startTime || avail.startTime;
    const endTime = updateAvailDto.endTime || avail.endTime;
    const dayOfWeek = updateAvailDto.dayOfWeek || avail.dayOfWeek;

    // Verificar si hay solapamiento excluyendo el registro actual
    const overlapping = await this.availRepository.findOne({
      where: {
        barberId,
        barbershopId,
        dayOfWeek,
        startTime: LessThan(endTime),
        endTime: MoreThan(startTime),
        id: Not(id),
      },
    });

    if (overlapping) {
      throw new ConflictException({
        code: ErrorCode.AVAIL_OVERLAP,
        message: 'El horario se solapa con uno existente',
      });
    }
    
    Object.assign(avail, updateAvailDto);

    try {
      const savedAvail = await this.availRepository.save(avail);
      return plainToInstance(AvailResponseDto, savedAvail, { excludeExtraneousValues: true });
    } catch (error) {
      handleDbExceptions(error, 'availabilities');
      throw error;
    }
  }

  /**
   * Elimina un intervalo de disponibilidad para un barbero
   * 
   * @param id - ID de la disponibilidad
   * @param barberId - ID del barbero
   * @throws NotFoundException - Si la disponibilidad no existe
   */
  async removeAvailByBarber(id: string, barberId: string, barbershopId: string ): Promise<void> {
    const avail = await this.availRepository.findOne({ where: { id, barberId, barbershopId } });
    if (!avail) throw new NotFoundException({
      code: ErrorCode.AVAIL_NOT_FOUND,
      message: 'Disponibilidad no encontrada',
    });
    try {
      await this.availRepository.remove(avail);
    } catch (error) {
      handleDbExceptions(error, 'availabilities');
      throw error;
    }
  }

  /**
   * Elimina todos los intervalos de disponibilidad para un día de la semana específico de un barbero
   * 
   * Se hace con delete para que borre todos los intervalos que coincidan con el día de la semana, remove solo borra uno.
   * 
   * @param barberId - ID del barbero
   * @param dayOfWeek - Día de la semana
   */
  async removeAvailsByDay(dayOfWeek: DayOfWeek, barberId: string, barbershopId: string): Promise<void> {
    try {
      await this.availRepository.delete({ dayOfWeek, barberId, barbershopId });
    } catch (error) {
      handleDbExceptions(error, 'availabilities');
      throw error;
    }
  }
}
