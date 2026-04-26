export type BookCategory =
  | 'Pentateuque'
  | 'Livres historiques'
  | 'Livres poétiques'
  | 'Prophètes majeurs'
  | 'Prophètes mineurs'
  | 'Évangiles'
  | 'Histoire'
  | 'Épîtres de Paul'
  | 'Épîtres générales'
  | 'Prophétie';

export interface BookMeta {
  number: number;
  name: string;
  abbreviation: string;
  testament: 'ancien' | 'nouveau';
  category: BookCategory;
}

export const BOOK_METADATA: BookMeta[] = [
  // ANCIEN TESTAMENT 
  { number: 1,  name: 'Genèse',          abbreviation: 'Gn',   testament: 'ancien', category: 'Pentateuque' },
  { number: 2,  name: 'Exode',           abbreviation: 'Ex',   testament: 'ancien', category: 'Pentateuque' },
  { number: 3,  name: 'Lévitique',       abbreviation: 'Lv',   testament: 'ancien', category: 'Pentateuque' },
  { number: 4,  name: 'Nombres',         abbreviation: 'Nb',   testament: 'ancien', category: 'Pentateuque' },
  { number: 5,  name: 'Deutéronome',     abbreviation: 'Dt',   testament: 'ancien', category: 'Pentateuque' },
  { number: 6,  name: 'Josué',           abbreviation: 'Jos',  testament: 'ancien', category: 'Livres historiques' },
  { number: 7,  name: 'Juges',           abbreviation: 'Jg',   testament: 'ancien', category: 'Livres historiques' },
  { number: 8,  name: 'Ruth',            abbreviation: 'Rt',   testament: 'ancien', category: 'Livres historiques' },
  { number: 9,  name: '1 Samuel',        abbreviation: '1S',   testament: 'ancien', category: 'Livres historiques' },
  { number: 10, name: '2 Samuel',        abbreviation: '2S',   testament: 'ancien', category: 'Livres historiques' },
  { number: 11, name: '1 Rois',          abbreviation: '1R',   testament: 'ancien', category: 'Livres historiques' },
  { number: 12, name: '2 Rois',          abbreviation: '2R',   testament: 'ancien', category: 'Livres historiques' },
  { number: 13, name: '1 Chroniques',    abbreviation: '1Ch',  testament: 'ancien', category: 'Livres historiques' },
  { number: 14, name: '2 Chroniques',    abbreviation: '2Ch',  testament: 'ancien', category: 'Livres historiques' },
  { number: 15, name: 'Esdras',          abbreviation: 'Esd',  testament: 'ancien', category: 'Livres historiques' },
  { number: 16, name: 'Néhémie',         abbreviation: 'Né',   testament: 'ancien', category: 'Livres historiques' },
  { number: 17, name: 'Esther',          abbreviation: 'Est',  testament: 'ancien', category: 'Livres historiques' },
  { number: 18, name: 'Job',             abbreviation: 'Jb',   testament: 'ancien', category: 'Livres poétiques' },
  { number: 19, name: 'Psaumes',         abbreviation: 'Ps',   testament: 'ancien', category: 'Livres poétiques' },
  { number: 20, name: 'Proverbes',       abbreviation: 'Pr',   testament: 'ancien', category: 'Livres poétiques' },
  { number: 21, name: 'Ecclésiaste',     abbreviation: 'Ec',   testament: 'ancien', category: 'Livres poétiques' },
  { number: 22, name: 'Cantique',        abbreviation: 'Ct',   testament: 'ancien', category: 'Livres poétiques' },
  { number: 23, name: 'Ésaïe',          abbreviation: 'És',   testament: 'ancien', category: 'Prophètes majeurs' },
  { number: 24, name: 'Jérémie',        abbreviation: 'Jr',   testament: 'ancien', category: 'Prophètes majeurs' },
  { number: 25, name: 'Lamentations',   abbreviation: 'Lm',   testament: 'ancien', category: 'Prophètes majeurs' },
  { number: 26, name: 'Ézéchiel',       abbreviation: 'Éz',   testament: 'ancien', category: 'Prophètes majeurs' },
  { number: 27, name: 'Daniel',         abbreviation: 'Dn',   testament: 'ancien', category: 'Prophètes majeurs' },
  { number: 28, name: 'Osée',           abbreviation: 'Os',   testament: 'ancien', category: 'Prophètes mineurs' },
  { number: 29, name: 'Joël',           abbreviation: 'Jl',   testament: 'ancien', category: 'Prophètes mineurs' },
  { number: 30, name: 'Amos',           abbreviation: 'Am',   testament: 'ancien', category: 'Prophètes mineurs' },
  { number: 31, name: 'Abdias',         abbreviation: 'Ab',   testament: 'ancien', category: 'Prophètes mineurs' },
  { number: 32, name: 'Jonas',          abbreviation: 'Jon',  testament: 'ancien', category: 'Prophètes mineurs' },
  { number: 33, name: 'Michée',         abbreviation: 'Mi',   testament: 'ancien', category: 'Prophètes mineurs' },
  { number: 34, name: 'Nahoum',         abbreviation: 'Na',   testament: 'ancien', category: 'Prophètes mineurs' },
  { number: 35, name: 'Habacuc',        abbreviation: 'Ha',   testament: 'ancien', category: 'Prophètes mineurs' },
  { number: 36, name: 'Sophonie',       abbreviation: 'So',   testament: 'ancien', category: 'Prophètes mineurs' },
  { number: 37, name: 'Aggée',          abbreviation: 'Ag',   testament: 'ancien', category: 'Prophètes mineurs' },
  { number: 38, name: 'Zacharie',       abbreviation: 'Za',   testament: 'ancien', category: 'Prophètes mineurs' },
  { number: 39, name: 'Malachie',       abbreviation: 'Ml',   testament: 'ancien', category: 'Prophètes mineurs' },

  // NOUVEAU TESTAMENT 
  { number: 40, name: 'Matthieu',       abbreviation: 'Mt',   testament: 'nouveau', category: 'Évangiles' },
  { number: 41, name: 'Marc',           abbreviation: 'Mc',   testament: 'nouveau', category: 'Évangiles' },
  { number: 42, name: 'Luc',            abbreviation: 'Lc',   testament: 'nouveau', category: 'Évangiles' },
  { number: 43, name: 'Jean',           abbreviation: 'Jn',   testament: 'nouveau', category: 'Évangiles' },
  { number: 44, name: 'Actes',          abbreviation: 'Ac',   testament: 'nouveau', category: 'Histoire' },
  { number: 45, name: 'Romains',        abbreviation: 'Rm',   testament: 'nouveau', category: 'Épîtres de Paul' },
  { number: 46, name: '1 Corinthiens',  abbreviation: '1Co',  testament: 'nouveau', category: 'Épîtres de Paul' },
  { number: 47, name: '2 Corinthiens',  abbreviation: '2Co',  testament: 'nouveau', category: 'Épîtres de Paul' },
  { number: 48, name: 'Galates',        abbreviation: 'Ga',   testament: 'nouveau', category: 'Épîtres de Paul' },
  { number: 49, name: 'Éphésiens',      abbreviation: 'Ep',   testament: 'nouveau', category: 'Épîtres de Paul' },
  { number: 50, name: 'Philippiens',    abbreviation: 'Ph',   testament: 'nouveau', category: 'Épîtres de Paul' },
  { number: 51, name: 'Colossiens',     abbreviation: 'Col',  testament: 'nouveau', category: 'Épîtres de Paul' },
  { number: 52, name: '1 Thessaloniciens', abbreviation: '1Th', testament: 'nouveau', category: 'Épîtres de Paul' },
  { number: 53, name: '2 Thessaloniciens', abbreviation: '2Th', testament: 'nouveau', category: 'Épîtres de Paul' },
  { number: 54, name: '1 Timothée',     abbreviation: '1Tm',  testament: 'nouveau', category: 'Épîtres de Paul' },
  { number: 55, name: '2 Timothée',     abbreviation: '2Tm',  testament: 'nouveau', category: 'Épîtres de Paul' },
  { number: 56, name: 'Tite',           abbreviation: 'Tt',   testament: 'nouveau', category: 'Épîtres de Paul' },
  { number: 57, name: 'Philémon',       abbreviation: 'Phm',  testament: 'nouveau', category: 'Épîtres de Paul' },
  { number: 58, name: 'Hébreux',        abbreviation: 'Hé',   testament: 'nouveau', category: 'Épîtres générales' },
  { number: 59, name: 'Jacques',        abbreviation: 'Jc',   testament: 'nouveau', category: 'Épîtres générales' },
  { number: 60, name: '1 Pierre',       abbreviation: '1P',   testament: 'nouveau', category: 'Épîtres générales' },
  { number: 61, name: '2 Pierre',       abbreviation: '2P',   testament: 'nouveau', category: 'Épîtres générales' },
  { number: 62, name: '1 Jean',         abbreviation: '1Jn',  testament: 'nouveau', category: 'Épîtres générales' },
  { number: 63, name: '2 Jean',         abbreviation: '2Jn',  testament: 'nouveau', category: 'Épîtres générales' },
  { number: 64, name: '3 Jean',         abbreviation: '3Jn',  testament: 'nouveau', category: 'Épîtres générales' },
  { number: 65, name: 'Jude',           abbreviation: 'Jd',   testament: 'nouveau', category: 'Épîtres générales' },
  { number: 66, name: 'Apocalypse',     abbreviation: 'Ap',   testament: 'nouveau', category: 'Prophétie' },
];

export const OLD_TESTAMENT = BOOK_METADATA.filter(b => b.testament === 'ancien');
export const NEW_TESTAMENT = BOOK_METADATA.filter(b => b.testament === 'nouveau');

export const CATEGORIES = [...new Set(BOOK_METADATA.map(b => b.category))];