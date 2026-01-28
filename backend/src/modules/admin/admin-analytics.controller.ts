import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminAnalyticsService } from './admin-analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@ApiTags('Admin - Analytics')
@ApiBearerAuth()
@Controller('admin/analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MODERATOR)
export class AdminAnalyticsController {
  constructor(private readonly adminAnalyticsService: AdminAnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get dashboard overview (admin)' })
  @ApiResponse({ status: 200, description: 'Overview data retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getOverview() {
    return this.adminAnalyticsService.getOverview();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get user statistics (admin)' })
  @ApiResponse({ status: 200, description: 'User statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getUserStatistics() {
    return this.adminAnalyticsService.getUserStatistics();
  }

  @Get('finance')
  @ApiOperation({ summary: 'Get financial statistics (admin)' })
  @ApiResponse({ status: 200, description: 'Financial statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getFinanceStatistics() {
    return this.adminAnalyticsService.getFinanceStatistics();
  }
}
