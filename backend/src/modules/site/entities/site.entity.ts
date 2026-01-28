import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Market } from './market.entity';
import { SiteAccount } from './site-account.entity';

export enum SiteType {
  CLEARNET = 'clearnet',
  ONION = 'onion',
}

export enum SiteStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

@Entity('sites')
@Index(['userId', 'status'])
export class Site {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ unique: true, length: 255 })
  @Index()
  domain: string;

  @Column({ type: 'uuid' })
  @Index()
  marketId: string;

  @ManyToOne(() => Market)
  @JoinColumn({ name: 'marketId' })
  market: Market;

  @Column({
    type: 'enum',
    enum: SiteType,
    default: SiteType.CLEARNET,
  })
  type: SiteType;

  @Column({
    type: 'enum',
    enum: SiteStatus,
    default: SiteStatus.PENDING,
  })
  @Index()
  status: SiteStatus;

  @Column({ nullable: true, length: 255 })
  ns1: string;

  @Column({ nullable: true, length: 255 })
  ns2: string;

  @OneToMany(() => SiteAccount, (account) => account.site)
  accounts: SiteAccount[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
