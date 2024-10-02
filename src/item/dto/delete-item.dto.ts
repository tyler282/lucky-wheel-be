import { IsNotEmpty, IsNumber } from "class-validator";
import { ErrorMessage } from "../../common/response-message";

export class DeleteItemDto {
    @IsNumber()
    @IsNotEmpty({ message: `itemId ${ErrorMessage.IS_REQUIRED}` })
    id: number;
}