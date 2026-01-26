import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ReadingHistoryService } from './reading-history.service';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MarkAsReadDto } from './dto/mark-as-read.dto';
import { GetReadingHistoryDto } from './dto/get-reading-history.dto';
import { ReadingHistoryListResponseDto } from './dto/reading-history-list-response.dto';

@ApiTags('Reading History')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('v1/reading-history')
export class ReadingHistoryController {
  constructor(private readonly service: ReadingHistoryService) {}

  @Post()
  @ApiOperation({
    summary: 'mark new as read',
    description: 'mark a news article as read for current user',
  })
  @ApiOkResponse({
    description: 'The news article has been marked as read successfully',
  })
  markAsRead(@CurrentUser() user: JwtPayload, @Body() dto: MarkAsReadDto) {
    return this.service.markAsRead(user.sub, dto.newsId);
  }

  @Get()
  @ApiOperation({ summary: "Get user's reading history" })
  @ApiOkResponse({
    type: ReadingHistoryListResponseDto,
  })
  getHistory(
    @CurrentUser() user: JwtPayload,
    @Query() query: GetReadingHistoryDto,
  ): Promise<ReadingHistoryListResponseDto> {
    return this.service.getHistory(
      user.sub,
      query.limit,
      query.cursor,
      query.categoryId,
      query.search,
    );
  }

  @Delete(':newsId')
  @ApiOperation({
    summary: 'Remove news from reading history',
  })
  @ApiResponse({
    status: 200,
    description:
      'The news article has been removed from reading history successfully',
    schema: { example: { success: true } },
  })
  remove(
    @CurrentUser() user: JwtPayload,
    @Param('newsId', ParseIntPipe) newsId: number,
  ) {
    return this.service.removeFromHistory(user.sub, newsId);
  }
}
