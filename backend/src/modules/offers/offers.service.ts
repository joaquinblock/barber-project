import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { handleDbExceptions } from '@/common/utils/handle-db-exceptions';
import { OfferResponseDTO } from '@barber/shared';
import { OfferResponseDto } from './dto/offer-response.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OffersService {
  constructor (
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>
  ) {}

  async findAllOffersByBarber(barbershopId: string, barberId: string): Promise<OfferResponseDTO[]> {
    const offers = await this.offersRepository.find({
      where: { barberId, barbershopId },
      order: {
        createdAt: 'DESC',
      }
    });
    //SELECT * FROM offers WHERE barber_id = ? AND barbershop_id = ?;
    return plainToInstance(OfferResponseDto, offers, { excludeExtraneousValues: true });
  }

  async createOfferByBarber(createOfferDto: CreateOfferDto, barbershopId: string, barberId: string): Promise<OfferResponseDTO> {
    const offer = this.offersRepository.create({
      ...createOfferDto,
      barberId,
      barbershopId
    });

    try {
      const savedOffer = await this.offersRepository.save(offer);
      return plainToInstance(OfferResponseDto, savedOffer, { excludeExtraneousValues: true });
    } catch (error) {
      handleDbExceptions(error, 'servicio');
      throw error; //Nunca llega a ejecutarse, pero es necesario para que TypeScript no marque un error de tipo en el método createOffer, ya que handleDbExceptions lanza una excepción y no retorna nada.
    }  
  }

  async updateOfferByBarber(id: string, updateOfferDto: UpdateOfferDto, barbershopId: string, barberId: string): Promise<OfferResponseDTO> {
    const offer = await this.offersRepository.findOne({
      where: { id, barberId, barbershopId },
    });
    //SELECT * FROM offers WHERE id = ? AND barber_id = ? AND barbershop_id = ?;
    if (!offer) {
      throw new NotFoundException(`Offer with id "${id}" not found`);
    }
    const updatedOffer = this.offersRepository.merge(offer, updateOfferDto);
    try {
      const savedOffer = await this.offersRepository.save(updatedOffer);
      return plainToInstance(OfferResponseDto, savedOffer, { excludeExtraneousValues: true });
    } catch (error) {
      handleDbExceptions(error, 'servicio');
      throw error; //Nunca llega a ejecutarse, pero es necesario para que TypeScript no marque un error de tipo en el método updateOffer, ya que handleDbExceptions lanza una excepción y no retorna nada.
    }  
  }

  async removeOfferByBarber(id: string, barbershopId: string, barberId: string): Promise<void> {
    const offer = await this.offersRepository.findOne({
      where: { id, barberId, barbershopId },
    });
    //SELECT * FROM offers WHERE id = ? AND barber_id = ? AND barbershop_id = ?;
    if (!offer) {
      throw new NotFoundException(`Offer with id "${id}" not found`);
    }
    
    await this.offersRepository.remove(offer);
    //DELETE FROM offers WHERE id = ? AND barber_id = ? AND barbershop_id = ?;
  } 
}
