import { IsString, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SiteStatus } from '../entities/site.entity';

export class UpdateSiteDto {
  @ApiProperty({ 
    example: 'mystore.onion',
    description: 'Site domain name',
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  domain?: string;

  @ApiProperty({ 
    example: 'ns1.example.com',
    description: 'Primary nameserver',
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  ns1?: string;

  @ApiProperty({ 
    example: 'ns2.example.com',
    description: 'Secondary nameserver',
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  ns2?: string;

  @ApiProperty({ 
    enum: SiteStatus,
    example: SiteStatus.ACTIVE,
    description: 'Site status',
    required: false
  })
  @IsOptional()
  @IsEnum(SiteStatus)
  status?: SiteStatus;
}
