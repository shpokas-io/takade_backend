export interface Section {
  id: string;
  title: string;
  description: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  section_id: string;
  slug: string;
  title: string;
  description: string;
  video_url: string;
  video_thumbnail: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Material {
  id: string;
  lesson_id: string;
  name: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface UserCourse {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  has_access: boolean;
}

export interface Database {
  public: {
    Tables: {
      sections: {
        Row: Section;
        Insert: Omit<Section, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Section, 'id'>>;
      };
      lessons: {
        Row: Lesson;
        Insert: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Lesson, 'id'>>;
      };
      materials: {
        Row: Material;
        Insert: Omit<Material, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Material, 'id'>>;
      };
      user_courses: {
        Row: UserCourse;
        Insert: Omit<UserCourse, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserCourse, 'id'>>;
      };
    };
  };
}
