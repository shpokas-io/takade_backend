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
  slug: string;
  title: string;
  description: string;
  videoThumbnail: string;
  videoUrl: string;
  materials: MaterialData[];

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
