import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Query,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSettingsDto } from './dto/user-settings.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Request } from 'express';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(@CurrentUser() userId: string): Promise<UserProfileDto> {
    return this.userService.getProfile(userId);
  }

  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Email or username already in use' })
  async updateProfile(
    @CurrentUser() userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ): Promise<UserProfileDto> {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] as string;
    const userAgent = req.headers['user-agent'];
    return this.userService.updateProfile(userId, updateUserDto, ipAddress, userAgent);
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get user settings' })
  @ApiResponse({
    status: 200,
    description: 'User settings retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getSettings(@CurrentUser() userId: string) {
    return this.userService.getSettings(userId);
  }

  @Patch('settings')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user settings' })
  @ApiResponse({
    status: 200,
    description: 'Settings updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateSettings(
    @CurrentUser() userId: string,
    @Body() settingsDto: UserSettingsDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] as string;
    const userAgent = req.headers['user-agent'];
    return this.userService.updateSettings(userId, settingsDto, ipAddress, userAgent);
  }

  @Get('referrals')
  @ApiOperation({ summary: 'Get referral statistics' })
  @ApiResponse({
    status: 200,
    description: 'Referral statistics retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getReferrals(@CurrentUser() userId: string) {
    return this.userService.getReferralStats(userId);
  }

  @Get('activity')
  @ApiOperation({ summary: 'Get user activity history' })
  @ApiResponse({
    status: 200,
    description: 'Activity history retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getActivity(
    @CurrentUser() userId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.userService.getActivityHistory(
      userId,
      limit ? Number(limit) : 50,
      offset ? Number(offset) : 0,
    );
  }
}
