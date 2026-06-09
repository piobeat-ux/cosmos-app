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
