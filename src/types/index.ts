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
