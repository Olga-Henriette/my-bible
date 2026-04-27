export interface Verse {
  book_name: string;
  book: number;
  chapter: number;
  verse: number;
  text: string;
}

export interface Chapter {
  number: number;
  verses: Verse[];
}

export interface Book {
  number: number;
  name: string;
  testament: 'ancien' | 'nouveau';
  category: string;
  chapters: Chapter[];
}

export interface BibleData {
  metadata: {
    name: string;
    shortname: string;
    lang_short: string;
    copyright_statement: string;
  };
  books: Book[];
}

export interface Bookmark {
  id: string;
  book_number: number;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
  added_at: string;
  category: string;
}

export interface BookmarkCategory {
  id: string;
  label: string;
  icon: string;
  isCustom: boolean;
}
export interface LastPosition {
  book_number: number;
  book_name: string;
  chapter: number;
}

export interface UserSettings {
  font_size: number;
  theme: 'light' | 'dark' | 'sepia';
}

export type Testament = 'all' | 'ancien' | 'nouveau';

export interface SearchResult extends Verse {
  highlighted?: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  hour: number;    // 0-23
  minute: number;  // 0-59
}

export type ReadingPlanId = 'bible_1_year' | 'psalms_30_days' | 'nt_90_days' | 'custom';

export interface ReadingPlan {
  id: ReadingPlanId;
  title: string;
  description: string;
  totalDays: number;
  startDate: string;        
  completedDays: number[];  
}

export interface ReadingPlanDay {
  day: number;
  bookNumber: number;
  bookName: string;
  chapter: number;
  label: string;
}