import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateVideoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  url_video: string;

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  url_miniatura: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  zona_muscular_id: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  nivel_id: number;
}
