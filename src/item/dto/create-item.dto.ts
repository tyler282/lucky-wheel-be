import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({})
  name: string;
  @ApiProperty({})
  value: number;
  @ApiProperty({})
  color: string;
  @ApiProperty({})
  catergoryId: number;
}
