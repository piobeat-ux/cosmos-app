import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AudioPlayer from '@/components/AudioPlayer'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Show, Banner } from '@/types'
import { Play } from 'lucide-react'

export default function Home() {
  const { data: banners = [], isLoading: bannersLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('order_index')
        .limit(5)
      if (error) {
        console.error('Error loading banners:', error)
        throw error
      }
      return data as Banner[]
    },
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: 2,
  })

  const { data: shows = [], isLoading: showsLoading } = useQuery({
    queryKey: ['shows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shows')
        .select('*')
        .eq('is_active', true)
        .order('order_index')
        .limit(10)
      if (error) {
        console.error('Error loading shows:', error)
        throw error
      }
      return data as Show[]
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })

  const currentShow = shows.find(show => show.audio_url)

  if (bannersLoading || showsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
          {banners[0] && (
            <>
              <img
                src={banners[0].image_url}
                alt={banners[0].title || 'Banner'}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-dark-950/50 via-dark-950/70 to-dark-950" />
            </>
          )}
          <div className="relative z-10 text-center px-4 fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              {banners[0]?.title || 'Cosmos Radio'}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {banners[0]?.subtitle || 'Ваша любимая музыка 24/7'}
            </p>
            {banners[0]?.link_url && banners[0]?.button_text && (
              <a href={banners[0].link_url} className="btn-primary inline-flex items-center gap-2">
                <Play size={20} />
                {banners[0].button_text}
              </a>
            )}
          </div>
        </section>

        {currentShow && (
          <section className="container-custom py-16">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                  Сейчас в эфире
                </span>
              </h2>
              <AudioPlayer
                src={currentShow.audio_url!}
                title={currentShow.title}
                subtitle={`${currentShow.days || ''} ${currentShow.time || ''}`.trim()}
              />
            </div>
          </section>
        )}

        <section className="container-custom py-16">
          <h2 className="section-title">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
              Наши шоу
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shows.map((show) => (
              <div key={show.id} className="glass-card overflow-hidden group">
                {show.image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={show.image_url}
                      alt={show.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950 to-transparent opacity-60" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{show.title}</h3>
                  {show.description && (
                    <p className="text-gray-400 mb-4 line-clamp-2">{show.description}</p>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    {show.time && (
                      <div className="text-primary-400 font-medium">
                        {show.days} • {show.time}
                      </div>
                    )}
                    {show.host_name && (
                      <div className="text-gray-400">{show.host_name}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
