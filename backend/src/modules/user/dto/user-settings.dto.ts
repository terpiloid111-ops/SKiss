import { IsString, IsBoolean, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserSettingsDto {
  @ApiProperty({ 
    example: 'dark',
    description: 'UI theme (dark or light)',
    required: false 
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  theme?: string;

  @ApiProperty({ 
    example: 'en',
    description: 'Preferred language code',
    required: false 
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  language?: string;

  @ApiProperty({ 
    example: true,
    description: 'Enable in-app notifications',
    required: false 
  })
  @IsOptional()
  @IsBoolean()
  notifications?: boolean;

  @ApiProperty({ 
    example: true,
    description: 'Enable email notifications',
    required: false 
  })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiProperty({ 
    example: 'UTC',
    description: 'User timezone',
    required: false 
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  timezone?: string;
}
