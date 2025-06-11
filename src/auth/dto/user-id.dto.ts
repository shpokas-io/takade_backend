import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class UserIdDto {
  @IsString({ message: 'User ID must be a string' })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsUUID(4, { message: 'User ID must be a valid UUID' })
  userId: string;
} 