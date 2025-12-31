
export type SubscriptionTier = 'free' | 'pro';

export type ContentType = 'video' | 'audio' | 'pdf' | 'document' | 'image';

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
  joinedAt?: string;
  completedLessons?: string[]; // مصفوفة تحتوي على معرفات الدروس المكتملة
}
