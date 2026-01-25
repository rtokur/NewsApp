import { ApiProperty } from "@nestjs/swagger";
import { ReadingHistoryItemDto } from "./reading-history-item.dto";

export class ReadingHistoryListResponseDto {
  @ApiProperty({ type: [ReadingHistoryItemDto] })
  items: ReadingHistoryItemDto[];

  @ApiProperty({ nullable: true })
  nextCursor: string | null;
}
