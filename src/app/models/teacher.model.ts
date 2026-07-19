export interface Certificate {
  title: string;
  year?: number;
}

export interface TeacherSocialLinks {
  youtube?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  whatsapp?: string;
}

export interface TeacherProfile {
  id: string;
  name: string;
  brandName: string;
  subject: string;
  bio: string;
  qualifications: string[];
  experienceYears: number;
  certificates: Certificate[];
  achievements: string[];
  socialLinks: TeacherSocialLinks;
  profileImageUrl: string;
  heroImageUrl: string;
  contactPhone: string;
  supportPhone: string;
}
