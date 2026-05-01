import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { handleDbExceptions } from '@/common/utils/handle-db-exceptions';

@Injectable()
export class OffersService {
  constructor (
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>
  ) {}

  async findByBarber(barberId: string): Promise<Offer[]> {
    return this.offersRepository.find({
      where: { barberId },
      order: { title: 'ASC' },
    });
  }

  async createOffer(createOfferDto: CreateOfferDto): Promise<Offer> {
    const offer = this.offersRepository.create(createOfferDto);

    try {
      return await this.offersRepository.save(offer);
    } catch (error) {
      handleDbExceptions(error, 'offers');
      throw error; //Nunca llega a ejecutarse, pero es necesario para que TypeScript no marque un error de tipo en el método createOffer, ya que handleDbExceptions lanza una excepción y no retorna nada.
    }  
  }
}
