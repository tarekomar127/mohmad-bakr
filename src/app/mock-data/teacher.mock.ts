import { TeacherProfile } from '../models';

export const MOCK_TEACHER: TeacherProfile = {
  id: 'teacher-1',
  name: 'محمد بكر',
  brandName: 'الشافعي',
  subject: 'اللغة العربية',
  bio: `أستاذ محمد بكر، معلم اللغة العربية لجميع المراحل التعليمية، يجمع بين أسلوب الشرح المبسّط
والخبرة الطويلة في تبسيط قواعد النحو والبلاغة والأدب لطلاب المرحلتين الإعدادية والثانوية.
يؤمن الأستاذ محمد بأن اللغة العربية ليست مادة للحفظ، بل فهمٌ وتذوقٌ، ويسعى من خلال منصة
"الشافعي" التعليمية إلى تقديم محتوى تفاعلي ومتابعة مستمرة لمستوى كل طالب.`,
  qualifications: [
    'بكالوريوس اللغة العربية وآدابها - كلية دار العلوم',
    'دبلوم تربوي في طرق التدريس الحديثة',
    'دورة متخصصة في تصميم المناهج الرقمية',
  ],
  experienceYears: 9,
  certificates: [
    { title: 'شهادة تدريب معلمين معتمدة', year: 2019 },
    { title: 'شهادة تميز في التعليم عن بعد', year: 2022 },
    { title: 'شهادة إعداد اختبارات إلكترونية', year: 2023 },
  ],
  achievements: [
    'تدريس أكثر من 5000 طالب عبر المنصات الرقمية',
    'إعداد أكثر من 300 حصة فيديو تعليمية',
    'نسبة نجاح تتجاوز 95% لطلاب الثانوية العامة',
    'تقييم متوسط 4.9 من 5 من أولياء الأمور والطلاب',
  ],
  socialLinks: {
    youtube: 'https://www.youtube.com/@%D8%A7%D9%84%D8%B4%D8%A7%D9%81%D8%B9%D9%8A_%D9%85%D8%AD%D9%85%D8%AF%D8%A8%D9%83%D8%B1',
    facebook: 'https://www.facebook.com/share/1D84VfWSHF/',
    tiktok: 'https://www.tiktok.com/@mohammedbakr_official',
    whatsapp: 'https://whatsapp.com/channel/0029Vb96s8BB4hdLnxgF9C3T',
  },
  profileImageUrl: '/images/teacher/teacher-portrait.jpg',
  heroImageUrl: '/images/teacher/teacher-hero-banner.jpg',
  contactPhone: '01147529942',
  supportPhone: '01204687241',
};
