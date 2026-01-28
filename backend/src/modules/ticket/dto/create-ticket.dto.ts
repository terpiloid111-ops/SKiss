import { IsUUID, IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty({ 
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Ticket category ID'
  })
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @ApiProperty({ 
    example: 'Problem with site deployment',
    description: 'Ticket title'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  title: string;

  @ApiProperty({ 
    example: 'I am unable to deploy my site. Getting error 500.',
    description: 'Initial message'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  message: string;
}
