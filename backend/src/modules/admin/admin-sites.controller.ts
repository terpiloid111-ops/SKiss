import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminSitesService } from './admin-sites.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';
import { SiteStatus } from '../site/entities/site.entity';

@ApiTags('Admin - Sites')
@ApiBearerAuth()
@Controller('admin/sites')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MODERATOR)
export class AdminSitesController {
  constructor(private readonly adminSitesService: AdminSitesService) {}

  @Get()
  @ApiOperation({ summary: 'List all sites (admin)' })
  @ApiResponse({ status: 200, description: 'Sites retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async findAll(
    @Query('status') status?: SiteStatus,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.adminSitesService.findAll(
      status,
      limit ? Number(limit) : 20,
      offset ? Number(offset) : 0,
    );
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update site status (admin)' })
  @ApiResponse({ status: 200, description: 'Site updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Site not found' })
  async update(@Param('id') id: string, @Body('status') status: SiteStatus) {
    return this.adminSitesService.update(id, { status });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete site (admin only)' })
  @ApiResponse({ status: 200, description: 'Site deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Site not found' })
  async remove(@Param('id') id: string) {
    return this.adminSitesService.remove(id);
  }
}
