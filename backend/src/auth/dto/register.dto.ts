import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";


export class RegisterDto {
    @ApiProperty({ example: 'test@mail.com'})
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456'})
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'Rümeysa Tokur'})
    @IsNotEmpty()
    fullName: string;
}