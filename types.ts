
export type SubscriptionTier = 'free' | 'pro';

export type ContentType = 'video' | 'audio' | 'pdf' | 'document' | 'image';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  url: string;
  duration?: string; 
  fileSize?: string; 
}

export interface Lesson {
  id: string;
  title: string;
  isLocked: boolean; 
  contents: ContentItem[]; 
  duration?: string;
  quiz?: Quiz; // اختبار المحاضرة
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  price: number;
  originalPrice?: number;
  image: string;
  subject: string;
  lessons: Lesson[];
  finalQuiz?: Quiz; // اختبار الفصل/الكورس الشامل
}

export interface ActivationCode {
  id: string;
  code: string;
  isUsed: boolean;
  usedBy?: string;
  usedAt?: string;
  createdAt: string;
  days: number;
}

export interface Exam {
  id: string;
  title: string;
  code: string;
  date: string;
  time: string;
  location: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: 'admin' | 'student';
  subscriptionTier: SubscriptionTier;
  subscriptionExpiry?: string; 
  lastSeen?: string; 
  lastDevice?: string;
  joinedAt?: string;
  completedLessons?: string[]; 
  completedExams?: string[];
  quizGrades?: Record<string, number>; // تخزين درجات الاختبارات
}
