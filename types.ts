
export type SubscriptionTier = 'free' | 'pro';

export type ContentType = 'video' | 'audio' | 'pdf' | 'document' | 'image';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  url: string;
  duration?: string; // For video/audio
  fileSize?: string; // For documents
}

export interface Lesson {
  id: string;
  title: string;
  isLocked: boolean; 
  contents: ContentItem[]; // New: Array of content items
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
  subscriptionTier: SubscriptionTier;
  subscriptionExpiry?: string; // ISO Date String
}
