import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { UserSettings } from './entities/user-settings.entity';
import { ActivityLog, ActionType } from './entities/activity-log.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSettingsDto } from './dto/user-settings.dto';
import { UserProfileDto } from './dto/user-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserSettings)
    private readonly settingsRepository: Repository<UserSettings>,
    @InjectRepository(ActivityLog)
    private readonly activityRepository: Repository<ActivityLog>,
  ) {}

  async getProfile(userId: string): Promise<UserProfileDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const settings = await this.getOrCreateSettings(userId);
    const referralStats = await this.getReferralStats(userId);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      balanceBtc: user.balanceBtc,
      balanceRub: user.balanceRub,
      referralCode: user.referralCode,
      referredBy: user.referredBy,
      twoFactorEnabled: user.twoFactorEnabled,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      settings: {
        theme: settings.theme,
        language: settings.language,
        notifications: settings.notifications,
        emailNotifications: settings.emailNotifications,
        timezone: settings.timezone,
      },
      referralStats,
    };
  }

  async updateProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<UserProfileDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExists = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (emailExists) {
        throw new ConflictException('Email already in use');
      }
      user.email = updateUserDto.email;
    }

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const usernameExists = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (usernameExists) {
        throw new ConflictException('Username already taken');
      }
      user.username = updateUserDto.username;
    }

    await this.userRepository.save(user);

    await this.logActivity(
      userId,
      ActionType.PROFILE_UPDATE,
      'Profile updated',
      ipAddress,
      userAgent,
      { changes: updateUserDto },
    );

    return this.getProfile(userId);
  }

  async getSettings(userId: string): Promise<UserSettings> {
    return this.getOrCreateSettings(userId);
  }

  async updateSettings(
    userId: string,
    settingsDto: UserSettingsDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<UserSettings> {
    const settings = await this.getOrCreateSettings(userId);

    if (settingsDto.theme !== undefined) {
      settings.theme = settingsDto.theme;
    }
    if (settingsDto.language !== undefined) {
      settings.language = settingsDto.language;
    }
    if (settingsDto.notifications !== undefined) {
      settings.notifications = settingsDto.notifications;
    }
    if (settingsDto.emailNotifications !== undefined) {
      settings.emailNotifications = settingsDto.emailNotifications;
    }
    if (settingsDto.timezone !== undefined) {
      settings.timezone = settingsDto.timezone;
    }

    await this.settingsRepository.save(settings);

    await this.logActivity(
      userId,
      ActionType.SETTINGS_UPDATE,
      'Settings updated',
      ipAddress,
      userAgent,
      { changes: settingsDto },
    );

    return settings;
  }

  async getReferralStats(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user || !user.referralCode) {
      return {
        totalReferrals: 0,
        activeReferrals: 0,
        totalEarnings: 0,
      };
    }

    const referrals = await this.userRepository.find({
      where: { referredBy: user.referralCode },
    });

    const activeReferrals = referrals.filter((r) => r.status === 'active');

    // Calculate earnings (mock for now - would be based on referral commissions)
    const totalEarnings = referrals.length * 0.0001; // Example: 0.0001 BTC per referral

    return {
      totalReferrals: referrals.length,
      activeReferrals: activeReferrals.length,
      totalEarnings,
    };
  }

  async getActivityHistory(
    userId: string,
    limit: number = 50,
    offset: number = 0,
  ) {
    const [activities, total] = await this.activityRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return {
      data: activities,
      total,
      limit,
      offset,
    };
  }

  async logActivity(
    userId: string,
    actionType: ActionType,
    description: string,
    ipAddress?: string,
    userAgent?: string,
    metadata?: Record<string, any>,
  ): Promise<ActivityLog> {
    const activity = this.activityRepository.create({
      userId,
      actionType,
      description,
      ipAddress,
      userAgent,
      metadata,
    });

    return this.activityRepository.save(activity);
  }

  private async getOrCreateSettings(userId: string): Promise<UserSettings> {
    let settings = await this.settingsRepository.findOne({
      where: { userId },
    });

    if (!settings) {
      settings = this.settingsRepository.create({
        userId,
        theme: 'dark',
        language: 'en',
        notifications: true,
        emailNotifications: true,
        timezone: 'UTC',
      });
      await this.settingsRepository.save(settings);
    }

    return settings;
  }
}
