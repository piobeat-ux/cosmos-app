// Дни недели
export const DAYS_OF_WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] as const;
export const FULL_DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'] as const;

// Категории с цветами
export const CATEGORY_COLORS: Record<string, string> = {
  'Утреннее шоу': 'bg-[#f59e0b]/20 text-[#f59e0b]',
  'Новости': 'bg-[#3b82f6]/20 text-[#3b82f6]',
  'Музыка': 'bg-[#8b5cf6]/20 text-[#8b5cf6]',
  'Разговорное': 'bg-[#22c55e]/20 text-[#22c55e]',
  'Бизнес': 'bg-[#06b6d4]/20 text-[#06b6d4]',
  'Обучение': 'bg-[#ec4899]/20 text-[#ec4899]',
  'Кулинария': 'bg-[#f97316]/20 text-[#f97316]',
  'Подкаст': 'bg-[#6366f1]/20 text-[#6366f1]',
  'Развлечения': 'bg-[#ef4444]/20 text-[#ef4444]',
  'Обзор': 'bg-[#14b8a6]/20 text-[#14b8a6]',
  'Истории': 'bg-[#f59e0b]/20 text-[#f59e0b]',
};

// Цвета для градиентов
export const GRADIENT_COLORS = [
  { value: 'from-[#f59e0b] to-[#f97316]', label: 'Оранжевый' },
  { value: 'from-[#8b5cf6] to-[#6366f1]', label: 'Фиолетовый' },
  { value: 'from-[#22c55e] to-[#14b8a6]', label: 'Зеленый' },
  { value: 'from-[#3b82f6] to-[#06b6d4]', label: 'Синий' },
  { value: 'from-[#ef4444] to-[#f97316]', label: 'Красный' },
  { value: 'from-[#ec4899] to-[#8b5cf6]', label: 'Розовый' },
  { value: 'from-[#6366f1] to-[#8b5cf6]', label: 'Индиго' },
  { value: 'from-[#14b8a6] to-[#06b6d4]', label: 'Бирюзовый' },
];

// Основные типы
export interface Show {
  id: string;
  title: string;
  description: string;
  host: string;
  host_id?: string;
  time: string;
  duration: string;
  category: string;
  day_of_week: string;
  is_live: boolean;
  cover_image?: string; // base64 или URL
  stream_url?: string; // ссылка на прямой эфир
  created_at?: string;
}

export interface Host {
  id: string;
  name: string;
  role: string;
  hotel: string;
  bio: string;
  shows: string[];
  schedule: string;
  color: string;
  initials: string;
  avatar_image?: string; // base64 или URL
  created_at?: string;
}

export interface Podcast {
  id: string;
  title: string;
  description: string;
  host: string;
  episodes: number;
  duration: string;
  category: string;
  likes: number;
  color: string;
  cover_image?: string; // base64 или URL
  audio_url?: string; // ссылка на аудиофайл
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  color: string;
  created_at?: string;
}

// Настройки сайта - хранят контент главной страницы
export interface SiteSettings {
  // Hero секция
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_cover_image: string; // base64 или URL

  // Прямой эфир
  stream_url: string; // ссылка на аудиопоток (например: https://stream.cosmosfm.ru/live)
  current_show_title: string;
  current_show_host: string;
  current_show_cover: string; // base64 или URL

  // Общие
  site_name: string;
  site_tagline: string;
  about_text: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  social_instagram: string;
  social_youtube: string;
  social_tiktok: string;
}

// Пустые настройки по умолчанию
export const DEFAULT_SETTINGS: SiteSettings = {
  hero_title: 'Голос вашего отеля',
  hero_subtitle: 'Звуки вашего космоса',
  hero_description: 'Первый в России корпоративный медиа-канал в индустрии гостеприимства, вдохновляющий сотрудников, удивляющий гостей и укрепляющий бренд изнутри.',
  hero_cover_image: '',

  stream_url: '',
  current_show_title: 'Утренний кофе',
  current_show_host: 'Анна Петрова',
  current_show_cover: '',

  site_name: 'Cosmos FM',
  site_tagline: 'Первое корпоративное онлайн-радио в индустрии гостеприимства России',
  about_text: 'Cosmos FM создано для того, чтобы объединить команду из 4000+ сотрудников по всей России, вдохновить их на новые достижения и удивить гостей уникальным контентом. Мы верим, что каждый сотрудник — это голос бренда.',
  contact_email: 'radio@cosmosfm.ru',
  contact_phone: '+7 (999) 000-00-00',
  contact_address: 'Москва, Россия',
  social_instagram: '#',
  social_youtube: '#',
  social_tiktok: '#',
};
