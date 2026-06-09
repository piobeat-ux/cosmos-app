#!/bin/bash

# Cosmos Radio - Замена всех проблемных файлов
# Этот скрипт заменяет файлы на исправленные версии

set -e

echo "🔄 Cosmos Radio - Замена файлов..."
echo ""

# Проверяем, что мы в корне проекта
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: package.json не найден. Запустите скрипт из корня проекта."
    exit 1
fi

# ============================================
# 1. ОБНОВЛЕНИЕ src/App.tsx (Lazy Loading)
# ============================================
echo "📝 Обновление src/App.tsx (lazy loading)..."
cat > src/App.tsx << 'APPEOF'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy loading всех страниц
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Shows = lazy(() => import('./pages/Shows'))
const Podcasts = lazy(() => import('./pages/Podcasts'))
const Admin = lazy(() => import('./pages/Admin'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Layouts
const MainLayout = lazy(() => import('./layouts/MainLayout'))
const AdminLayout = lazy(() => import('./layouts/AdminLayout'))

// Оптимизированный QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 минут
      gcTime: 1000 * 60 * 30, // 30 минут
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/shows" element={<Shows />} />
                <Route path="/podcasts" element={<Podcasts />} />
              </Route>
              <Route path="/admin/*" element={<AdminLayout />}>
                <Route index element={<Admin />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
APPEOF
echo "✅ src/App.tsx обновлен"

# ============================================
# 2. ОБНОВЛЕНИЕ src/main.tsx
# ============================================
echo "📝 Обновление src/main.tsx..."
cat > src/main.tsx << 'MAINEOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
MAINEOF
echo "✅ src/main.tsx обновлен"

# ============================================
# 3. ОБНОВЛЕНИЕ src/types/index.ts
# ============================================
echo "📝 Обновление src/types/index.ts..."
mkdir -p src/types
cat > src/types/index.ts << 'TYPESEOF'
// Типы для Cosmos Radio

export interface MenuItem {
  id: string
  title: string
  url: string
  order_index: number
  is_active: boolean
}

export interface Banner {
  id: string
  title: string
  image_url: string
  link_url?: string
  is_active: boolean
  order_index: number
}

export interface Host {
  id: string
  name: string
  bio?: string
  avatar_url?: string
  photo_url?: string // Для обратной совместимости
  social_links?: Record<string, string>
  is_active: boolean
}

export interface Show {
  id: string
  title: string
  description?: string
  host_id?: string
  host?: Host
  audio_url?: string
  stream_url?: string
  image_url?: string
  schedule?: {
    days?: string[]
    time?: string
  }
  is_active: boolean
}

export interface Podcast {
  id: string
  title: string
  description?: string
  audio_url: string
  image_url?: string
  duration?: number
  published_at: string
  is_active: boolean
}

export interface AudioPlayerProps {
  src: string
  title?: string
  artist?: string
  autoPlay?: boolean
  className?: string
}
TYPESEOF
echo "✅ src/types/index.ts обновлен"

# ============================================
# 4. ОБНОВЛЕНИЕ src/pages/About.tsx
# ============================================
echo "📝 Обновление src/pages/About.tsx..."
cat > src/pages/About.tsx << 'ABOUTEOF'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Host } from '../types'

export default function About() {
  const { data: hosts, isLoading } = useQuery({
    queryKey: ['hosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosts')
        .select('*')
        .eq('is_active', true)
        .order('name')
      
      if (error) throw error
      return data as Host[]
    },
  })

  if (isLoading) {
    return <div className="p-8 text-center">Загрузка...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">О нас</h1>
      
      <div className="max-w-3xl mx-auto mb-12">
        <p className="text-lg text-gray-300 mb-4">
          Cosmos Radio — это ваша любимая радиостанция с лучшими шоу и подкастами.
          Мы вещаем 24/7, чтобы вы всегда могли наслаждаться качественной музыкой.
        </p>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center">Наши ведущие</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hosts?.map((host) => (
          <div key={host.id} className="bg-gray-800 rounded-lg p-6 text-center">
            <img
              src={host.avatar_url || host.photo_url || '/default-avatar.png'}
              alt={host.name}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              loading="lazy"
            />
            <h3 className="text-xl font-semibold mb-2">{host.name}</h3>
            {host.bio && <p className="text-gray-400 text-sm">{host.bio}</p>}
            {host.social_links && Object.keys(host.social_links).length > 0 && (
              <div className="mt-4 flex justify-center gap-3">
                {Object.entries(host.social_links).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
ABOUTEOF
echo "✅ src/pages/About.tsx обновлен"

# ============================================
# 5. ОБНОВЛЕНИЕ src/pages/Home.tsx
# ============================================
echo "📝 Обновление src/pages/Home.tsx..."
cat > src/pages/Home.tsx << 'HOMEEOF'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import AudioPlayer from '../components/AudioPlayer'
import type { Show, Banner } from '../types'

export default function Home() {
  const { data: shows } = useQuery({
    queryKey: ['shows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shows')
        .select('*, host:hosts(*)')
        .eq('is_active', true)
      
      if (error) throw error
      return data as Show[]
    },
  })

  const { data: banners } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('order_index')
      
      if (error) throw error
      return data as Banner[]
    },
  })

  // Умное определение текущего шоу
  const getCurrentShow = (shows: Show[]): Show | undefined => {
    if (!shows || shows.length === 0) return undefined
    
    const now = new Date()
    const dayMap: Record<string, string> = {
      '0': 'sun', '1': 'mon', '2': 'tue', '3': 'wed',
      '4': 'thu', '5': 'fri', '6': 'sat'
    }
    const currentDay = dayMap[now.getDay()]
    const currentTime = now.getHours() * 100 + now.getMinutes()

    // Ищем шоу по расписанию
    const currentShow = shows.find(show => {
      if (!show.schedule?.days || !show.schedule?.time) return false
      
      const daysMatch = show.schedule.days.includes(currentDay)
      if (!daysMatch) return false

      const [startTime, endTime] = show.schedule.time.split('-').map(t => {
        const [h, m] = t.split(':').map(Number)
        return h * 100 + m
      })

      return currentTime >= startTime && currentTime <= endTime
    })

    // Fallback: первое шоу с аудио
    return currentShow || shows.find(show => show.audio_url || show.stream_url)
  }

  const currentShow = getCurrentShow(shows || [])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Баннеры */}
      {banners && banners.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map((banner) => (
              <a
                key={banner.id}
                href={banner.link_url || '#'}
                target={banner.link_url ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-full h-48 object-cover rounded-lg hover:opacity-90 transition-opacity"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Текущее шоу */}
      {currentShow && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Сейчас в эфире</h2>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              {currentShow.image_url && (
                <img
                  src={currentShow.image_url}
                  alt={currentShow.title}
                  className="w-24 h-24 rounded-lg object-cover"
                  loading="lazy"
                />
              )}
              <div>
                <h3 className="text-xl font-semibold">{currentShow.title}</h3>
                {currentShow.host && (
                  <p className="text-gray-400">с {currentShow.host.name}</p>
                )}
                {currentShow.description && (
                  <p className="text-gray-300 mt-2">{currentShow.description}</p>
                )}
              </div>
            </div>
            <AudioPlayer
              src={currentShow.stream_url || currentShow.audio_url || ''}
              title={currentShow.title}
              artist={currentShow.host?.name}
              autoPlay={false}
            />
          </div>
        </div>
      )}

      {/* Все шоу */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Все шоу</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shows?.map((show) => (
            <div key={show.id} className="bg-gray-800 rounded-lg overflow-hidden">
              {show.image_url && (
                <img
                  src={show.image_url}
                  alt={show.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{show.title}</h3>
                {show.description && (
                  <p className="text-gray-400 text-sm mb-2">{show.description}</p>
                )}
                {show.schedule?.time && (
                  <p className="text-purple-400 text-sm">
                    📅 {show.schedule.days?.join(', ')} {show.schedule.time}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
HOMEEOF
echo "✅ src/pages/Home.tsx обновлен"

# ============================================
# 6. ОБНОВЛЕНИЕ src/components/Header.tsx
# ============================================
echo "📝 Обновление src/components/Header.tsx..."
cat > src/components/Header.tsx << 'HEADEREOF'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { MenuItem } from '../types'

export default function Header() {
  const { data: menuItems } = useQuery({
    queryKey: ['menu'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_active', true)
        .order('order_index')
      
      if (error) throw error
      return data as MenuItem[]
    },
  })

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-purple-400">
            🎵 Cosmos Radio
          </Link>
          
          <div className="flex gap-6">
            {menuItems?.map((item) => {
              const isExternal = item.url.startsWith('http')
              
              if (isExternal) {
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-purple-400 transition-colors"
                  >
                    {item.title}
                  </a>
                )
              }
              
              return (
                <Link
                  key={item.id}
                  to={item.url}
                  className="text-gray-300 hover:text-purple-400 transition-colors"
                >
                  {item.title}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </header>
  )
}
HEADEREOF
echo "✅ src/components/Header.tsx обновлен"

# ============================================
# 7. ОБНОВЛЕНИЕ src/components/AudioPlayer.tsx
# ============================================
echo "📝 Обновление src/components/AudioPlayer.tsx..."
cat > src/components/AudioPlayer.tsx << 'AUDIOPLAYEREOF'
import { useState, useRef, useEffect } from 'react'
import type { AudioPlayerProps } from '../types'

export default function AudioPlayer({ src, title, artist, autoPlay = false, className = '' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleWaiting = () => setIsBuffering(true)
    const handlePlaying = () => {
      setIsBuffering(false)
      setIsPlaying(true)
    }
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('playing', handlePlaying)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    // Autoplay с muted (обход блокировки браузеров)
    if (autoPlay) {
      audio.muted = true
      setIsMuted(true)
      audio.play().catch((err) => {
        console.warn('Autoplay blocked:', err)
      })
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('waiting', handleWaiting)
      audio.removeEventListener('playing', handlePlaying)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [autoPlay, src])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      try {
        await audio.play()
      } catch (err) {
        console.error('Playback failed:', err)
      }
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.muted = !audio.muted
    setIsMuted(audio.muted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = parseFloat(e.target.value)
    audio.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
      <audio ref={audioRef} src={src} preload="metadata" />
      
      {/* Информация о треке */}
      <div className="mb-3">
        {title && <h3 className="font-semibold">{title}</h3>}
        {artist && <p className="text-sm text-gray-400">{artist}</p>}
      </div>

      {/* Прогресс-бар */}
      <div className="mb-3">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${(currentTime / duration) * 100}%, #374151 ${(currentTime / duration) * 100}%, #374151 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Контролы */}
      <div className="flex items-center gap-4">
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          disabled={isBuffering}
          className="w-12 h-12 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
        >
          {isBuffering ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Volume */}
        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={toggleMute}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isMuted || volume === 0 ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}
AUDIOPLAYEREOF
echo "✅ src/components/AudioPlayer.tsx обновлен"

# ============================================
# 8. ОБНОВЛЕНИЕ src/components/FileUpload.tsx
# ============================================
echo "📝 Обновление src/components/FileUpload.tsx..."
cat > src/components/FileUpload.tsx << 'FILEUPLOADEOF'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface FileUploadProps {
  bucket: 'images' | 'audio'
  onUpload: (url: string) => void
  accept?: string
  maxSize?: number // в байтах
}

export default function FileUpload({ bucket, onUpload, accept, maxSize }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setUploading(true)
    setProgress(0)

    try {
      // Проверка размера файла
      if (maxSize && file.size > maxSize) {
        throw new Error(`Файл слишком большой. Максимум: ${(maxSize / 1024 / 1024).toFixed(1)} MB`)
      }

      // Проверка существования бакета
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      if (bucketsError) throw bucketsError
      
      const bucketExists = buckets?.some(b => b.name === bucket)
      if (!bucketExists) {
        throw new Error(`Бакет "${bucket}" не существует. Создайте его в Supabase Dashboard.`)
      }

      // Генерируем уникальное имя файла
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      // Загрузка файла
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Получаем публичный URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)

      setProgress(100)
      onUpload(publicUrl)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Ошибка загрузки файла')
    } finally {
      setUploading(false)
    }
  }

  const defaultAccept = bucket === 'images' 
    ? 'image/jpeg,image/png,image/webp,image/gif'
    : 'audio/mpeg,audio/mp3,audio/wav,audio/ogg'

  const defaultMaxSize = bucket === 'images' ? 5 * 1024 * 1024 : 200 * 1024 * 1024

  return (
    <div className="space-y-2">
      <label className="block">
        <span className="sr-only">Выберите файл</span>
        <input
          type="file"
          accept={accept || defaultAccept}
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-purple-600 file:text-white
            hover:file:bg-purple-700
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </label>

      {uploading && (
        <div className="space-y-1">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Загрузка...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded">
          ❌ {error}
        </div>
      )}

      <p className="text-xs text-gray-500">
        Максимальный размер: {((maxSize || defaultMaxSize) / 1024 / 1024).toFixed(0)} MB
      </p>
    </div>
  )
}
FILEUPLOADEOF
echo "✅ src/components/FileUpload.tsx обновлен"

# ============================================
# 9. ОБНОВЛЕНИЕ src/admin/AdminOverview.tsx
# ============================================
echo "📝 Обновление src/admin/AdminOverview.tsx..."
mkdir -p src/admin
cat > src/admin/AdminOverview.tsx << 'ADMINOVERVIEWEOF'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export default function AdminOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [shows, hosts, podcasts, banners] = await Promise.all([
        supabase.from('shows').select('*', { count: 'exact', head: true }),
        supabase.from('hosts').select('*', { count: 'exact', head: true }),
        supabase.from('podcasts').select('*', { count: 'exact', head: true }),
        supabase.from('banners').select('*', { count: 'exact', head: true }),
      ])

      return {
        shows: shows.count || 0,
        hosts: hosts.count || 0,
        podcasts: podcasts.count || 0,
        banners: banners.count || 0,
      }
    },
  })

  const statCards = [
    { label: 'Всего шоу', value: stats?.shows ?? '-', icon: '🎵', color: 'from-purple-500 to-pink-500' },
    { label: 'Ведущих', value: stats?.hosts ?? '-', icon: '🎤', color: 'from-blue-500 to-cyan-500' },
    { label: 'Подкастов', value: stats?.podcasts ?? '-', icon: '🎧', color: 'from-green-500 to-emerald-500' },
    { label: 'Баннеров', value: stats?.banners ?? '-', icon: '🖼️', color: 'from-orange-500 to-red-500' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Обзор</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`bg-gradient-to-br ${card.color} rounded-lg p-6 text-white shadow-lg`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">{card.icon}</span>
              <span className="text-3xl font-bold">
                {isLoading ? '...' : card.value}
              </span>
            </div>
            <p className="text-sm opacity-90">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/admin/shows" className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-colors">
            <h3 className="font-semibold mb-1">🎵 Управление шоу</h3>
            <p className="text-sm text-gray-400">Добавление и редактирование шоу</p>
          </a>
          <a href="/admin/hosts" className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-colors">
            <h3 className="font-semibold mb-1">🎤 Управление ведущими</h3>
            <p className="text-sm text-gray-400">Добавление и редактирование ведущих</p>
          </a>
          <a href="/admin/podcasts" className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-colors">
            <h3 className="font-semibold mb-1">🎧 Управление подкастами</h3>
            <p className="text-sm text-gray-400">Загрузка и управление подкастами</p>
          </a>
          <a href="/admin/banners" className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-colors">
            <h3 className="font-semibold mb-1">🖼️ Управление баннерами</h3>
            <p className="text-sm text-gray-400">Загрузка и управление баннерами</p>
          </a>
        </div>
      </div>
    </div>
  )
}
ADMINOVERVIEWEOF
echo "✅ src/admin/AdminOverview.tsx обновлен"

# ============================================
# 10. ОБНОВЛЕНИЕ index.html
# ============================================
echo "📝 Обновление index.html..."
cat > index.html << 'INDEXHTMLEOF'
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="Cosmos Radio — ваша любимая радиостанция с лучшими шоу и подкастами 24/7" />
    <meta name="keywords" content="радио, музыка, подкасты, шоу, cosmos, космос" />
    <meta name="author" content="Cosmos Radio" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://cosmos-app-gray.vercel.app/" />
    <meta property="og:title" content="Cosmos Radio — Лучшая музыка 24/7" />
    <meta property="og:description" content="Слушайте лучшие шоу и подкасты на Cosmos Radio" />
    <meta property="og:image" content="/og-image.jpg" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://cosmos-app-gray.vercel.app/" />
    <meta property="twitter:title" content="Cosmos Radio — Лучшая музыка 24/7" />
    <meta property="twitter:description" content="Слушайте лучшие шоу и подкасты на Cosmos Radio" />
    <meta property="twitter:image" content="/og-image.jpg" />
    
    <!-- Preconnect для ускорения загрузки -->
    <link rel="preconnect" href="https://xaosenjxumrldtbjtjyr.supabase.co" />
    <link rel="dns-prefetch" href="https://xaosenjxumrldtbjtjyr.supabase.co" />
    
    <title>Cosmos Radio — Лучшая музыка 24/7</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
INDEXHTMLEOF
echo "✅ index.html обновлен"

# Финальное сообщение
echo ""
echo "=========================================="
echo "✅ ВСЕ ФАЙЛЫ УСПЕШНО ОБНОВЛЕНЫ!"
echo "=========================================="
echo ""
echo "📋 Что было обновлено:"
echo "  ✅ src/App.tsx - lazy loading всех страниц"
echo "  ✅ src/main.tsx - оптимизация React Query"
echo "  ✅ src/types/index.ts - исправлен тип Host (avatar_url)"
echo "  ✅ src/pages/About.tsx - используется avatar_url"
echo "  ✅ src/pages/Home.tsx - умное определение текущего шоу"
echo "  ✅ src/components/Header.tsx - поддержка внешних ссылок"
echo "  ✅ src/components/AudioPlayer.tsx - обход блокировки autoplay"
echo "  ✅ src/components/FileUpload.tsx - проверка бакетов"
echo "  ✅ src/admin/AdminOverview.tsx - реальные счётчики"
echo "  ✅ index.html - SEO мета-теги"
echo ""
echo "🚀 Следующие шаги:"
echo ""
echo "1. Выполните SQL скрипт в Supabase Dashboard:"
echo "   - Откройте https://supabase.com/dashboard/project/xaosenjxumrldtbjtjyr/sql"
echo "   - Скопируйте содержимое supabase-setup.sql"
echo "   - Выполните скрипт"
echo ""
echo "2. Создайте .env файл:"
echo "   cp .env.example .env"
echo "   nano .env  # добавьте ваш SUPABASE_ANON_KEY"
echo ""
echo "3. Установите зависимости и запустите проект:"
echo "   npm install"
echo "   npm run dev"
echo ""
echo "4. Задеплойте на Vercel:"
echo "   git add ."
echo "   git commit -m 'fix: all critical issues and performance improvements'"
echo "   git push"
echo ""
echo "=========================================="