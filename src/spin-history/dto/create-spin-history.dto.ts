import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ErrorMessage } from '../../common/response-message';

export class CreateSpinHistoryDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: `userId ${ErrorMessage.IS_REQUIRED}` })
  userId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: `itemId ${ErrorMessage.IS_REQUIRED}` })
  itemId: number;
}
