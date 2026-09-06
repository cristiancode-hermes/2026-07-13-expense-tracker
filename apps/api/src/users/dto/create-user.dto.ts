import { IsString, IsNotEmpty, IsEmail, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePass123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'uuid-of-org' })
  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({ enum: ['admin', 'member'], default: 'member' })
  @IsString()
  @IsIn(['admin', 'member'])
  @IsOptional()
  role?: string;
}
