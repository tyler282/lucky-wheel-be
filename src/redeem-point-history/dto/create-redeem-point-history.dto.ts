import { ApiProperty } from '@nestjs/swagger';
export class CreateRedeemPointHistoryDto {
    @ApiProperty({})
    userId: number;
    @ApiProperty({})
    point: number;
    @ApiProperty({})
    redeemGiftId: number;
}
