import { IsString, IsUUID, IsEnum, IsNotEmpty, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SiteType } from '../entities/site.entity';

export class CreateSiteDto {
  @ApiProperty({ 
    example: 'mystore.onion',
    description: 'Site domain name'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Matches(/^[a-zA-Z0-9.-]+$/, {
    message: 'Domain can only contain letters, numbers, dots and hyphens',
  })
  domain: string;

  @ApiProperty({ 
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Market template ID'
  })
  @IsNotEmpty()
  @IsUUID()
  marketId: string;

  @ApiProperty({ 
    enum: SiteType,
    example: SiteType.ONION,
    description: 'Site type (clearnet or onion)'
  })
  @IsNotEmpty()
  @IsEnum(SiteType)
  type: SiteType;
}
