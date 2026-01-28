import { IsString, IsEnum, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SiteAccountRole } from '../entities/site-account.entity';

export class CreateSiteAccountDto {
  @ApiProperty({ 
    example: 'admin',
    description: 'Account username'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  username: string;

  @ApiProperty({ 
    example: 'SecureP@ssw0rd',
    description: 'Account password'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @ApiProperty({ 
    enum: SiteAccountRole,
    example: SiteAccountRole.ADMIN,
    description: 'Account role'
  })
  @IsNotEmpty()
  @IsEnum(SiteAccountRole)
  role: SiteAccountRole;
}
