import { BOOK_METADATA } from '@/constants/BibleStructure';
import { Verse, Book, Chapter } from '@/types/bible';

// Type du JSON brut importé 

interface RawVerse {
  book_name: string;
  book: number;
  chapter: number;
  verse: number;
  text: string;
}

interface RawBibleData {
  metadata: {
    name: string;
    shortname: string;
    lang_short: string;
    copyright_statement: string;
  };
  verses: RawVerse[];
}

import rawJson from '../../assets/data/bible.json';
const rawData = rawJson as RawBibleData;

// Transformation JSON source → structure interne 

function buildBooks(): Book[] {
  const booksMap = new Map<number, Book>();

  for (const verse of rawData.verses) {
    const meta = BOOK_METADATA.find(b => b.number === verse.book);
    if (!meta) continue;

    if (!booksMap.has(verse.book)) {
      booksMap.set(verse.book, {
        number: verse.book,
        name: meta.name,
        testament: meta.testament,
        category: meta.category,
        chapters: [],
      });
    }

    const book = booksMap.get(verse.book)!;

    let chapter = book.chapters.find(c => c.number === verse.chapter);
    if (!chapter) {
      chapter = { number: verse.chapter, verses: [] };
      book.chapters.push(chapter);
    }

    chapter.verses.push(verse);
  }

  const books = Array.from(booksMap.values()).sort((a, b) => a.number - b.number);
  books.forEach(book => {
    book.chapters.sort((a, b) => a.number - b.number);
    book.chapters.forEach(ch => {
      ch.verses.sort((a, b) => a.verse - b.verse);
    });
  });

  return books;
}

// Cache mémoire 

let _books: Book[] | null = null;
let _verses: RawVerse[] | null = null;

function getBooks(): Book[] {
  if (!_books) _books = buildBooks();
  return _books;
}

function getAllVerses(): RawVerse[] {
  if (!_verses) _verses = rawData.verses;
  return _verses;
}

// API publique 

const BibleService = {
  getAllBooks(): Book[] {
    return getBooks();
  },

  getBook(bookNumber: number): Book | undefined {
    return getBooks().find(b => b.number === bookNumber);
  },

  getBooksByTestament(testament: 'ancien' | 'nouveau'): Book[] {
    return getBooks().filter(b => b.testament === testament);
  },

  getChapter(bookNumber: number, chapterNumber: number): Chapter | undefined {
    const book = BibleService.getBook(bookNumber);
    return book?.chapters.find(c => c.number === chapterNumber);
  },

  getVerse(bookNumber: number, chapter: number, verse: number): Verse | undefined {
    const ch = BibleService.getChapter(bookNumber, chapter);
    return ch?.verses.find(v => v.verse === verse);
  },

  getChapterCount(bookNumber: number): number {
    return BibleService.getBook(bookNumber)?.chapters.length ?? 0;
  },

  getPreviousChapter(
    bookNumber: number,
    chapterNumber: number
  ): { bookNumber: number; chapterNumber: number } | null {
    if (chapterNumber > 1) {
      return { bookNumber, chapterNumber: chapterNumber - 1 };
    }
    if (bookNumber > 1) {
      const prevBook = BibleService.getBook(bookNumber - 1);
      if (!prevBook) return null;
      const lastChapter = prevBook.chapters[prevBook.chapters.length - 1];
      return { bookNumber: bookNumber - 1, chapterNumber: lastChapter.number };
    }
    return null;
  },

  getNextChapter(
    bookNumber: number,
    chapterNumber: number
  ): { bookNumber: number; chapterNumber: number } | null {
    const book = BibleService.getBook(bookNumber);
    if (!book) return null;

    if (chapterNumber < book.chapters.length) {
      return { bookNumber, chapterNumber: chapterNumber + 1 };
    }
    if (bookNumber < 66) {
      return { bookNumber: bookNumber + 1, chapterNumber: 1 };
    }
    return null;
  },

  search(query: string, testament?: 'ancien' | 'nouveau'): Verse[] {
    if (!query || query.trim().length < 2) return [];

    const normalized = query
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return getAllVerses().filter(verse => {
      if (testament) {
        const isAncien = verse.book <= 39;
        if (testament === 'ancien' && !isAncien) return false;
        if (testament === 'nouveau' && isAncien) return false;
      }
      const text = verse.text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return text.includes(normalized);
    });
  },

  getVerseOfTheDay(): Verse {
    const verses = getAllVerses();
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const index = (dayOfYear * 137) % verses.length;
    return verses[index];
  },

  getMetadata() {
    return rawData.metadata;
  },
};

export default BibleService;