import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum ActionType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  PROFILE_UPDATE = 'profile_update',
  SETTINGS_UPDATE = 'settings_update',
  PASSWORD_CHANGE = 'password_change',
  SITE_CREATE = 'site_create',
  SITE_UPDATE = 'site_update',
  SITE_DELETE = 'site_delete',
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TICKET_CREATE = 'ticket_create',
  TICKET_UPDATE = 'ticket_update',
  TWO_FA_ENABLE = 'two_fa_enable',
  TWO_FA_DISABLE = 'two_fa_disable',
}

@Entity('activity_logs')
@Index(['userId', 'createdAt'])
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: ActionType,
  })
  actionType: ActionType;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true, length: 50 })
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  userAgent: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  @Index()
  createdAt: Date;
}
