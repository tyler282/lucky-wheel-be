import { PartialType } from '@nestjs/mapped-types';
import { CreateRedeemGiftDto } from './create-redeem-gift.dto';

export class UpdateRedeemGiftDto extends PartialType(CreateRedeemGiftDto) {}
