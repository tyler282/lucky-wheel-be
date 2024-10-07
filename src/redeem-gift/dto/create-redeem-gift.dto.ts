import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ErrorMessage } from '../../common/response-message';

export class CreateRedeemGiftDto {
  @ApiProperty({
    description: 'Total point of the redeem gift',
    minimum: 1,
  })
  @IsNumber()
  @Min(1, { message: `Total point ${ErrorMessage.GREATER_THAN_ZERO}` })
  @IsNotEmpty({ message: `Total point ${ErrorMessage.IS_REQUIRED}` })
  totalPoint: number;

  @ApiProperty({
    description: 'Name of the redeem gift',
  })
  @IsString()
  @IsNotEmpty({ message: `Name ${ErrorMessage.IS_REQUIRED}` })
  name: string;
}
