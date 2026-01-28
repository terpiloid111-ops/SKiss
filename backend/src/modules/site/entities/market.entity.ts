import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('markets')
export class Market {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  @Index()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 255 })
  templatePath: string;

  @Column({ length: 50, default: '1.0.0' })
  version: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  features: {
    hasEscrow?: boolean;
    hasMultisig?: boolean;
    hasFeedback?: boolean;
    hasMessaging?: boolean;
    supportedCurrencies?: string[];
    [key: string]: any;
  };

  @Column({ nullable: true, length: 500 })
  previewImage: string;

  @CreateDateColumn()
  createdAt: Date;
}
