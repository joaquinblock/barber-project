import { plainToInstance } from 'class-transformer';
import { OfferResponseDto } from './offer-response.dto';

describe('OfferResponseDto', () => {
  const rawOffer = {
    id: 'uuid-123',
    title: 'Corte de Pelo',
    price: '1500.50', // Viene como string de la DB (Decimal)
    duration: '45',    // Viene como string de la DB (BigInt o similar)
    description: 'Descripción del servicio',
    isActive: true,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T11:00:00Z'),
    barberId: 'barber-1',
    barbershopId: 'shop-1',
    internalField: 'secret', // Debe ser excluido
  };

  it('debería transformar strings de DB a números y fechas a ISO strings', () => {
    const instance = plainToInstance(OfferResponseDto, rawOffer, { 
      excludeExtraneousValues: true 
    });

    expect(typeof instance.price).toBe('number');
    expect(instance.price).toBe(1500.50);
    
    expect(typeof instance.duration).toBe('number');
    expect(instance.duration).toBe(45);

    expect(instance.createdAt).toBe('2023-01-01T10:00:00.000Z');
    expect(instance.updatedAt).toBe('2023-01-01T11:00:00.000Z');
  });

  it('debería excluir campos que no tengan @Expose()', () => {
    const instance = plainToInstance(OfferResponseDto, rawOffer, { 
      excludeExtraneousValues: true 
    });

    expect((instance as any).internalField).toBeUndefined();
    expect(instance.id).toBe(rawOffer.id);
    expect(instance.title).toBe(rawOffer.title);
  });
});
