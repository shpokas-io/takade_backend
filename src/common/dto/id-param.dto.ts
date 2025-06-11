import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class IdParamDto {
  @IsString({ message: 'ID must be a string' })
  @IsNotEmpty({ message: 'ID is required' })
  @IsUUID(4, { message: 'ID must be a valid UUID' })
  id: string;
} 