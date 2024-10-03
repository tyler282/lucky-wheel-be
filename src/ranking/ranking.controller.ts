import { Body, Controller, Post } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { FilterRankingDto } from './dto/filter-ranking.dto';

@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Post()
  findAll(@Body() filter: FilterRankingDto) {
    return this.rankingService.findAll(filter);
  }
}
