export interface TeacherProfile {
  id: string;
  teacherName: string;
  biography: string;
  qualifications: string;
  experience: string;
  profileImageUrl: string;
  galleryImages: string[];
}

export interface TeacherProfileUpdateDto {
  teacherName: string;
  biography: string;
  qualifications: string;
  experience: string;
  profileImageUrl: string;
  galleryImages: string[];
}
