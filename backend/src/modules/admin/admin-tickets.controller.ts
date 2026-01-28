import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TicketService } from '../ticket/ticket.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../auth/entities/user.entity';
import { UpdateTicketDto } from '../ticket/dto/update-ticket.dto';

@ApiTags('Admin - Tickets')
@ApiBearerAuth()
@Controller('admin/tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MODERATOR)
export class AdminTicketsController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  @ApiOperation({ summary: 'List all tickets (admin)' })
  @ApiResponse({ status: 200, description: 'Tickets retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async findAll(
    @CurrentUser() userId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    // Admin can see all tickets
    return this.ticketService.findAll(
      userId,
      UserRole.ADMIN,
      limit ? Number(limit) : 20,
      offset ? Number(offset) : 0,
    );
  }

  @Post(':id/assign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign ticket to admin (admin)' })
  @ApiResponse({ status: 200, description: 'Ticket assigned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async assign(
    @Param('id') id: string,
    @CurrentUser() adminId: string,
    @Body('assignedTo') assignedTo: string,
  ) {
    return this.ticketService.update(id, adminId, UserRole.ADMIN, {
      assignedTo,
    });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update ticket (admin)' })
  @ApiResponse({ status: 200, description: 'Ticket updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async update(
    @Param('id') id: string,
    @CurrentUser() adminId: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketService.update(id, adminId, UserRole.ADMIN, updateTicketDto);
  }
}
