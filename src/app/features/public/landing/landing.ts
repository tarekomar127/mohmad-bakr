import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  LucideChartBar,
  LucideChevronDown,
  LucideClipboardCheck,
  LucideFileText,
  LucideGraduationCap,
  LucidePhone,
  LucideQuote,
  LucideStar,
  LucideVideo,
} from '@lucide/angular';
import { StatCard } from '../../../shared/components/stat-card/stat-card';
import { BrandIcon } from '../../../shared/components/brand-icon/brand-icon';
import { TeacherService } from '../../../services/teacher.service';
import { GALLERY_IMAGES } from '../../../core/constants/gallery';
import { SITE_CONTACT } from '../../../core/constants/site-contact';
import { MediaUrlPipe } from '../../../shared/pipes/media-url.pipe';

interface Testimonial {
  name: string;
  stage: string;
  quote: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-landing',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    StatCard,
    LucideChartBar,
    LucideChevronDown,
    LucideClipboardCheck,
    LucideFileText,
    LucideGraduationCap,
    LucidePhone,
    LucideQuote,
    LucideStar,
    LucideVideo,
    BrandIcon,
    MediaUrlPipe,
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
  private readonly fb = inject(FormBuilder);
  private readonly teacherService = inject(TeacherService);

  readonly teacher = toSignal(this.teacherService.load(), { initialValue: null });
  readonly galleryImages = GALLERY_IMAGES;
  readonly contact = SITE_CONTACT;

  readonly stats = {
    students: '500+',
    lessons: 90,
    exams: 40,
    successRate: 95,
  };

  readonly whyChooseUs = [
    {
      icon: 'video',
      title: 'دروس تفاعلية',
      description: 'فيديوهات شرح مبسّطة لكل درس مقسّمة حسب المرحلة الدراسية، متاحة في أي وقت.',
    },
    {
      icon: 'exam',
      title: 'امتحانات إلكترونية',
      description: 'امتحانات دورية لقياس المستوى ومتابعة التقدم أولاً بأول.',
    },
    {
      icon: 'pdf',
      title: 'ملفات PDF شاملة',
      description: 'ملازم ومذكرات قابلة للتحميل لكل درس ومرحلة دراسية.',
    },
    {
      icon: 'progress',
      title: 'متابعة المستوى',
      description: 'تقارير دورية لولي الأمر والطالب عن نسبة التقدم ومتوسط الدرجات.',
    },
  ];

  readonly testimonials: Testimonial[] = [
    { name: 'ولي أمر الطالبة مريم محمد', stage: 'أولى إعدادي', quote: 'أسلوب الأستاذ محمد بكر في الشرح غيّر نظرة ابنتي للغة العربية تمامًا، أصبحت تحب المادة.' },
    { name: 'الطالب نور الدين حسن', stage: 'ثالثة إعدادي', quote: 'المنصة سهّلت عليّ المذاكرة، الفيديوهات والملازم منظمة وواضحة جدًا.' },
    { name: 'ولي أمر الطالبة جنى محمود', stage: 'أولى ثانوي', quote: 'متابعة المستوى والدرجات أولاً بأول ساعدتنا كثيرًا في معرفة نقاط الضعف والتركيز عليها.' },
    { name: 'الطالبة ملك أشرف', stage: 'ثانية ثانوي', quote: 'الامتحانات الإلكترونية شبيهة جدًا بامتحانات الثانوية العامة، استفدت منها كثيرًا في المراجعة.' },
  ];

  readonly faqItems: FaqItem[] = [
    { question: 'هل المنصة مناسبة لجميع المراحل الدراسية؟', answer: 'نعم، توفر المنصة محتوى مخصصًا لكل مرحلة من أولى إعدادي وحتى ثانية ثانوي.' },
    { question: 'كيف يمكنني إنشاء حساب لابني/ابنتي؟', answer: 'يمكنكم إنشاء حساب من صفحة "إنشاء حساب" بإدخال بيانات الطالب وولي الأمر واختيار المرحلة الدراسية المناسبة.' },
    { question: 'هل يمكن متابعة تقدم الطالب؟', answer: 'نعم، توفر لوحة تحكم الطالب نسبة التقدم ومتوسط الدرجات وعدد الدروس المكتملة بشكل مستمر.' },
    { question: 'هل الفيديوهات والملفات متاحة في أي وقت؟', answer: 'نعم، جميع الفيديوهات وملفات PDF المنشورة متاحة على مدار الساعة لطلاب المرحلة المخصصة لها.' },
    { question: 'كيف أتواصل مع الدعم الفني؟', answer: 'يمكنكم التواصل معنا عبر نموذج التواصل أسفل الصفحة أو عبر رقم الدعم الفني الموضح في التذييل.' },
  ];

  readonly openFaqIndex = signal<number | null>(0);

  readonly contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required],
  });

  readonly contactSubmitted = signal(false);

  toggleFaq(index: number): void {
    this.openFaqIndex.set(this.openFaqIndex() === index ? null : index);
  }

  submitContact(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    this.contactSubmitted.set(true);
    this.contactForm.reset();
  }
}
