import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Show, Host, Podcast, Category, SiteSettings } from '@/types/database';
import { DEFAULT_SETTINGS } from '@/types/database';
import {
  getShows, getHosts, getPodcasts, getCategories,
  createShow, updateShow, deleteShow,
  createHost, updateHost, deleteHost,
  createPodcast, updatePodcast, deletePodcast,
  createCategory, updateCategory, deleteCategory,
  subscribeToShows, subscribeToHosts, subscribeToPodcasts,
} from '@/lib/supabase';

interface DataContextType {
  // Data
  shows: Show[];
  hosts: Host[];
  podcasts: Podcast[];
  categories: Category[];
  settings: SiteSettings;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  // CRUD: Shows
  addShow: (show: Omit<Show, 'id' | 'created_at'>) => Promise<void>;
  editShow: (id: string, show: Partial<Show>) => Promise<void>;
  removeShow: (id: string) => Promise<void>;
  // CRUD: Hosts
  addHost: (host: Omit<Host, 'id' | 'created_at'>) => Promise<void>;
  editHost: (id: string, host: Partial<Host>) => Promise<void>;
  removeHost: (id: string) => Promise<void>;
  // CRUD: Podcasts
  addPodcast: (podcast: Omit<Podcast, 'id' | 'created_at'>) => Promise<void>;
  editPodcast: (id: string, podcast: Partial<Podcast>) => Promise<void>;
  removePodcast: (id: string) => Promise<void>;
  // CRUD: Categories
  addCategory: (category: Omit<Category, 'id' | 'created_at'>) => Promise<void>;
  editCategory: (id: string, category: Partial<Category>) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  // Settings
  updateSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  // File upload
  uploadImage: (file: File) => Promise<string>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// LocalStorage
const STORAGE_KEY = 'cosmos_fm_data';
const SETTINGS_KEY = 'cosmos_fm_settings';
const IMAGES_KEY = 'cosmos_fm_images'; // prefix for image storage

function getLocalData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return null;
}

function saveLocalData(data: any) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getLocalSettings(): SiteSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch { /* ignore */ }
  return DEFAULT_SETTINGS;
}

