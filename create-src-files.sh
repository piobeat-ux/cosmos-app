#!/bin/bash

echo "🚀 Создаю файлы src/..."

# src/lib/supabase.ts
mkdir -p src/lib src/types src/contexts src/components src/pages src/admin

cat > src/lib/supabase.ts << 'EOF'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
EOF

# src/lib/utils.ts
cat > src/lib/utils.ts << 'EOF'
export function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
EOF

# src/types/index.ts
cat > src/types/index.ts << 'EOF'
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
EOF

echo "✅ Базовые файлы созданы!"