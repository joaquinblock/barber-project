import { Injectable, NotFoundException } from '@nestjs/common';
import { ErrorCode } from '@business/shared/errors';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { handleDbExceptions } from '@/common/utils/handle-db-exceptions';
import { CreateBusinessDto } from './dto/create-business.dto';
import { Business } from './entities/business.entity';
import { slugify } from '@/common/utils/slugify';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async create(createBusinessDto: CreateBusinessDto): Promise<Business> {
    const slug = slugify(createBusinessDto.name);

    const business = this.businessRepository.create({
      ...createBusinessDto,
      slug: slug,
      isActive: true,
    });

    try {
      return await this.businessRepository.save(business);
    } catch (error) {
      handleDbExceptions(error, 'business');
      throw error; //Nunca llega a ejecutarse, pero es necesario para que TypeScript no marque un error de tipo en el método create, ya que handleDbExceptions lanza una excepción y no retorna nada.
    }
  }

  async findOneBySlug(slug: string): Promise<Business> {
    const business = await this.businessRepository.findOneBy({ slug });

    if (!business) {
      throw new NotFoundException({
        code: ErrorCode.BUSINESS_NOT_FOUND,
        message: `Professionalía con slug "${slug}" no encontrada.`,
      });
    }

    return business;
  }

  async remove(id: string): Promise<void> {
    const result = await this.businessRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException({
        code: ErrorCode.BUSINESS_NOT_FOUND,
        message: `Professionalía con ID "${id}" no encontrada.`,
      });
    }
  }
}
