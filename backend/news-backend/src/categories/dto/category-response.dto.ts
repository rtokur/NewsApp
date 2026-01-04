import { ApiProperty } from "@nestjs/swagger";

export class CategoryResponseDto {
    @ApiProperty({ example: 1, description: 'The unique identifier of the category' })
    id: number;

    @ApiProperty({ example: 'Technology', description: 'The name of the category' })
    name: string;

    @ApiProperty({ example: 42, description: 'The number of news items in this category' })
    newsCount: number;
}