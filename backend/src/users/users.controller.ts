import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RequestEmailChangeDto } from './dto/request-email-change.dto';
import { ConfirmEmailChangeDto } from './dto/confirm-email-change.dto';

@ApiTags('Users')
@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@CurrentUser() user: JwtPayload) {
    return this.usersService.findById(user.sub);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedMimes.includes(file.mimetype)) {
        throw new BadRequestException(
          'Invalid file type. Only JPEG and PNG are allowed',
        );
      }

      if (file.size > maxSize) {
        throw new BadRequestException(
          'File too large. Maximum size is 5MB',
        );
      }
    }

    return this.usersService.updateProfile(user.sub, dto, file);
  }

  @Post('email/change-request')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Request email change' })
  @ApiResponse({
    status: 200,
    description: 'Verification email sent',
  })
  @ApiResponse({ status: 400, description: 'Invalid password or email' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async requestEmailChange(
    @CurrentUser() user: JwtPayload,
    @Body() dto: RequestEmailChangeDto,
  ) {
    return this.usersService.requestEmailChange(
      user.sub,
      dto.newEmail,
      dto.currentPassword,
    );
  }

  @Post('email/verify')
  @ApiOperation({ summary: 'Verify email change with token' })
  @ApiResponse({ status: 200, description: 'Email changed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async confirmEmailChange(@Body() dto: ConfirmEmailChangeDto) {
    return this.usersService.confirmEmailChange(dto.token);
  }

  @Get('email/pending')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get pending email change request' })
  @ApiResponse({ status: 200, description: 'Pending request details' })
  @ApiResponse({ status: 404, description: 'No pending request' })
  async getPendingEmailChange(@CurrentUser() user: JwtPayload) {
    return this.usersService.getPendingEmailChange(user.sub);
  }

  @Delete('email/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Cancel pending email change request' })
  @ApiResponse({ status: 200, description: 'Request cancelled' })
  @ApiResponse({ status: 404, description: 'No pending request' })
  async cancelEmailChange(@CurrentUser() user: JwtPayload) {
    return this.usersService.cancelEmailChange(user.sub);
  }
}