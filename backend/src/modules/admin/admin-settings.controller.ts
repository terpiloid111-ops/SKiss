import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

// Mock settings - in production, this would be stored in database
const systemSettings = {
  siteName: 'SKiss',
  maintenanceMode: false,
  registrationEnabled: true,
  minWithdrawalAmount: 0.0001,
  maxWithdrawalAmount: 10,
  withdrawalFeePercent: 0.5,
  btcConfirmationsRequired: 3,
  supportEmail: 'support@skiss.com',
  termsUrl: 'https://skiss.com/terms',
  privacyUrl: 'https://skiss.com/privacy',
};

@ApiTags('Admin - Settings')
@ApiBearerAuth()
@Controller('admin/settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminSettingsController {
  @Get()
  @ApiOperation({ summary: 'Get system settings (admin only)' })
  @ApiResponse({ status: 200, description: 'Settings retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getSettings() {
    return systemSettings;
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update system settings (admin only)' })
  @ApiResponse({ status: 200, description: 'Settings updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async updateSettings(@Body() settings: Partial<typeof systemSettings>) {
    // In production, save to database
    Object.assign(systemSettings, settings);
    return {
      message: 'Settings updated successfully',
      settings: systemSettings,
    };
  }
}
