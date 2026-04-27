import { ReadingPlanDay, ReadingPlanId } from '@/types/bible';

export interface ReadingPlanMeta {
  id: ReadingPlanId;
  title: string;
  description: string;
  icon: string;
  totalDays: number;
}

export const READING_PLANS_META: ReadingPlanMeta[] = [
  {
    id: 'psalms_30_days',
    title: 'Psaumes en 30 jours',
    description: '5 psaumes par jour pour un mois de méditation.',
    icon: '🎵',
    totalDays: 30,
  },
  {
    id: 'nt_90_days',
    title: 'Nouveau Testament en 90 jours',
    description: 'Parcourez les 27 livres du Nouveau Testament en 3 mois.',
    icon: '✝️',
    totalDays: 90,
  },
  {
    id: 'bible_1_year',
    title: 'Bible en 1 an',
    description: 'Un plan quotidien pour lire toute la Bible en 365 jours.',
    icon: '📅',
    totalDays: 365,
  },
];

// Génère les jours du plan Psaumes (150 psaumes / 30 jours = 5 par jour)
function generatePsalmsPlan(): ReadingPlanDay[] {
  const days: ReadingPlanDay[] = [];
  let psalm = 1;
  for (let day = 1; day <= 30; day++) {
    const end = Math.min(psalm + 4, 150);
    days.push({
      day,
      bookNumber: 19,
      bookName: 'Psaumes',
      chapter: psalm,
      label: `Psaumes ${psalm}–${end}`,
    });
    psalm += 5;
  }
  return days;
}

// Nouveau Testament : 260 chapitres / 90 jours ≈ 3 chap/jour
function generateNTPlan(): ReadingPlanDay[] {
  // NT commence au livre 40 (Matthieu)
  const ntBooks = [
    { num: 40, name: 'Matthieu',       chapters: 28 },
    { num: 41, name: 'Marc',           chapters: 16 },
    { num: 42, name: 'Luc',            chapters: 24 },
    { num: 43, name: 'Jean',           chapters: 21 },
    { num: 44, name: 'Actes',          chapters: 28 },
    { num: 45, name: 'Romains',        chapters: 16 },
    { num: 46, name: '1 Corinthiens',  chapters: 16 },
    { num: 47, name: '2 Corinthiens',  chapters: 13 },
    { num: 48, name: 'Galates',        chapters: 6  },
    { num: 49, name: 'Éphésiens',      chapters: 6  },
    { num: 50, name: 'Philippiens',    chapters: 4  },
    { num: 51, name: 'Colossiens',     chapters: 4  },
    { num: 52, name: '1 Thessaloniciens', chapters: 5 },
    { num: 53, name: '2 Thessaloniciens', chapters: 3 },
    { num: 54, name: '1 Timothée',     chapters: 6  },
    { num: 55, name: '2 Timothée',     chapters: 4  },
    { num: 56, name: 'Tite',           chapters: 3  },
    { num: 57, name: 'Philémon',       chapters: 1  },
    { num: 58, name: 'Hébreux',        chapters: 13 },
    { num: 59, name: 'Jacques',        chapters: 5  },
    { num: 60, name: '1 Pierre',       chapters: 5  },
    { num: 61, name: '2 Pierre',       chapters: 3  },
    { num: 62, name: '1 Jean',         chapters: 5  },
    { num: 63, name: '2 Jean',         chapters: 1  },
    { num: 64, name: '3 Jean',         chapters: 1  },
    { num: 65, name: 'Jude',           chapters: 1  },
    { num: 66, name: 'Apocalypse',     chapters: 22 },
  ];

  const all: { bookNumber: number; bookName: string; chapter: number }[] = [];
  for (const book of ntBooks) {
    for (let ch = 1; ch <= book.chapters; ch++) {
      all.push({ bookNumber: book.num, bookName: book.name, chapter: ch });
    }
  }

  const days: ReadingPlanDay[] = [];
  const chapPerDay = Math.ceil(all.length / 90);
  let idx = 0;

  for (let day = 1; day <= 90 && idx < all.length; day++) {
    const slice = all.slice(idx, idx + chapPerDay);
    const first = slice[0];
    days.push({
      day,
      bookNumber: first.bookNumber,
      bookName: first.bookName,
      chapter: first.chapter,
      label: slice.map(c => `${c.bookName} ${c.chapter}`).join(', '),
    });
    idx += chapPerDay;
  }

  return days;
}

export function getPlanDays(id: ReadingPlanId): ReadingPlanDay[] {
  switch (id) {
    case 'psalms_30_days': return generatePsalmsPlan();
    case 'nt_90_days':     return generateNTPlan();
    default:               return [];
  }
}