import {
  Controller,
  Get,
  Post,
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
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { CreateSiteAccountDto } from './dto/create-site-account.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Sites')
@ApiBearerAuth()
@Controller('sites')
@UseGuards(JwtAuthGuard)
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new site' })
  @ApiResponse({ status: 201, description: 'Site created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Domain already in use' })
  async create(
    @CurrentUser() userId: string,
    @Body() createSiteDto: CreateSiteDto,
  ) {
    return this.siteService.create(userId, createSiteDto);
  }

  @Get()
  @ApiOperation({ summary: 'List user sites' })
  @ApiResponse({ status: 200, description: 'Sites retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @CurrentUser() userId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.siteService.findAll(
      userId,
      limit ? Number(limit) : 20,
      offset ? Number(offset) : 0,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get site details' })
  @ApiResponse({ status: 200, description: 'Site retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Site not found' })
  async findOne(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.siteService.findOne(id, userId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update site' })
  @ApiResponse({ status: 200, description: 'Site updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Site not found' })
  @ApiResponse({ status: 409, description: 'Domain already in use' })
  async update(
    @CurrentUser() userId: string,
    @Param('id') id: string,
    @Body() updateSiteDto: UpdateSiteDto,
  ) {
    return this.siteService.update(id, userId, updateSiteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete site' })
  @ApiResponse({ status: 204, description: 'Site deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Site not found' })
  async remove(@CurrentUser() userId: string, @Param('id') id: string) {
    await this.siteService.remove(id, userId);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get site statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Site not found' })
  async getStats(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.siteService.getStats(id, userId);
  }

  @Post(':id/accounts')
  @ApiOperation({ summary: 'Create site account' })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Site not found' })
  @ApiResponse({ status: 409, description: 'Username already exists' })
  async createAccount(
    @CurrentUser() userId: string,
    @Param('id') siteId: string,
    @Body() createAccountDto: CreateSiteAccountDto,
  ) {
    return this.siteService.createAccount(siteId, userId, createAccountDto);
  }

  @Get(':id/accounts')
  @ApiOperation({ summary: 'List site accounts' })
  @ApiResponse({ status: 200, description: 'Accounts retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Site not found' })
  async getAccounts(@CurrentUser() userId: string, @Param('id') siteId: string) {
    return this.siteService.getAccounts(siteId, userId);
  }

  @Delete(':id/accounts/:accountId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete site account' })
  @ApiResponse({ status: 204, description: 'Account deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async deleteAccount(
    @CurrentUser() userId: string,
    @Param('id') siteId: string,
    @Param('accountId') accountId: string,
  ) {
    await this.siteService.deleteAccount(siteId, accountId, userId);
  }
}
