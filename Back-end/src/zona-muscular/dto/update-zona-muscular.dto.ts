import { PartialType } from '@nestjs/mapped-types';
import { CreateZonaMuscularDto } from './create-zona-muscular.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateZonaMuscularDto extends PartialType(CreateZonaMuscularDto) {
  @IsOptional()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion: string;
}
