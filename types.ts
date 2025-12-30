export type SubscriptionTier = 'free' | 'pro';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isLocked: boolean; // Original lock status (e.g. not released yet)
  videoUrl?: string;
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