function saveLocalSettings(settings: SiteSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Demo data
const DEMO_DATA = {
  shows: [
    { id: '1', title: 'Утренний кофе', description: 'Начните день с бодрости!', host: 'Анна Петрова', time: '07:00', duration: '3ч', category: 'Утреннее шоу', day_of_week: 'Пн', is_live: true },
    { id: '2', title: 'Новости отелей', description: 'Главные новости индустрии', host: 'Дмитрий Иванов', time: '10:00', duration: '1ч', category: 'Новости', day_of_week: 'Пн', is_live: false },
    { id: '3', title: 'Обеденный микс', description: 'Лучшая музыка для обеда', host: 'Мария Козлова', time: '12:00', duration: '2ч', category: 'Музыка', day_of_week: 'Пн', is_live: false },
    { id: '4', title: 'Кофе-брейк', description: 'Разговоры за чашкой кофе', host: 'Елена Волкова', time: '15:00', duration: '1ч', category: 'Разговорное', day_of_week: 'Пн', is_live: false },
    { id: '5', title: 'Вечерний чилл', description: 'Расслабляющая музыка', host: 'Алексей Смирнов', time: '18:00', duration: '3ч', category: 'Музыка', day_of_week: 'Пн', is_live: false },
  ],
  hosts: [
    { id: '1', name: 'Анна Петрова', role: 'Ведущая утреннего шоу', hotel: 'Cosmos Moscow', bio: '5 лет в индустрии гостеприимства. Любит кофе и добрые утренние разговоры.', shows: ['Утренний кофе', 'Пятничное утро'], schedule: 'Пн, Ср, Пт 07:00', color: 'from-[#f59e0b] to-[#f97316]', initials: 'АП' },
    { id: '2', name: 'Михаил Соколов', role: 'Музыкальный редактор', hotel: 'Cosmos St. Petersburg', bio: 'DJ с 10-летним стажем. Подбирает идеальный саундтрек.', shows: ['Обеденный микс', 'Ланч-тайм'], schedule: 'Пн-Пт 12:00', color: 'from-[#8b5cf6] to-[#6366f1]', initials: 'МС' },
    { id: '3', name: 'Елена Волкова', role: 'Ведущая разговорных шоу', hotel: 'Cosmos Sochi', bio: 'Журналист и сторителлер. Умеет найти интересную историю.', shows: ['Кофе-брейк', 'Истории гостей'], schedule: 'Пн, Вт 15:00', color: 'from-[#22c55e] to-[#14b8a6]', initials: 'ЕВ' },
  ],
  podcasts: [
    { id: '1', title: 'Истории отелей', description: 'Удивительные истории из жизни отелей', host: 'Наталья Лебедева', episodes: 24, duration: '45 мин', category: 'Истории', likes: 128, color: 'from-[#f59e0b] to-[#f97316]' },
    { id: '2', title: 'Секреты консьержа', description: 'Профессиональные советы', host: 'Виктор Соколов', episodes: 18, duration: '30 мин', category: 'Обучение', likes: 96, color: 'from-[#22c55e] to-[#14b8a6]' },
    { id: '3', title: 'Кухня шеф-повара', description: 'Кулинарные секреты', host: 'Павел Кузнецов', episodes: 32, duration: '60 мин', category: 'Обучение', likes: 215, color: 'from-[#ef4444] to-[#f97316]' },
  ],
  categories: [
    { id: '1', name: 'Музыка', count: 156, color: 'from-[#8b5cf6] to-[#6366f1]' },
    { id: '2', name: 'Новости', count: 48, color: 'from-[#3b82f6] to-[#06b6d4]' },
    { id: '3', name: 'Развлечения', count: 72, color: 'from-[#ef4444] to-[#f97316]' },
    { id: '4', name: 'Обучение', count: 34, color: 'from-[#ec4899] to-[#8b5cf6]' },
  ],
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [shows, setShows] = useState<Show[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useLocal, setUseLocal] = useState(false);

  // Load settings
  const loadSettings = useCallback(() => {
    const s = getLocalSettings();
    setSettings(s);
  }, []);

  const loadLocalData = useCallback(() => {
    const local = getLocalData();
    if (local) {
      setShows(local.shows || []);
      setHosts(local.hosts || []);
      setPodcasts(local.podcasts || []);
      setCategories(local.categories || []);
    } else {
      setShows(DEMO_DATA.shows);
      setHosts(DEMO_DATA.hosts);
      setPodcasts(DEMO_DATA.podcasts);
      setCategories(DEMO_DATA.categories);
      saveLocalData(DEMO_DATA);
    }
    loadSettings();
    setLoading(false);
  }, [loadSettings]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [showsData, hostsData, podcastsData, categoriesData] = await Promise.all([
        getShows(),
        getHosts(),
        getPodcasts(),
        getCategories(),
      ]);
      setShows(showsData);
      setHosts(hostsData);
      setPodcasts(podcastsData);
      setCategories(categoriesData);
      setUseLocal(false);
      loadSettings();
      setError(null);
    } catch (err: any) {
      console.warn('Supabase not available, using local storage:', err.message);
      setUseLocal(true);
      loadLocalData();
    } finally {
      setLoading(false);
    }
  }, [loadLocalData, loadSettings]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (useLocal) return;
    const subs = [
      subscribeToShows(setShows),
      subscribeToHosts(setHosts),
      subscribeToPodcasts(setPodcasts),
    ];
    return () => { subs.forEach(sub => sub.unsubscribe()); };
  }, [useLocal]);

  const refresh = useCallback(() => { loadData(); }, [loadData]);

  const updateLocalState = useCallback((key: string, data: any[]) => {
    const current = getLocalData() || DEMO_DATA;
    current[key] = data;
    saveLocalData(current);
  }, []);

  // ========== IMAGE UPLOAD (base64 for localStorage) ==========
  const uploadImage = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // Store in localStorage with unique key
        const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        try {
          localStorage.setItem(`${IMAGES_KEY}_${imageId}`, base64);
          resolve(base64); // Return base64 directly for immediate use
        } catch (e) {
          reject(new Error('Не удалось сохранить изображение. Возможно, превышен лимит хранилища.'));
        }
      };
      reader.onerror = () => reject(new Error('Ошибка чтения файла'));
      reader.readAsDataURL(file);
    });
  }, []);

  // ========== SETTINGS ==========
  const updateSettings = useCallback(async (newSettings: Partial<SiteSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveLocalSettings(updated);
    // If using Supabase, save there too (optional table)
    if (!useLocal) {
      // Could save to a 'settings' table in Supabase
      console.log('Settings saved to localStorage. For cloud sync, add a settings table in Supabase.');
    }
  }, [settings, useLocal]);

  // ========== SHOWS CRUD ==========
  const addShow = async (show: Omit<Show, 'id' | 'created_at'>) => {
    if (useLocal) {
      const newShow = { ...show, id: Date.now().toString(), created_at: new Date().toISOString() };
      const updated = [...shows, newShow];
      setShows(updated);
      updateLocalState('shows', updated);
    } else {
      await createShow(show);
      refresh();
    }
  };
  const editShow = async (id: string, show: Partial<Show>) => {
    if (useLocal) {
      const updated = shows.map(s => s.id === id ? { ...s, ...show } : s);
      setShows(updated);
      updateLocalState('shows', updated);
    } else { await updateShow(id, show); refresh(); }
  };
  const removeShow = async (id: string) => {
    if (useLocal) {
      const updated = shows.filter(s => s.id !== id);
      setShows(updated);
      updateLocalState('shows', updated);
    } else { await deleteShow(id); refresh(); }
  };

  // ========== HOSTS CRUD ==========
  const addHost = async (host: Omit<Host, 'id' | 'created_at'>) => {
    if (useLocal) {
      const newHost = { ...host, id: Date.now().toString(), created_at: new Date().toISOString() };
      const updated = [...hosts, newHost];
      setHosts(updated);
      updateLocalState('hosts', updated);
    } else { await createHost(host); refresh(); }
  };
  const editHost = async (id: string, host: Partial<Host>) => {
    if (useLocal) {
      const updated = hosts.map(h => h.id === id ? { ...h, ...host } : h);
      setHosts(updated);
      updateLocalState('hosts', updated);
    } else { await updateHost(id, host); refresh(); }
  };
  const removeHost = async (id: string) => {
    if (useLocal) {
      const updated = hosts.filter(h => h.id !== id);
      setHosts(updated);
      updateLocalState('hosts', updated);
    } else { await deleteHost(id); refresh(); }
  };

  // ========== PODCASTS CRUD ==========
  const addPodcast = async (podcast: Omit<Podcast, 'id' | 'created_at'>) => {
    if (useLocal) {
      const newPodcast = { ...podcast, id: Date.now().toString(), created_at: new Date().toISOString() };
      const updated = [...podcasts, newPodcast];
      setPodcasts(updated);
      updateLocalState('podcasts', updated);
    } else { await createPodcast(podcast); refresh(); }
  };
  const editPodcast = async (id: string, podcast: Partial<Podcast>) => {
    if (useLocal) {
      const updated = podcasts.map(p => p.id === id ? { ...p, ...podcast } : p);
      setPodcasts(updated);
      updateLocalState('podcasts', updated);
    } else { await updatePodcast(id, podcast); refresh(); }
  };
  const removePodcast = async (id: string) => {
    if (useLocal) {
      const updated = podcasts.filter(p => p.id !== id);
      setPodcasts(updated);
      updateLocalState('podcasts', updated);
    } else { await deletePodcast(id); refresh(); }
  };

  // ========== CATEGORIES CRUD ==========
  const addCategory = async (category: Omit<Category, 'id' | 'created_at'>) => {
    if (useLocal) {
      const newCat = { ...category, id: Date.now().toString(), created_at: new Date().toISOString() };
      const updated = [...categories, newCat];
      setCategories(updated);
      updateLocalState('categories', updated);
    } else { await createCategory(category); refresh(); }
  };
  const editCategory = async (id: string, category: Partial<Category>) => {
    if (useLocal) {
      const updated = categories.map(c => c.id === id ? { ...c, ...category } : c);
      setCategories(updated);
      updateLocalState('categories', updated);
    } else { await updateCategory(id, category); refresh(); }
  };
  const removeCategory = async (id: string) => {
    if (useLocal) {
      const updated = categories.filter(c => c.id !== id);
      setCategories(updated);
      updateLocalState('categories', updated);
    } else { await deleteCategory(id); refresh(); }
  };

  return (
    <DataContext.Provider value={{
      shows, hosts, podcasts, categories, settings, loading, error, refresh,
      addShow, editShow, removeShow,
      addHost, editHost, removeHost,
      addPodcast, editPodcast, removePodcast,
      addCategory, editCategory, removeCategory,
      updateSettings,
      uploadImage,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
