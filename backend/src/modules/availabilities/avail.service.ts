import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateAvailDto } from './dto/create-avail.dto';
import { UpdateAvailDto } from './dto/update-availability.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Avail } from './entities/avail.entity';
import { Repository, LessThan, MoreThan, Not } from 'typeorm';
import { DayOfWeek } from '@/common/enums/day-of-week.enum';

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
  async create(createAvailDto: CreateAvailDto, barber: { barberId: string, barbershopId: string }): Promise<Avail> {
    const { startTime, endTime, dayOfWeek } = createAvailDto;

    // Verificar si hay solapamiento: (nuevoStart < existenteEnd) AND (nuevoEnd > existenteStart)
    const overlapping = await this.availRepository.findOne({
      where: {
        barberId: barber.barberId,
        dayOfWeek,
        startTime: LessThan(endTime),
        endTime: MoreThan(startTime),
      },
    });

    if (overlapping) {
      throw new ConflictException('El horario se solapa con uno existente');
    }

    const newAvail = this.availRepository.create({
      ...createAvailDto,
      barberId: barber.barberId,
      barbershopId: barber.barbershopId,
    });
    return this.availRepository.save(newAvail);
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
  async findByBarber(barberId: string): Promise<Avail[]> {
    return this.availRepository.find({
      where: { barberId },
    });
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
  async update(id: string, updateAvailDto: UpdateAvailDto, barberId: string): Promise<Avail> {
    const avail = await this.availRepository.findOne({ where: { id, barberId } });
    if (!avail) throw new NotFoundException('Disponibilidad no encontrada');

    const startTime = updateAvailDto.startTime || avail.startTime;
    const endTime = updateAvailDto.endTime || avail.endTime;
    const dayOfWeek = updateAvailDto.dayOfWeek || avail.dayOfWeek;

    // Verificar si hay solapamiento excluyendo el registro actual
    const overlapping = await this.availRepository.findOne({
      where: {
        barberId,
        dayOfWeek,
        startTime: LessThan(endTime),
        endTime: MoreThan(startTime),
        id: Not(id), //buscame problemas en cualquier lugar menos en este mismo registro, es por si queres cambiar la hora de entrada por una posterior o la de salida por una anterior
      },
    });

    if (overlapping) {
      throw new ConflictException('El horario se solapa con uno existente');
    }
    
    Object.assign(avail, updateAvailDto);

    return this.availRepository.save(avail);
  }

  /**
   * Elimina un intervalo de disponibilidad para un barbero
   * 
   * @param id - ID de la disponibilidad
   * @param barberId - ID del barbero
   * @throws NotFoundException - Si la disponibilidad no existe
   */
  async remove(id: string, barberId: string) {
    const avail = await this.availRepository.findOne({ where: { id, barberId } });
    if (!avail) throw new NotFoundException('Disponibilidad no encontrada');
    await this.availRepository.remove(avail);
  }

  /**
   * Elimina todos los intervalos de disponibilidad para un día de la semana específico de un barbero
   * 
   * Se hace con delete para que borre todos los intervalos que coincidan con el día de la semana, remove solo borra uno.
   * 
   * @param barberId - ID del barbero
   * @param dayOfWeek - Día de la semana
   */
  async removeByDay(barberId: string, dayOfWeek: DayOfWeek) {
    await this.availRepository.delete({ barberId, dayOfWeek });
  }
}
