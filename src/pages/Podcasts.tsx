import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AudioPlayer from '@/components/AudioPlayer'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Podcast } from '@/types'
import { useState } from 'react'

export default function Podcasts() {
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null)

  const { data: podcasts = [], isLoading } = useQuery({
    queryKey: ['podcasts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('podcasts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
      
      if (error) throw error
      return data as Podcast[]
    },
  })

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        <section className="container-custom py-16">
          <h1 className="section-title">
            <span className="gradient-text">Подкасты</span>
          </h1>

          {/* Selected Podcast Player */}
          {selectedPodcast && (
            <div className="max-w-3xl mx-auto mb-12 fade-in">
              <AudioPlayer
                src={selectedPodcast.audio_url}
                title={selectedPodcast.title}
                subtitle={selectedPodcast.show_title}
              />
            </div>
          )}

          {/* Podcasts List */}
          <div className="max-w-4xl mx-auto space-y-4">
            {podcasts.map((podcast) => (
              <div
                key={podcast.id}
                className={`glass-card p-6 cursor-pointer transition-all ${
                  selectedPodcast?.id === podcast.id ? 'ring-2 ring-primary-500' : ''
                }`}
                onClick={() => setSelectedPodcast(podcast)}
              >
                <div className="flex items-start gap-4">
                  {podcast.cover_url && (
                    <img
                      src={podcast.cover_url}
                      alt={podcast.title}
                      className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{podcast.title}</h3>
                    {podcast.description && (
                      <p className="text-gray-400 mb-2">{podcast.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {podcast.show_title && (
                        <span>{podcast.show_title}</span>
                      )}
                      <span>
                        {new Date(podcast.published_at).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
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