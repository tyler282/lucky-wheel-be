import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ErrorMessage } from '../../common/message_const/error_message';

export class CreateRedeemGiftDto {
  @ApiProperty({
    description: 'Total point of the redeem gift',
  })
  @IsNumber()
  @IsNotEmpty({ message: `Total point ${ErrorMessage.IS_REQUIRED}` })
  totalPoint: number;

  @ApiProperty({
    description: 'Name of the redeem gift',
  })
  @IsString()
  // @IsNotEmpty({ message: `Name ${ErrorMessage.IS_REQUIRED}` })
  name: string;
}
