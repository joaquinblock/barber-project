import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CreateOfferDto } from "./create-offer.dto";

describe('CreateOfferDto', () => {
  const validateDto = async (dto: any) => {
    const instance = plainToInstance(CreateOfferDto, dto);
    return await validate(instance);
  };

  const validBase = {
    title: 'Corte de Pelo',
    description: 'Descripción',
    price: 1500.50,
    duration: 45,
  };

  it('debería validar una oferta válida', async () => {
    const errors = await validateDto(validBase);
    expect(errors.length).toBe(0);
  });

  describe('validaciones de description', () => {
    it('debería fallar cuando falta description', async () => {
      const { description, ...dto } = validBase;
      const errors = await validateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('debería ser válido cuando description es null', async () => {
      const dto = { ...validBase, description: null };
      const errors = await validateDto(dto);
      expect(errors.length).toBe(0);
    });

    it('debería aplicar Trim a la descripción si existe', async () => {
      const instance = plainToInstance(CreateOfferDto, { ...validBase, description: '  Detalle  ' });
      expect(instance.description).toBe('Detalle');
    });
  });

  describe('casos frontera (éxito)', () => {
    it.each([
      { field: 'title', value: 'a'.repeat(100), desc: 'exactamente 100 caracteres' },
      { field: 'price', value: 0,               desc: 'cero' },
      { field: 'price', value: 0.01,            desc: 'mínimo decimal' },
      { field: 'duration', value: 1,            desc: 'mínimo 1 minuto' },
    ])('debería ser válido cuando $field es $desc', async ({ field, value }) => {
      const dto = { ...validBase, [field]: value };
      const errors = await validateDto(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('casos de error y fronteras (falla)', () => {
    it.each([
      { field: 'title', value: '',              desc: 'vacío' },
      { field: 'title', value: 'a'.repeat(101), desc: 'muy largo (>100)' },
      { field: 'title', value: 123,             desc: 'no es string' },
      { field: 'price', value: -1,              desc: 'negativo' },
      { field: 'price', value: 100.555,         desc: 'más de 2 decimales' },
      { field: 'price', value: '100',           desc: 'es un string' },
      { field: 'duration', value: 0,            desc: 'menor a 1' },
      { field: 'duration', value: 0.5,          desc: 'no es entero' },
      { field: 'duration', value: '30',         desc: 'es un string' },
    ])('debería fallar cuando $field es $desc', async ({ field, value }) => {
      const dto = { ...validBase, [field]: value };
      const errors = await validateDto(dto);
      expect(errors.some(e => e.property === field)).toBe(true);
    });
  });

  it('debería aplicar Trim al título', async () => {
    const instance = plainToInstance(CreateOfferDto, { ...validBase, title: '   Corte   ' });
    expect(instance.title).toBe('Corte');
  });
});