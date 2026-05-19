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
    professionalId: 'professional-1',
    businessId: 'shop-1',
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

  describe('findAllOffersByProfessional', () => {
    it('debería retornar un array de ofertas filtradas por professionalo y professionalía', async () => {
      mockRepository.find.mockResolvedValue([mockOffer]);

      const result = await service.findAllOffersByProfessional('professional-1', 'shop-1');

      expect(repository.find).toHaveBeenCalledWith({
        where: { professionalId: 'professional-1', businessId: 'shop-1' },
        order: { createdAt: 'DESC' },
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(mockOffer.id);
    });
  });

  describe('createOfferByProfessional', () => {
    it('debería crear y guardar una nueva oferta', async () => {
      const dto: CreateOfferDto = { title: 'Corte', price: 1500, duration: 30, description: null };
      mockRepository.create.mockReturnValue(mockOffer);
      mockRepository.save.mockResolvedValue(mockOffer);

      const result = await service.createOfferByProfessional(dto, 'professional-1', 'shop-1');

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalled();
      expect(result.id).toBe(mockOffer.id);
    });
  });

  describe('updateOfferByProfessional', () => {
    it('debería actualizar una oferta si pertenece al professionalo', async () => {
      const dto: UpdateOfferDto = { title: 'Corte Pro' };
      mockRepository.findOne.mockResolvedValue(mockOffer);
      mockRepository.merge.mockReturnValue({ ...mockOffer, ...dto });
      mockRepository.save.mockResolvedValue({ ...mockOffer, ...dto });

      const result = await service.updateOfferByProfessional('uuid-1', dto, 'professional-1', 'shop-1');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-1', professionalId: 'professional-1', businessId: 'shop-1' },
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result.title).toBe('Corte Pro');
    });

    it('debería lanzar NotFoundException si la oferta no existe o no pertenece al professionalo', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateOfferByProfessional('invalid-id', {}, 'professional-1', 'shop-1')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeOfferByProfessional', () => {
    it('debería eliminar una oferta si pertenece al professionalo', async () => {
      mockRepository.findOne.mockResolvedValue(mockOffer);
      mockRepository.remove.mockResolvedValue(mockOffer);

      await service.removeOfferByProfessional('uuid-1', 'professional-1', 'shop-1');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-1', professionalId: 'professional-1', businessId: 'shop-1' },
      });
      expect(repository.remove).toHaveBeenCalledWith(mockOffer);
    });

    it('debería lanzar NotFoundException si la oferta no existe para ese professionalo', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.removeOfferByProfessional('uuid-1', 'professional-1', 'shop-1')
      ).rejects.toThrow(NotFoundException);
    });
  });
});
