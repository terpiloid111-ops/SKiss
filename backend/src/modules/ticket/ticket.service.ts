import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from './entities/ticket.entity';
import { TicketMessage } from './entities/ticket-message.entity';
import { TicketCategory } from './entities/ticket-category.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UserRole } from '../auth/entities/user.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(TicketMessage)
    private readonly messageRepository: Repository<TicketMessage>,
    @InjectRepository(TicketCategory)
    private readonly categoryRepository: Repository<TicketCategory>,
  ) {}

  async create(
    userId: string,
    createTicketDto: CreateTicketDto,
  ): Promise<Ticket> {
    // Verify category exists
    const category = await this.categoryRepository.findOne({
      where: { id: createTicketDto.categoryId },
    });

    if (!category || !category.isActive) {
      throw new BadRequestException('Invalid category');
    }

    const ticket = this.ticketRepository.create({
      userId,
      categoryId: createTicketDto.categoryId,
      title: createTicketDto.title,
    });

    const savedTicket = await this.ticketRepository.save(ticket);

    // Create initial message
    await this.addMessage(savedTicket.id, userId, {
      message: createTicketDto.message,
    });

    return this.findOne(savedTicket.id, userId);
  }

  async findAll(
    userId: string,
    userRole: UserRole,
    limit: number = 20,
    offset: number = 0,
  ) {
    const queryBuilder = this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.category', 'category')
      .leftJoinAndSelect('ticket.user', 'user');

    // Users can only see their own tickets
    if (userRole === UserRole.USER) {
      queryBuilder.where('ticket.userId = :userId', { userId });
    }

    const [tickets, total] = await queryBuilder
      .orderBy('ticket.createdAt', 'DESC')
      .take(limit)
      .skip(offset)
      .getManyAndCount();

    return {
      data: tickets,
      total,
      limit,
      offset,
    };
  }

  async findOne(id: string, userId: string, userRole?: UserRole): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['category', 'user'],
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Only ticket owner or admin can view
    if (ticket.userId !== userId && userRole !== UserRole.ADMIN && userRole !== UserRole.MODERATOR) {
      throw new ForbiddenException('Access denied');
    }

    return ticket;
  }

  async update(
    id: string,
    userId: string,
    userRole: UserRole,
    updateTicketDto: UpdateTicketDto,
  ): Promise<Ticket> {
    const ticket = await this.findOne(id, userId, userRole);

    // Users can only close their own tickets
    if (userRole === UserRole.USER) {
      if (ticket.userId !== userId) {
        throw new ForbiddenException('Access denied');
      }
      if (updateTicketDto.status && updateTicketDto.status !== TicketStatus.CLOSED) {
        throw new ForbiddenException('Users can only close tickets');
      }
      if (updateTicketDto.priority || updateTicketDto.assignedTo) {
        throw new ForbiddenException('Users cannot change priority or assignment');
      }
    }

    if (updateTicketDto.status) {
      ticket.status = updateTicketDto.status;
      if (updateTicketDto.status === TicketStatus.CLOSED) {
        ticket.closedAt = new Date();
      }
    }

    if (updateTicketDto.priority) {
      ticket.priority = updateTicketDto.priority;
    }

    if (updateTicketDto.assignedTo !== undefined) {
      ticket.assignedTo = updateTicketDto.assignedTo;
    }

    return this.ticketRepository.save(ticket);
  }

  async addMessage(
    ticketId: string,
    userId: string,
    createMessageDto: CreateMessageDto,
    userRole?: UserRole,
  ): Promise<TicketMessage> {
    const ticket = await this.findOne(ticketId, userId, userRole);

    const message = this.messageRepository.create({
      ticketId: ticket.id,
      userId,
      message: createMessageDto.message,
      attachments: createMessageDto.attachments,
      isAdmin: userRole === UserRole.ADMIN || userRole === UserRole.MODERATOR,
    });

    return this.messageRepository.save(message);
  }

  async getMessages(
    ticketId: string,
    userId: string,
    userRole?: UserRole,
  ): Promise<TicketMessage[]> {
    const ticket = await this.findOne(ticketId, userId, userRole);

    return this.messageRepository.find({
      where: { ticketId: ticket.id },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }

  async getCategories(): Promise<TicketCategory[]> {
    return this.categoryRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }
}
