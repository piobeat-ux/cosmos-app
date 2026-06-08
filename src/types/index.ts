export interface SiteSettings {
  id: string
  key: string
  value: string
  type: string
  updated_at: string
}

export interface MenuItem {
  id: string
  title: string
  url: string
  icon?: string
  order_index: number
  is_active: boolean
  created_at: string
}

export interface Show {
  id: string
  title: string
  description?: string
  time?: string
  days?: string
  image_url?: string
  audio_url?: string
  host_name?: string
  category?: string
  order_index: number
  is_active: boolean
  created_at: string
}

export interface Host {
  id: string
  name: string
  bio?: string
  photo_url?: string
  social_links?: Record<string, string>
  order_index: number
  created_at: string
}

export interface Podcast {
  id: string
  title: string
  description?: string
  audio_url: string
  duration?: number
  cover_url?: string
  show_title?: string
  published_at: string
  is_published: boolean
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon?: string
  order_index: number
  is_active: boolean
}

export interface Banner {
  id: string
  title?: string
  subtitle?: string
  image_url: string
  link_url?: string
  button_text?: string
  order_index: number
  is_active: boolean
  created_at: string
}

export interface Contact {
  id: string
  type: string
  value: string
  label?: string
  icon?: string
  order_index: number
}
