import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Site } from './site.entity';

export enum SiteAccountRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  VENDOR = 'vendor',
}

@Entity('site_accounts')
@Index(['siteId', 'isActive'])
export class SiteAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  siteId: string;

  @ManyToOne(() => Site, (site) => site.accounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'siteId' })
  site: Site;

  @Column({ length: 100 })
  username: string;

  @Column({ type: 'text' })
  password: string; // Should be encrypted/hashed

  @Column({
    type: 'enum',
    enum: SiteAccountRole,
    default: SiteAccountRole.ADMIN,
  })
  role: SiteAccountRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
