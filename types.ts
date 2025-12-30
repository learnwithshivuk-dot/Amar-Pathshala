
export type Grade = 0 | 1 | 2 | 3 | 4 | 5;

export enum Subject {
  BENGALI = 'Bengali',
  ENGLISH = 'English',
  MATHEMATICS = 'Mathematics',
  SCIENCE = 'Science',
  SOCIAL_STUDIES = 'Social Studies',
  ART = 'Art'
}

export interface LessonSource {
  uri: string;
  title: string;
}

export interface Lesson {
  id: string;
  grade: Grade;
  subject: Subject;
  title: string;
  content: string;
  imageUrl?: string;
  audioData?: string;
  language: string;
  sources?: LessonSource[];
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  lessonId: string;
  questions: Question[];
}

export type ViewState = 
  | 'HOME' 
  | 'GRADE_SELECT' 
  | 'SUBJECT_SELECT' 
  | 'LESSON_VIEW' 
  | 'QUIZ_VIEW' 
  | 'ADMIN_AUTH' 
  | 'ADMIN_PANEL'
  | 'ABOUT'
  | 'PARENT_GUIDE'
  | 'BLOG'
  | 'CURRICULUM'
  | 'CONTACT';
