import { PartialType } from '@nestjs/mapped-types';
import { CreateSpinHistoryDto } from './create-spin-history.dto';

export class UpdateSpinHistoryDto extends PartialType(CreateSpinHistoryDto) {}
