import { IsString, IsNotEmpty, IsUrl, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class MaterialDto {
  @IsString({ message: 'Material name must be a string' })
  @IsNotEmpty({ message: 'Material name is required' })
  name: string;

  @IsUrl({}, { message: 'Material URL must be a valid URL' })
  @IsNotEmpty({ message: 'Material URL is required' })
  url: string;
}

interface MaterialData {
  name: string;
  url: string;
}

interface LessonData {
  slug: string;
  title: string;
  description: string;
  video_thumbnail: string;
  video_url: string;
  materials?: MaterialData[];
}

export class LessonDto {
  @IsString({ message: 'Slug must be a string' })
  @IsNotEmpty({ message: 'Slug is required' })
  slug: string;

  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsUrl({}, { message: 'Video thumbnail must be a valid URL' })
  @IsNotEmpty({ message: 'Video thumbnail is required' })
  videoThumbnail: string;

  @IsUrl({}, { message: 'Video URL must be a valid URL' })
  @IsNotEmpty({ message: 'Video URL is required' })
  videoUrl: string;

  @IsArray({ message: 'Materials must be an array' })
  @ValidateNested({ each: true })
  @Type(() => MaterialDto)
  @IsOptional()
  materials: MaterialDto[];

  constructor(data: LessonData) {
    this.slug = data.slug;
    this.title = data.title;
    this.description = data.description;
    this.videoThumbnail = data.video_thumbnail;
    this.videoUrl = data.video_url;
    this.materials =
      data.materials?.map((material) => ({
        name: material.name,
        url: material.url,
      })) || [];
  }
}
