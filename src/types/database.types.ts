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
      user_courses: {
        Row: UserCourse;
        Insert: Omit<UserCourse, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserCourse, 'id'>>;
      };
    };
  };
} 