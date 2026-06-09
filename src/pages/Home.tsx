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
