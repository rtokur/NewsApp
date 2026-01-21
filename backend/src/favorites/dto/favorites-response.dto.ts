import { ApiProperty } from "@nestjs/swagger";
import { FavoriteItemDto } from "./favorite-item.dto";


export class FavoritesResponseDto {
    @ApiProperty({ description: 'List of favorite items', type: () => [FavoriteItemDto] })
    items: FavoriteItemDto[];

    @ApiProperty({ description: 'Cursor for pagination', nullable: true, example: '2024-01-01T00:00:00.000Z' })
    nextCursor: string | null;
}