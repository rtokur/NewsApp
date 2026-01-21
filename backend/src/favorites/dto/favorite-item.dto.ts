import { ApiProperty } from "@nestjs/swagger";
import { News } from "src/news/entities/news.entity";


export class FavoriteItemDto {
    @ApiProperty({ description: 'The unique identifier of the favorite item' })
    id: number;
    
    @ApiProperty({ description: 'The news item that has been favorited' , type: () => News})
    news: News;

    @ApiProperty({ description: 'The date and time when the favorite was created' })
    createdAt: Date;
}