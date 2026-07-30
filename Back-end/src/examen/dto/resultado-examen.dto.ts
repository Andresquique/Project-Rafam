import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class ResultadoExamenDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(12)
  puntos: number;
}
