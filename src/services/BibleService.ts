import { BibleData, Book } from '../types/bible';
import rawBibleData from '../../assets/data/segond_1910.json';

const bibleData = rawBibleData as BibleData;

export const BibleService = {
  getBooks(): Book[] {
    return bibleData.books;
  },

  getBookById(bookId: string): Book | undefined {
    return bibleData.books.find((b: Book) => b.id === bookId);
  },

  search(query: string): any[] {
    if (!query) return [];
    const results: any[] = [];
    
    bibleData.books.forEach((book: Book) => {
      book.chapters.forEach((chapter) => {
        chapter.verses.forEach((verse) => {
          if (verse.text.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              bookName: book.name,
              chapter: chapter.number,
              verse: verse.number,
              text: verse.text
            });
          }
        });
      });
    });
    
    return results.slice(0, 50); 
  }
};