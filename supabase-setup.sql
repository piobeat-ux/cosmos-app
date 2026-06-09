-- Cosmos Radio - Настройка Supabase
-- Выполните этот скрипт в Supabase Dashboard → SQL Editor

-- ============================================
-- 1. СОЗДАНИЕ ТАБЛИЦ
-- ============================================

-- Таблица меню
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица баннеров
CREATE TABLE IF NOT EXISTS banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица ведущих
CREATE TABLE IF NOT EXISTS hosts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  social_links JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица шоу
CREATE TABLE IF NOT EXISTS shows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  host_id UUID REFERENCES hosts(id) ON DELETE SET NULL,
  audio_url TEXT,
  stream_url TEXT,
  image_url TEXT,
  schedule JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица подкастов
CREATE TABLE IF NOT EXISTS podcasts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT NOT NULL,
  image_url TEXT,
  duration INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. СОЗДАНИЕ ИНДЕКСОВ
-- ============================================

CREATE INDEX IF NOT EXISTS idx_menu_items_order ON menu_items(order_index);
CREATE INDEX IF NOT EXISTS idx_banners_order ON banners(order_index);
CREATE INDEX IF NOT EXISTS idx_shows_host ON shows(host_id);
CREATE INDEX IF NOT EXISTS idx_podcasts_published ON podcasts(published_at DESC);

-- ============================================
-- 3. НАСТРОЙКА RLS (Row Level Security)
-- ============================================

-- Включаем RLS для всех таблиц
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;

-- Публичное чтение для всех
CREATE POLICY "Public read access for menu_items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public read access for banners" ON banners FOR SELECT USING (true);
CREATE POLICY "Public read access for hosts" ON hosts FOR SELECT USING (true);
CREATE POLICY "Public read access for shows" ON shows FOR SELECT USING (true);
CREATE POLICY "Public read access for podcasts" ON podcasts FOR SELECT USING (true);

-- Запись только для аутентифицированных пользователей
CREATE POLICY "Auth write access for menu_items" ON menu_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write access for banners" ON banners FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write access for hosts" ON hosts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write access for shows" ON shows FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write access for podcasts" ON podcasts FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 4. СОЗДАНИЕ STORAGE BUCKETS
-- ============================================

-- Создаем бакет для изображений
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Создаем бакет для аудио
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'audio',
  'audio',
  true,
  209715200, -- 200 MB
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/x-wav']
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. НАСТРОЙКА CORS ДЛЯ STORAGE
-- ============================================

-- Разрешаем публичный доступ к файлам
CREATE POLICY "Public read access for images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Public read access for audio" ON storage.objects FOR SELECT USING (bucket_id = 'audio');

-- Разрешаем загрузку для аутентифицированных пользователей
CREATE POLICY "Auth upload for images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth upload for audio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'audio' AND auth.role() = 'authenticated');

-- Разрешаем удаление для аутентифицированных пользователей
CREATE POLICY "Auth delete for images" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete for audio" ON storage.objects FOR DELETE USING (bucket_id = 'audio' AND auth.role() = 'authenticated');

-- ============================================
-- ГОТОВО!
-- ============================================
