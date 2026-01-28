import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'JWT refresh token' })
  refreshToken: string;

  @ApiProperty({ description: 'User information' })
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    status: string;
    balanceBtc: number;
    balanceRub: number;
  };
}

export class TwoFactorSetupDto {
  @ApiProperty({ description: 'QR code data URL' })
  qrCode: string;

  @ApiProperty({ description: '2FA secret' })
  secret: string;
}
