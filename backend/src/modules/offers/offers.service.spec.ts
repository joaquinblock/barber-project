import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OffersService } from './offers.service';
import { Offer } from './entities/offer.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

describe('OffersService', () => {
  let service: OffersService;
  let repository: Repository<Offer>;

  const mockOffer = {
    id: 'uuid-1',
    title: 'Corte',
    price: 1500,
    duration: 30,
    barberId: 'barber-1',
    barbershopId: 'shop-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OffersService,
        {
          provide: getRepositoryToken(Offer),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<OffersService>(OffersService);
    repository = module.get<Repository<Offer>>(getRepositoryToken(Offer));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllOffersByBarber', () => {
    it('debería retornar un array de ofertas filtradas por barbero y barbería', async () => {
      mockRepository.find.mockResolvedValue([mockOffer]);

      const result = await service.findAllOffersByBarber('barber-1', 'shop-1');

      expect(repository.find).toHaveBeenCalledWith({
        where: { barberId: 'barber-1', barbershopId: 'shop-1' },
        order: { createdAt: 'DESC' },
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(mockOffer.id);
    });
  });

  describe('createOfferByBarber', () => {
    it('debería crear y guardar una nueva oferta', async () => {
      const dto: CreateOfferDto = { title: 'Corte', price: 1500, duration: 30, description: null };
      mockRepository.create.mockReturnValue(mockOffer);
      mockRepository.save.mockResolvedValue(mockOffer);

      const result = await service.createOfferByBarber(dto, 'barber-1', 'shop-1');

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalled();
      expect(result.id).toBe(mockOffer.id);
    });
  });

  describe('updateOfferByBarber', () => {
    it('debería actualizar una oferta si pertenece al barbero', async () => {
      const dto: UpdateOfferDto = { title: 'Corte Pro' };
      mockRepository.findOne.mockResolvedValue(mockOffer);
      mockRepository.merge.mockReturnValue({ ...mockOffer, ...dto });
      mockRepository.save.mockResolvedValue({ ...mockOffer, ...dto });

      const result = await service.updateOfferByBarber('uuid-1', dto, 'barber-1', 'shop-1');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-1', barberId: 'barber-1', barbershopId: 'shop-1' },
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result.title).toBe('Corte Pro');
    });

    it('debería lanzar NotFoundException si la oferta no existe o no pertenece al barbero', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateOfferByBarber('invalid-id', {}, 'barber-1', 'shop-1')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeOfferByBarber', () => {
    it('debería eliminar una oferta si pertenece al barbero', async () => {
      mockRepository.findOne.mockResolvedValue(mockOffer);
      mockRepository.remove.mockResolvedValue(mockOffer);

      await service.removeOfferByBarber('uuid-1', 'barber-1', 'shop-1');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-1', barberId: 'barber-1', barbershopId: 'shop-1' },
      });
      expect(repository.remove).toHaveBeenCalledWith(mockOffer);
    });

    it('debería lanzar NotFoundException si la oferta no existe para ese barbero', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.removeOfferByBarber('uuid-1', 'barber-1', 'shop-1')
      ).rejects.toThrow(NotFoundException);
    });
  });
});
