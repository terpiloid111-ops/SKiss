import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class AttachmentDto {
  @ApiProperty({ example: 'screenshot.png' })
  @IsString()
  filename: string;

  @ApiProperty({ example: 'https://example.com/files/screenshot.png' })
  @IsString()
  url: string;

  @ApiProperty({ example: 1024000 })
  size: number;

  @ApiProperty({ example: 'image/png' })
  @IsString()
  mimeType: string;
}

export class CreateMessageDto {
  @ApiProperty({ 
    example: 'I tried that solution but still getting the error.',
    description: 'Message text'
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({ 
    type: [AttachmentDto],
    description: 'Optional attachments',
    required: false
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];
}
