export interface Verse {
  book_name: string;
  book: number;
  chapter: number;
  verse: number;
  text: string;
}

export interface VerseNote {
  id: string;             
  book_number: number;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;           
  note: string;           
  updated_at: string;     
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
  theme: 'light' | 'dark' | 'sepia' | 'custom';
  customColors?: CustomColor;
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

export interface CustomColor {
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  tabBarBackground: string;
  tabBarActive: string;
  separator: string;
  border: string;
  error?: string; 
  gold?: string;
  verseNumber?: string;
  verseText?: string;
  verseBookmark?: string;
}
