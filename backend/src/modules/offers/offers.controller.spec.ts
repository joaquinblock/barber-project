import { Test, TestingModule } from '@nestjs/testing';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferResponseDTO } from '@business/shared/types';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

describe('OffersController', () => {
  let controller: OffersController;
  let service: OffersService;

  const mockProfessional = {
    professionalId: 'professional-123',
    businessId: 'shop-456',
  };

  const mockOfferResponse: OfferResponseDTO = {
    id: 'offer-1',
    title: 'Corte Tradicional',
    description: 'Corte a tijera',
    price: 1200,
    duration: 45,
    isActive: true,
    professionalId: 'professional-123',
    businessId: 'shop-456',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockOffersService = {
    findAllOffersByProfessional: jest.fn(),
    createOfferByProfessional: jest.fn(),
    updateOfferByProfessional: jest.fn(),
    removeOfferByProfessional: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffersController],
      providers: [
        {
          provide: OffersService,
          useValue: mockOffersService,
        },
      ],
    })
    .overrideGuard(AuthGuard).useValue({ canActivate: () => true })
    .overrideGuard(RolesGuard).useValue({ canActivate: () => true })
    .compile();

    controller = module.get<OffersController>(OffersController);
    service = module.get<OffersService>(OffersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByProfessional', () => {
    it('debería llamar al servicio con los datos del professionalo inyectados', async () => {
      mockOffersService.findAllOffersByProfessional.mockResolvedValue([mockOfferResponse]);

      const result = await controller.findByProfessional(mockProfessional);

      expect(service.findAllOffersByProfessional).toHaveBeenCalledWith(
        mockProfessional.professionalId,
        mockProfessional.businessId,
      );
      expect(result).toEqual([mockOfferResponse]);
    });
  });

  describe('createOffer', () => {
    it('debería pasar el DTO y los IDs del professionalo al servicio', async () => {
      const dto: CreateOfferDto = { title: 'Nuevo Corte', price: 1000, duration: 30, description: null };
      mockOffersService.createOfferByProfessional.mockResolvedValue(mockOfferResponse);

      const result = await controller.createOffer(dto, mockProfessional);

      expect(service.createOfferByProfessional).toHaveBeenCalledWith(
        dto,
        mockProfessional.professionalId,
        mockProfessional.businessId,
      );
      expect(result).toEqual(mockOfferResponse);
    });
  });

  describe('updateOffer', () => {
    it('debería llamar al servicio con el ID, el DTO y los IDs del professionalo', async () => {
      const dto: UpdateOfferDto = { price: 1500 };
      const offerId = 'offer-1';
      mockOffersService.updateOfferByProfessional.mockResolvedValue(mockOfferResponse);

      const result = await controller.updateOffer(offerId, dto, mockProfessional);

      expect(service.updateOfferByProfessional).toHaveBeenCalledWith(
        offerId,
        dto,
        mockProfessional.professionalId,
        mockProfessional.businessId,
      );
      expect(result).toEqual(mockOfferResponse);
    });
  });

  describe('removeOffer', () => {
    it('debería llamar al servicio para eliminar la oferta', async () => {
      const offerId = 'offer-1';
      mockOffersService.removeOfferByProfessional.mockResolvedValue(undefined);

      await controller.removeOffer(offerId, mockProfessional);

      expect(service.removeOfferByProfessional).toHaveBeenCalledWith(
        offerId,
        mockProfessional.professionalId,
        mockProfessional.businessId,
      );
    });
  });
});
