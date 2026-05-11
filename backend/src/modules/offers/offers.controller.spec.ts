import { Test, TestingModule } from '@nestjs/testing';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferResponseDTO } from '@barber/shared/types';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

describe('OffersController', () => {
  let controller: OffersController;
  let service: OffersService;

  const mockBarber = {
    barberId: 'barber-123',
    barbershopId: 'shop-456',
  };

  const mockOfferResponse: OfferResponseDTO = {
    id: 'offer-1',
    title: 'Corte Tradicional',
    description: 'Corte a tijera',
    price: 1200,
    duration: 45,
    isActive: true,
    barberId: 'barber-123',
    barbershopId: 'shop-456',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockOffersService = {
    findAllOffersByBarber: jest.fn(),
    createOfferByBarber: jest.fn(),
    updateOfferByBarber: jest.fn(),
    removeOfferByBarber: jest.fn(),
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

  describe('findByBarber', () => {
    it('debería llamar al servicio con los datos del barbero inyectados', async () => {
      mockOffersService.findAllOffersByBarber.mockResolvedValue([mockOfferResponse]);

      const result = await controller.findByBarber(mockBarber);

      expect(service.findAllOffersByBarber).toHaveBeenCalledWith(
        mockBarber.barberId,
        mockBarber.barbershopId,
      );
      expect(result).toEqual([mockOfferResponse]);
    });
  });

  describe('createOffer', () => {
    it('debería pasar el DTO y los IDs del barbero al servicio', async () => {
      const dto: CreateOfferDto = { title: 'Nuevo Corte', price: 1000, duration: 30, description: null };
      mockOffersService.createOfferByBarber.mockResolvedValue(mockOfferResponse);

      const result = await controller.createOffer(dto, mockBarber);

      expect(service.createOfferByBarber).toHaveBeenCalledWith(
        dto,
        mockBarber.barberId,
        mockBarber.barbershopId,
      );
      expect(result).toEqual(mockOfferResponse);
    });
  });

  describe('updateOffer', () => {
    it('debería llamar al servicio con el ID, el DTO y los IDs del barbero', async () => {
      const dto: UpdateOfferDto = { price: 1500 };
      const offerId = 'offer-1';
      mockOffersService.updateOfferByBarber.mockResolvedValue(mockOfferResponse);

      const result = await controller.updateOffer(offerId, dto, mockBarber);

      expect(service.updateOfferByBarber).toHaveBeenCalledWith(
        offerId,
        dto,
        mockBarber.barberId,
        mockBarber.barbershopId,
      );
      expect(result).toEqual(mockOfferResponse);
    });
  });

  describe('removeOffer', () => {
    it('debería llamar al servicio para eliminar la oferta', async () => {
      const offerId = 'offer-1';
      mockOffersService.removeOfferByBarber.mockResolvedValue(undefined);

      await controller.removeOffer(offerId, mockBarber);

      expect(service.removeOfferByBarber).toHaveBeenCalledWith(
        offerId,
        mockBarber.barberId,
        mockBarber.barbershopId,
      );
    });
  });
});
