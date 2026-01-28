import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { TicketCategory } from './ticket-category.entity';
import { TicketMessage } from './ticket-message.entity';

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum TicketPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Entity('tickets')
@Index(['userId', 'status'])
@Index(['status', 'priority'])
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  @Index()
  categoryId: string;

  @ManyToOne(() => TicketCategory)
  @JoinColumn({ name: 'categoryId' })
  category: TicketCategory;

  @Column({ length: 255 })
  title: string;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.OPEN,
  })
  @Index()
  status: TicketStatus;

  @Column({
    type: 'enum',
    enum: TicketPriority,
    default: TicketPriority.NORMAL,
  })
  @Index()
  priority: TicketPriority;

  @Column({ type: 'uuid', nullable: true })
  assignedTo: string;

  @OneToMany(() => TicketMessage, (message) => message.ticket)
  messages: TicketMessage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date;
}
