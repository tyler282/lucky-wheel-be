import { PartialType } from '@nestjs/mapped-types';
import { CreateItemDto } from './create-item.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ErrorMessage } from '../../common/response-message';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateItemDto extends PartialType(CreateItemDto) {
  @ApiProperty({})
  @IsNumber()
  @IsNotEmpty({ message: `itemId ${ErrorMessage.IS_REQUIRED}` })
  id: number;
  @ApiProperty({})
  @IsString()
  img?: string;
  @ApiProperty({})
  @IsString()
  file?: string;
}

export class UpdateItemOrderDto {
  @ApiProperty({})
  @IsNumber()
  @IsNotEmpty({ message: `itemId ${ErrorMessage.IS_REQUIRED}` })
  id: number;
  @ApiProperty({})
  @IsNumber()
  @IsNotEmpty({ message: `item order ${ErrorMessage.IS_REQUIRED}` })
  order: number;
}
