import { PartialType } from '@nestjs/mapped-types';
import { CreateRedeemGiftDto } from './create-redeem-gift.dto';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ErrorMessage } from '../../common/response-message';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class UpdateRedeemGiftDto {
  @ApiProperty({
    description: 'Id of the redeem gift',
  })
  @IsNumber()
  @IsNotEmpty({ message: `RedeemGiftId ${ErrorMessage.IS_REQUIRED}` })
  id: number;

  @ApiProperty({
    description: 'Total point of the redeem gift',
    minimum: 1,
  })
  @IsNumber()
  @Min(1, { message: `Total point ${ErrorMessage.GREATER_THAN_ZERO}` })
  totalPoint?: number;

  @ApiProperty({
    description: 'Name of the redeem gift',
  })
  @IsString()
  @IsOptional()
  name?: string;
}
