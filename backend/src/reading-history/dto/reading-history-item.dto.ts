import { ApiProperty } from "@nestjs/swagger";
import { NewsItemDto } from "./news-item.dto";
export class ReadingHistoryItemDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  readAt: Date;

  @ApiProperty({ type: NewsItemDto })
  news: NewsItemDto;
}
