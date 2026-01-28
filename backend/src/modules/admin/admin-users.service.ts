import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User, UserRole, UserStatus } from '../auth/entities/user.entity';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(
    search?: string,
    role?: UserRole,
    status?: UserStatus,
    limit: number = 20,
    offset: number = 0,
  ) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder.where(
        '(user.username LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    const [users, total] = await queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .take(limit)
      .skip(offset)
      .getManyAndCount();

    // Remove sensitive data
    const sanitizedUsers = users.map((user) => {
      const { password, refreshToken, twoFactorSecret, ...rest } = user;
      return rest;
    });

    return {
      data: sanitizedUsers,
      total,
      limit,
      offset,
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, refreshToken, twoFactorSecret, ...rest } = user;
    return rest;
  }

  async update(
    id: string,
    updateData: {
      role?: UserRole;
      status?: UserStatus;
      balanceBtc?: number;
      balanceRub?: number;
    },
  ) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateData.role !== undefined) {
      user.role = updateData.role;
    }
    if (updateData.status !== undefined) {
      user.status = updateData.status;
    }
    if (updateData.balanceBtc !== undefined) {
      user.balanceBtc = updateData.balanceBtc;
    }
    if (updateData.balanceRub !== undefined) {
      user.balanceRub = updateData.balanceRub;
    }

    await this.userRepository.save(user);

    const { password, refreshToken, twoFactorSecret, ...rest } = user;
    return rest;
  }

  async softDelete(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.status = UserStatus.BANNED;
    await this.userRepository.save(user);

    return { message: 'User soft deleted successfully' };
  }

  async ban(id: string, reason?: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === UserRole.ADMIN) {
      throw new BadRequestException('Cannot ban admin users');
    }

    user.status = UserStatus.BANNED;
    await this.userRepository.save(user);

    return { message: 'User banned successfully', reason };
  }

  async unban(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.status = UserStatus.ACTIVE;
    await this.userRepository.save(user);

    return { message: 'User unbanned successfully' };
  }
}
