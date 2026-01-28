import { IsEmail, IsString, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ 
    example: 'user@example.com',
    description: 'User email address',
    required: false 
  })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  @MaxLength(100)
  email?: string;

  @ApiProperty({ 
    example: 'johndoe',
    description: 'Username (3-50 characters, alphanumeric and underscores)',
    required: false 
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(50, { message: 'Username cannot exceed 50 characters' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers and underscores',
  })
  username?: string;
}
