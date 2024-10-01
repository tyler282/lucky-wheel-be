import { PartialType } from '@nestjs/mapped-types';
import { CreateRedeemPointHistoryDto } from './create-redeem-point-history.dto';

export class UpdateRedeemPointHistoryDto extends PartialType(
  CreateRedeemPointHistoryDto,
) {}
