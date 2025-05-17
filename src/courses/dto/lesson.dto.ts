export class LessonDto {
  slug!: string;
  title!: string;
  description!: string;
  videoThumbnail!: string;
  videoUrl!: string;
  materials!: { name: string; url: string }[];

  constructor(data: any) {
    this.slug = data.slug;
    this.title = data.title;
    this.description = data.description;
    this.videoThumbnail = data.video_thumbnail;
    this.videoUrl = data.video_url;
    this.materials = (data.materials || []).map((m: any) => ({
      name: m.name,
      url: m.url,
    }));
  }
}
