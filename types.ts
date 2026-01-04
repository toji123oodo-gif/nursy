
export type ContentType = 'audio' | 'pdf' | 'video' | 'article' | 'image';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  referencePage?: number; // New: Page number in the associated PDF
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  timeLimit?: number; // in minutes
  passingScore?: number; // percentage
}

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  url: string;
  duration?: string;
  fileSize?: string;
  textContent?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  contents: ContentItem[];
  quiz?: Quiz;
  flashcards?: Flashcard[]; // New: Flashcards specific to this lesson
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
  level?: number;
  streak?: number;
  joinedAt?: string;
  completedExams?: string[];
  lastDevice?: string;
  lastSeen?: string;
  quizGrades?: Record<string, number>;
  
  university?: string;
  faculty?: string;
  academicYear?: string;
  isBlocked?: boolean;
  adminNotes?: string;
  walletBalance?: number;
  subscriptionExpiry?: string;
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

// New Community Types
export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  icon?: string; // Icon name
}

export interface UploadRequest {
  id: string;
  userId: string;
  userName: string;
  type: 'pdf' | 'video' | 'summary';
  title: string;
  description: string;
  fileUrl?: string; // Optional for now (mock)
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
  isAdmin?: boolean;
}
