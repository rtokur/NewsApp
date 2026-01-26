import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FavoritesService } from './favorites.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { GetFavoritesQueryDto } from './dto/get-favorites.query.dto';
import { FavoritesResponseDto } from './dto/favorites-response.dto';

@ApiTags('Favorites')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('v1/favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':newsId')
  @ApiOperation({ summary: 'Add news to favorites' })
  addFavorite(
    @CurrentUser() user: JwtPayload,
    @Param('newsId', ParseIntPipe) newsId: number,
  ) {
    return this.favoritesService.addFavorite(user.sub, newsId);
  }

  @Delete(':favoriteId')
  @ApiOperation({ summary: 'Remove news from favorites' })
  removeFavorite(
    @CurrentUser() user: JwtPayload,
    @Param('favoriteId', ParseIntPipe) favoriteId: number,
  ) {
    return this.favoritesService.removeFavorite(user.sub, favoriteId);
  }

  @Get()
  @ApiOperation({ summary: 'Get user favorite news with pagination' })
  @ApiOkResponse({ description: 'List of favorite news' , type: FavoritesResponseDto})
  getMyFavorites(
    @CurrentUser() user: JwtPayload,
    @Query() query: GetFavoritesQueryDto,
  ) {
    console.log( "JWT",user.sub)
    return this.favoritesService.getUserFavorites(
      user.sub,
      query.limit,
      query.cursor,
      query.categoryId,
      query.sortOrder,
      query.search,
    );
  }
}
