import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AudioPlayer from '@/components/AudioPlayer'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Show } from '@/types'
import { useState } from 'react'

export default function Shows() {
  const [selectedShow, setSelectedShow] = useState<Show | null>(null)

  const { data: shows = [], isLoading } = useQuery({
    queryKey: ['shows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shows')
        .select('*')
        .eq('is_active', true)
        .order('order_index')
      
      if (error) throw error
      return data as Show[]
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
            <span className="gradient-text">Все шоу</span>
          </h1>

          {/* Selected Show Player */}
          {selectedShow && selectedShow.audio_url && (
            <div className="max-w-3xl mx-auto mb-12 fade-in">
              <AudioPlayer
                src={selectedShow.audio_url}
                title={selectedShow.title}
                subtitle={`${selectedShow.days || ''} ${selectedShow.time || ''}`.trim()}
              />
            </div>
          )}

          {/* Shows Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shows.map((show) => (
              <div
                key={show.id}
                className={`glass-card overflow-hidden cursor-pointer transition-all ${
                  selectedShow?.id === show.id ? 'ring-2 ring-primary-500' : ''
                }`}
                onClick={() => show.audio_url && setSelectedShow(show)}
              >
                {show.image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={show.image_url}
                      alt={show.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                    {show.audio_url && (
                      <div className="absolute top-4 right-4 bg-primary-600 rounded-full p-2">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{show.title}</h3>
                  {show.description && (
                    <p className="text-gray-400 mb-4">{show.description}</p>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    {show.time && (
                      <div className="text-primary-400 font-medium">
                        {show.days} • {show.time}
                      </div>
                    )}
                    {show.host_name && (
                      <div className="text-gray-400">
                        {show.host_name}
                      </div>
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