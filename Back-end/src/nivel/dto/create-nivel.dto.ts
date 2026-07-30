import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class CreateNivelDto {
  @ApiProperty()
  @IsString()
  nombre: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  numero_orden: number;
}
