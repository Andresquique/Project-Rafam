import { IsOptional, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoDto } from './create-video.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FilterVideoDto extends PartialType(CreateVideoDto) {
  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  nivel_id?: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  zona_muscular_id?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  descripcion?: string;
}
