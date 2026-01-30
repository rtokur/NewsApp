import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class RegisterDto {
    @ApiProperty({ example: 'test@mail.com' })
    @Transform(({ value }) => value?.toLowerCase().trim())
    @IsEmail({}, { message: 'Invalid email format' })
    @MaxLength(254, { message: 'Email is too long' })
    email: string;

    @ApiProperty({ example: 'StrongPass123' })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @MaxLength(64, { message: 'Password must be at most 64 characters' })
    @Matches(/^\S+$/, { message: 'Password cannot contain spaces' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter and one number',
    })
    password: string;

    @ApiProperty({ example: 'Rümeysa Tokur' })
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty({ message: 'Full name is required' })
    @MaxLength(100)
    @Matches(
      /^[A-Za-zÀ-ÖØ-öø-ÿĞğİıŞşÖöÜüÇç\s'-]+$/,
      {
        message:
          "Full name can only contain letters, spaces, hyphens (-) and apostrophes (')",
      }
    )
    fullName: string;
}