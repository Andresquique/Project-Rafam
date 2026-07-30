import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateZonaMuscularDto {
  @ApiProperty()
  @IsString()
  nombre: string;

  @ApiProperty()
  @IsString()
  descripcion: string;
}
