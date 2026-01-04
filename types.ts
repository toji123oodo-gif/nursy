
export type ContentType = 'audio' | 'pdf' | 'video';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  // Added explanation to support QuizPlayer.tsx
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
  // Added duration and fileSize to support data/courses.ts
  duration?: string;
  fileSize?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration?: string;
  contents: ContentItem[];
  quiz?: Quiz;
  // Added isLocked to support CoursesTab.tsx
  isLocked?: boolean;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  subject: string;
  image: string;
  lessons: Lesson[];
  price: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: 'admin' | 'student';
  xp: number;
  completedLessons?: string[];
  subscriptionTier: 'free' | 'pro';
  // Extended properties for full Admin Control
  level?: number;
  streak?: number;
  joinedAt?: string;
  completedExams?: string[];
  lastDevice?: string;
  lastSeen?: string;
  quizGrades?: Record<string, number>;
  
  // New Admin Fields
  university?: string;
  faculty?: string;
  academicYear?: string;
  isBlocked?: boolean;
  adminNotes?: string;
  walletBalance?: number;
  subscriptionExpiry?: string;
}

// Added ActivationCode interface for Admin components
export interface ActivationCode {
  id: string;
  code: string;
  isUsed: boolean;
  days: number;
  createdAt: string;
}

// Added Exam interface for ExamHub.tsx
export interface Exam {
  id: string;
  title: string;
  code: string;
  date: string;
  time: string;
  location: string;
}
