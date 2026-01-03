
export type ContentType = 'video' | 'audio' | 'pdf' | 'document' | 'image';

export interface ChatAttachment {
  type: 'pdf' | 'audio';
  url: string;
  name: string;
  size?: string;
}

export interface PostAttachment {
  type: 'pdf' | 'audio' | 'image';
  url: string;
  name: string;
  size?: string;
}

export interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  isPro: boolean;
  content: string;
  timestamp: string;
  likes: number;
  commentsCount: number;
  channelId: string;
  attachments: PostAttachment[];
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
  userRole?: 'admin' | 'student';
  isPro?: boolean;
  subject?: string;
  attachment?: ChatAttachment;
  quizRef?: {
    quizId: string;
    questionText: string;
  };
}

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

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  category?: string;
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
  quiz?: Quiz;
  flashcards?: Flashcard[];
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  image: string;
  subject: string;
  lessons: Lesson[];
  finalQuiz?: Quiz;
  price: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: 'admin' | 'student';
  lastSeen?: string; 
  lastDevice?: string;
  joinedAt?: string;
  completedLessons?: string[]; 
  completedExams?: string[];
  quizGrades?: Record<string, number>;
  hasCompletedTour?: boolean;
  xp: number; 
  level: number; 
  streak: number; 
  subscriptionTier: 'free' | 'pro';
  subscriptionExpiry?: string | null;
}

export interface ActivationCode {
  id: string;
  code: string;
  isUsed: boolean;
  days: number;
  createdAt: string;
}

export interface Exam {
  id: string;
  title: string;
  code: string;
  date: string;
  time: string;
  location: string;
}
