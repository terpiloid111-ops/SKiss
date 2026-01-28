import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserStatsDto } from './dto/user-stats.dto';
import { SiteStatsDto } from './dto/site-stats.dto';
import { FinanceStatsDto } from './dto/finance-stats.dto';

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('user')
  @ApiOperation({ summary: 'Get user personal analytics' })
  @ApiResponse({
    status: 200,
    description: 'User analytics retrieved successfully',
    type: UserStatsDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserStats(@CurrentUser() userId: string): Promise<UserStatsDto> {
    return this.analyticsService.getUserStats(userId);
  }

  @Get('sites/:id')
  @ApiOperation({ summary: 'Get site analytics' })
  @ApiResponse({
    status: 200,
    description: 'Site analytics retrieved successfully',
    type: SiteStatsDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Site not found' })
  async getSiteStats(
    @CurrentUser() userId: string,
    @Param('id') siteId: string,
  ): Promise<SiteStatsDto> {
    return this.analyticsService.getSiteStats(siteId, userId);
  }

  @Get('finance')
  @ApiOperation({ summary: 'Get user finance analytics' })
  @ApiResponse({
    status: 200,
    description: 'Finance analytics retrieved successfully',
    type: FinanceStatsDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getFinanceStats(@CurrentUser() userId: string): Promise<FinanceStatsDto> {
    return this.analyticsService.getFinanceStats(userId);
  }
}
