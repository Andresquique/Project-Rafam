import { PartialType } from '@nestjs/mapped-types';
import { CreateNivelDto } from './create-nivel.dto';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNivelDto extends PartialType(CreateNivelDto) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  nombre: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  numero_orden: number;
}
