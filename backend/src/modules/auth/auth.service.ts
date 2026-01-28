import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { User, UserStatus } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto, TwoFactorSetupDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { username, email, password, referralCode } = registerDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    if (referralCode) {
      const referrer = await this.userRepository.findOne({
        where: { referralCode },
      });
      if (!referrer) {
        throw new BadRequestException('Invalid referral code');
      }
    }

    const user = this.userRepository.create({
      username,
      email,
      password,
      referralCode: this.generateReferralCode(),
      referredBy: referralCode || null,
      status: UserStatus.ACTIVE,
    });

    await this.userRepository.save(user);

    return this.generateTokens(user);
  }

  async validateUser(usernameOrEmail: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(user: User, twoFactorCode?: string): Promise<AuthResponseDto> {
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        throw new UnauthorizedException('2FA code required');
      }

      const isValid = this.verify2FACode(user.twoFactorSecret, twoFactorCode);
      if (!isValid) {
        throw new UnauthorizedException('Invalid 2FA code');
      }
    }

    return this.generateTokens(user);
  }

  async setup2FA(userId: string): Promise<TwoFactorSetupDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const secret = speakeasy.generateSecret({
      name: `SKiss (${user.email})`,
      issuer: 'SKiss',
    });

    user.twoFactorSecret = secret.base32;
    await this.userRepository.save(user);

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    return {
      qrCode,
      secret: secret.base32,
    };
  }

  async enable2FA(userId: string, code: string): Promise<{ success: boolean }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('2FA not set up');
    }

    const isValid = this.verify2FACode(user.twoFactorSecret, code);
    if (!isValid) {
      throw new BadRequestException('Invalid 2FA code');
    }

    user.twoFactorEnabled = true;
    await this.userRepository.save(user);

    return { success: true };
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });

      if (payload.sub !== userId) {
        throw new UnauthorizedException('Invalid refresh token');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return this.generateTokens(user);
  }

  private async generateTokens(user: User): Promise<AuthResponseDto> {
    const payload = { sub: user.id, username: user.username, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
    });

    await user.hashRefreshToken(refreshToken);
    await this.userRepository.save(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        balanceBtc: user.balanceBtc,
        balanceRub: user.balanceRub,
      },
    };
  }

  private verify2FACode(secret: string, code: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: code,
      window: 2,
    });
  }

  private generateReferralCode(): string {
    return uuidv4().replace(/-/g, '').substring(0, 10).toUpperCase();
  }
}
