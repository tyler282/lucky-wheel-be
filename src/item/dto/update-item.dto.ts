import { PartialType } from '@nestjs/mapped-types';
import { CreateItemDto } from './create-item.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ErrorMessage } from '../../common/response-message';
export class UpdateItemDto extends PartialType(CreateItemDto) {
    @IsNumber()
    @IsNotEmpty({ message: `itemId ${ErrorMessage.IS_REQUIRED}` })
    id: number;
    @IsString()
    img?: string;
}
