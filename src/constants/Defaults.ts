import { UserSettings } from '@/types/bible';
import { DEFAULT_FONT_SIZE_INDEX, ReadingFontSizes } from './Typography';

export const DEFAULT_SETTINGS: UserSettings = {
  font_size: ReadingFontSizes[DEFAULT_FONT_SIZE_INDEX],
  theme: 'light',
};

export const DEFAULT_LAST_POSITION = {
  book_number: 1,
  book_name: 'Genèse',
  chapter: 1,
};

// Verset du jour de secours (si la logique échoue)
export const FALLBACK_VERSE = {
  book_name: 'Jean',
  chapter: 3,
  verse: 16,
  text: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.",
};