import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsStrongPassword } from '../../common/decorators/validation.decorators';

export class UpdatePasswordDto {
  @IsString({ message: 'New password must be a string' })
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsStrongPassword()
  newPassword: string;
} 