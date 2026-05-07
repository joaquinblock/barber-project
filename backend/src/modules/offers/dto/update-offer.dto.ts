import { PartialType } from '@nestjs/mapped-types';
import { CreateOfferDto } from './create-offer.dto';
import { UpdateOfferDTO } from '@barber/shared/types';

export class UpdateOfferDto extends PartialType(CreateOfferDto) implements UpdateOfferDTO {}
