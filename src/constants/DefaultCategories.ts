import { BookmarkCategory } from '@/types/bible';

export const DEFAULT_CATEGORIES: BookmarkCategory[] = [
  { id: 'vie',          label: 'vie',           icon: '📌', isCustom: false },
  { id: 'inspiration',  label: 'Inspiration',   icon: '✨', isCustom: false },
  { id: 'priere',       label: 'Prière',        icon: '🙏', isCustom: false },
  { id: 'promesse',     label: 'Promesse',      icon: '🌟', isCustom: false },
  { id: 'sagesse',      label: 'Sagesse',       icon: '📜', isCustom: false },
  { id: 'amour',        label: 'Amour',         icon: '❤️', isCustom: false },
  { id: 'foi',          label: 'Foi',           icon: '🕊️', isCustom: false },
  { id: 'consolation',  label: 'Consolation',   icon: '🤗', isCustom: false },
];