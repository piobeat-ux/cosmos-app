import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Host } from '@/types'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function About() {
  const { data: hosts = [], isLoading } = useQuery({
    queryKey: ['hosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosts')
        .select('*')
        .order('order_index')
      
      if (error) throw error
      return data as Host[]
    },
  })

  const { data: aboutText } = useQuery({
    queryKey: ['aboutText'],
    queryFn: async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'about_text')
        .single()
      
      return data?.value || 'Cosmos Radio - это команда профессионалов, которая создает уникальный контент для вас.'
    },
  })

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* About Section */}
        <section className="container-custom py-16">
          <h1 className="section-title">
            <span className="gradient-text">О нас</span>
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-300 leading-relaxed text-center">
              {aboutText}
            </p>
          </div>
        </section>

        {/* Hosts Section */}
        <section className="container-custom py-16">
          <h2 className="section-title">
            <span className="gradient-text">Наши ведущие</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hosts.map((host) => (
              <div key={host.id} className="glass-card p-6 text-center">
                {host.photo_url && (
                  <img
                    src={host.photo_url}
                    alt={host.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-primary-500/20"
                  />
                )}
                <h3 className="text-xl font-bold mb-2">{host.name}</h3>
                {host.bio && (
                  <p className="text-gray-400 text-sm">{host.bio}</p>
                )}
                {host.social_links && Object.keys(host.social_links).length > 0 && (
                  <div className="flex justify-center gap-3 mt-4">
                    {Object.entries(host.social_links).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                      >
                        {platform}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}