import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TicketStatus, TicketPriority } from '../entities/ticket.entity';

export class UpdateTicketDto {
  @ApiProperty({ 
    enum: TicketStatus,
    example: TicketStatus.CLOSED,
    description: 'Ticket status',
    required: false
  })
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @ApiProperty({ 
    enum: TicketPriority,
    example: TicketPriority.HIGH,
    description: 'Ticket priority',
    required: false
  })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiProperty({ 
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Admin user ID to assign ticket to',
    required: false
  })
  @IsOptional()
  @IsUUID()
  assignedTo?: string;
}
