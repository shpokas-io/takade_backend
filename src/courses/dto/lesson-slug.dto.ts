import { IsString, IsNotEmpty, Length } from 'class-validator';
import { IsValidSlug } from '../../common/decorators/validation.decorators';

export class LessonSlugDto {
  @IsString({ message: 'Slug must be a string' })
  @IsNotEmpty({ message: 'Slug is required' })
  @Length(1, 100, { message: 'Slug must be between 1 and 100 characters' })
  @IsValidSlug()
  slug: string;
} 