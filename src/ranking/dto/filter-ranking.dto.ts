import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateIf } from 'class-validator';

export class FilterRankingDto {
  @ApiProperty({
    description: 'From date want to get ranking, optional',
  })
  @IsOptional()
  fromDate?: Date;

  @ApiProperty({
    description: 'To date want to get ranking, optional',
  })
  toDate?: Date;
}
