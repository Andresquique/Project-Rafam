import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';

export class CreatePerfilDto {
  @IsOptional()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsDate()
  fecha_nacimiento: Date;

  @IsInt()
  credencialesId: number;
}
