import { ApiProperty } from "@nestjs/swagger";
import { News } from "src/news/entities/news.entity";
export class ReadingHistoryItemDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  newsId: number;

  @ApiProperty()
  readAt: Date;

  @ApiProperty({ type: News })
  news: News;
}
