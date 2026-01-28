import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Wallet } from './wallet.entity';

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  FEE = 'fee',
  TRANSFER = 'transfer',
}

export enum TransactionCurrency {
  BTC = 'BTC',
  RUB = 'RUB',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('transactions')
@Index(['userId', 'status', 'createdAt'])
@Index(['walletId', 'type'])
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  walletId: string;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'walletId' })
  wallet: Wallet;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 18, scale: 8 })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionCurrency,
  })
  currency: TransactionCurrency;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  @Index()
  status: TransactionStatus;

  @Column({ nullable: true, length: 100 })
  txid: string;

  @Column({ nullable: true, length: 100 })
  walletAddress: string;

  @Column({ type: 'decimal', precision: 18, scale: 8, default: 0 })
  fee: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
