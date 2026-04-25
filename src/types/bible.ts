export interface Verse {
  number: number;
  text: string;
}

export interface Chapter {
  number: number;
  verses: Verse[];
}

export interface Book {
  id: string;
  name: string;
  abbreviation: string;
  testament: 'old' | 'new';
  category: string;
  chapters: Chapter[];
}

export interface BibleData {
  translation: string;
  language: string;
  books: Book[];
}