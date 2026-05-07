import { Test, TestingModule } from '@nestjs/testing';
import { AvailService } from './avail.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Avail } from './entities/avail.entity';
import { DayOfWeek } from '@/common/enums/day-of-week.enum';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository, LessThan, MoreThan, Not } from 'typeorm';

describe('AvailService', () => {
  let service: AvailService;
  let repository: Repository<Avail>;

  const mockAvailRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvailService,
        {
          provide: getRepositoryToken(Avail),
          useValue: mockAvailRepository,
        },
      ],
    }).compile();

    service = module.get<AvailService>(AvailService);
    repository = module.get<Repository<Avail>>(getRepositoryToken(Avail));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const barber = { barberId: 'barber-1', barbershopId: 'shop-1' };
    const createDto = {
      dayOfWeek: DayOfWeek.MON,
      startTime: '08:00',
      endTime: '13:00',
    };

    it('debería crear una disponibilidad si no hay solapamientos', async () => {
      mockAvailRepository.findOne.mockResolvedValue(null);
      mockAvailRepository.create.mockReturnValue(createDto);
      mockAvailRepository.save.mockResolvedValue({ id: '1', ...createDto, ...barber });

      const result = await service.create(createDto, barber);

      expect(result).toBeDefined();
      expect(mockAvailRepository.findOne).toHaveBeenCalledWith({
        where: {
          barberId: barber.barberId,
          dayOfWeek: createDto.dayOfWeek,
          startTime: LessThan(createDto.endTime),
          endTime: MoreThan(createDto.startTime),
        },
      });
      expect(mockAvailRepository.save).toHaveBeenCalled();
    });

    it('debería fallar si hay un solapamiento (nuevo intervalo dentro de uno existente)', async () => {
      mockAvailRepository.findOne.mockResolvedValue({ id: 'existing-1' });

      await expect(service.create(
        { ...createDto, startTime: '09:00', endTime: '10:00' },
        barber
      )).rejects.toThrow(ConflictException);
    });

    it('debería fallar si el nuevo intervalo envuelve a uno existente', async () => {
        mockAvailRepository.findOne.mockResolvedValue({ id: 'existing-1' });
  
        await expect(service.create(
          { ...createDto, startTime: '07:00', endTime: '14:00' },
          barber
        )).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    const barberId = 'barber-1';
    const existingAvail = {
      id: '1',
      dayOfWeek: DayOfWeek.MON,
      startTime: '08:00',
      endTime: '13:00',
      barberId,
    };

    it('debería actualizar si no hay solapamientos con otros registros', async () => {
      mockAvailRepository.findOne
        .mockResolvedValueOnce(existingAvail) // Para encontrar el registro a editar
        .mockResolvedValueOnce(null); // Para la validación de solapamiento

      const updateDto = { startTime: '09:00' };
      await service.update('1', updateDto, barberId);

      expect(mockAvailRepository.save).toHaveBeenCalled();
    });

    it('debería fallar al actualizar si el nuevo horario solapa con otro registro', async () => {
      mockAvailRepository.findOne
        .mockResolvedValueOnce(existingAvail)
        .mockResolvedValueOnce({ id: 'other-2' }); // Se encontró otro registro que solapa

      const updateDto = { startTime: '12:00', endTime: '15:00' };
      
      await expect(service.update('1', updateDto, barberId))
        .rejects.toThrow(ConflictException);
    });

    it('debería permitir actualizar si el solapamiento es con el mismo registro (id: Not(id))', async () => {
        // En la vida real TypeORM no devolvería nada si filtramos por id: Not(id) y solo hay ese registro
        mockAvailRepository.findOne
          .mockResolvedValueOnce(existingAvail)
          .mockResolvedValueOnce(null); 
  
        const updateDto = { startTime: '08:30' }; // Solo cambia media hora
        await service.update('1', updateDto, barberId);
  
        expect(mockAvailRepository.save).toHaveBeenCalled();
      });

      it('debería lanzar NotFoundException si intento actualizar un registro ajeno', async () => {
        // Simulamos que el registro no existe para este barberId específico
        mockAvailRepository.findOne.mockResolvedValue(null);

        await expect(service.update('123', { startTime: '09:00' }, 'barber-ajeno'))
          .rejects.toThrow(NotFoundException);
      });
  });
});
