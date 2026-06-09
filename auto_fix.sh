#!/bin/bash

# Cosmos Radio - Автоматическое исправление
# Этот скрипт выполняет начальную настройку проекта

set -e  # Выход при ошибке

echo "🚀 Cosmos Radio - Начало автоматического исправления..."
echo ""

# Проверяем, что мы в корне проекта
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: package.json не найден. Запустите скрипт из корня проекта."
    exit 1
fi

# Шаг 1: Создание .gitignore
echo "📝 Шаг 1: Создание .gitignore..."
cat > .gitignore << 'GITIGNORE_EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Production
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS
Thumbs.db
GITIGNORE_EOF
echo "✅ .gitignore создан"

# Шаг 2: Удаление лишних файлов из Git
echo ""
echo "🗑️  Шаг 2: Очистка Git от лишних файлов..."
if [ -d ".git" ]; then
    # Удаляем gitignore (без точки) если существует
    if [ -f "gitignore" ]; then
        rm gitignore
        echo "  - Удален gitignore (без точки)"
    fi
    
    # Удаляем node_modules, dist, .env из Git tracking
    git rm -r --cached node_modules 2>/dev/null && echo "  - Удален node_modules из Git" || echo "  - node_modules не в Git"
    git rm -r --cached dist 2>/dev/null && echo "  - Удален dist из Git" || echo "  - dist не в Git"
    git rm --cached .env 2>/dev/null && echo "  - Удален .env из Git" || echo "  - .env не в Git"
    
    # Коммитим изменения
    git add .gitignore
    git commit -m "chore: add .gitignore, remove tracked files" 2>/dev/null || echo "  - Нет изменений для коммита"
else
    echo "⚠️  Git не инициализирован, пропускаем очистку"
fi

# Шаг 3: Создание ErrorBoundary
echo ""
echo "📦 Шаг 3: Создание ErrorBoundary..."
mkdir -p src/components
cat > src/components/ErrorBoundary.tsx << 'ERRORBOUNDARY_EOF'
import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-8">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold mb-4">😔 Что-то пошло не так</h1>
            <p className="text-gray-400 mb-6">
              Произошла ошибка при загрузке страницы. Пожалуйста, попробуйте перезагрузить страницу.
            </p>
            {this.state.error && (
              <details className="text-left mb-6 p-4 bg-gray-800 rounded">
                <summary className="cursor-pointer text-sm text-gray-400 mb-2">Детали ошибки</summary>
                <pre className="text-xs text-red-400 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
            >
              Перезагрузить страницу
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
ERRORBOUNDARY_EOF
echo "✅ ErrorBoundary создан"

# Шаг 4: Создание LoadingSpinner
echo ""
echo "📦 Шаг 4: Создание LoadingSpinner..."
cat > src/components/LoadingSpinner.tsx << 'LOADINGSPINNER_EOF'
export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-gray-700 border-t-purple-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-purple-500 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
LOADINGSPINNER_EOF
echo "✅ LoadingSpinner создан"

# Шаг 5: Создание NotFound страницы
echo ""
echo "📦 Шаг 5: Создание NotFound страницы..."
mkdir -p src/pages
cat > src/pages/NotFound.tsx << 'NOTFOUND_EOF'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-purple-900 text-white p-8">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-4">Страница не найдена</h2>
        <p className="text-gray-400 mb-8">
          К сожалению, страница, которую вы ищете, не существует или была перемещена.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
          >
            На главную
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
          >
            Назад
          </button>
        </div>
      </div>
    </div>
  )
}
NOTFOUND_EOF
echo "✅ NotFound создан"

# Шаг 6: Создание supabase-setup.sql
echo ""
echo "📦 Шаг 6: Создание supabase-setup.sql..."
cat > supabase-setup.sql << 'SQL_EOF'
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
SQL_EOF
echo "✅ supabase-setup.sql создан"

# Шаг 7: Создание .env.example
echo ""
echo "📦 Шаг 7: Создание .env.example..."
cat > .env.example << 'ENVEOF'
# Supabase Configuration
VITE_SUPABASE_URL=https://xaosenjxumrldtbjtjyr.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: Additional configuration
VITE_APP_NAME=Cosmos Radio
VITE_APP_URL=https://cosmos-app-gray.vercel.app
ENVEOF
echo "✅ .env.example создан"

# Шаг 8: Создание vercel.json с кэшированием
echo ""
echo "📦 Шаг 8: Обновление vercel.json..."
cat > vercel.json << 'VERCELEOF'
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*\\.(png|jpg|jpeg|webp|gif|svg|ico))",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=604800"
        }
      ]
    },
    {
      "source": "/(.*\\.(mp3|wav|ogg|m4a))",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=2592000"
        }
      ]
    },
    {
      "source": "/(.*\\.(js|css))",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
VERCELEOF
echo "✅ vercel.json обновлен"

# Финальное сообщение
echo ""
echo "=========================================="
echo "✅ БАЗОВАЯ НАСТРОЙКА ЗАВЕРШЕНА!"
echo "=========================================="
echo ""
echo "📋 Следующие шаги:"
echo ""
echo "1. Запустите второй скрипт для замены файлов:"
echo "   chmod +x replace_files.sh"
echo "   bash replace_files.sh"
echo ""
echo "2. Выполните SQL скрипт в Supabase Dashboard:"
echo "   - Откройте https://supabase.com/dashboard/project/xaosenjxumrldtbjtjyr/sql"
echo "   - Скопируйте содержимое supabase-setup.sql"
echo "   - Выполните скрипт"
echo ""
echo "3. Создайте .env файл:"
echo "   cp .env.example .env"
echo "   nano .env  # добавьте ваш SUPABASE_ANON_KEY"
echo ""
echo "4. Установите зависимости и запустите проект:"
echo "   npm install"
echo "   npm run dev"
echo ""
echo "=========================================="