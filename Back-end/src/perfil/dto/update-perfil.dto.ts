import { PartialType } from '@nestjs/mapped-types';
import { CreatePerfilDto } from './create-perfil.dto';
import { IsDate, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateCredencialDto } from '../../../src/credencial/dto/update-credencial.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePerfilDto extends PartialType(CreatePerfilDto) {
  @ApiProperty()
  @IsString()
  @IsOptional()
  nombre?: string;

  @ApiProperty()
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  fecha_nacimiento?: Date;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateCredencialDto)
  credencial?: UpdateCredencialDto;
}
