import { ApiProperty } from "@nestjs/swagger";

export class SourceResponseDto {
    @ApiProperty({ example: 1, description: 'The unique identifier of the source' })
    id: number;

    @ApiProperty({ example: 'BBC News', description: 'The name of the source' })
    name: string;

    @ApiProperty({ description: 'The link of the source image'})
    logoUrl: string;

    @ApiProperty({ example: 42, description: 'The number of news items in this source' })
    newsCount: number;
}