import { PartialType } from '@nestjs/mapped-types';
import { CreateCredencialDto } from './create-credencial.dto';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCredencialDto extends PartialType(CreateCredencialDto) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  password?: string;
}
