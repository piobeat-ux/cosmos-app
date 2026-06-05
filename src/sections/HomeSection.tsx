import { Play, Clock, Calendar, ChevronRight, Radio, Heart, Share2, Headphones } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';
import { useData } from '@/context/DataContext';

export function HomeSection() {
  const { isPlaying, togglePlay } = useAudio();
  const { settings, shows, podcasts, categories } = useData();

  // Ближайшие передачи (из базы)
  const upcomingShows = shows.slice(0, 5);

  // Популярные подкасты (из базы)
  const popularPodcasts = [...podcasts].sort((a, b) => b.likes - a.likes).slice(0, 6);

  // Категории (из базы)
  const categoryList = categories.slice(0, 8);

  // Текущий эфир из настроек
  const currentShow = {
    title: settings.current_show_title || 'Утренний кофе',
    host: settings.current_show_host || 'Анна Петрова',
    cover: settings.current_show_cover || '',
    streamUrl: settings.stream_url || '',
  };

  return (
    <div className="space-y-8">
      {/* Hero - Now Playing */}
      <section className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/30 via-[#8b5cf6]/20 to-[#0a0a0f]" />
        {settings.hero_cover_image ? (
          <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${settings.hero_cover_image})` }} />
        ) : (
          <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-30" />
        )}
        
        <div className="relative section-padding py-12">
          {/* Hero Text */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{settings.hero_title}</h1>
            <p className="text-lg text-[#a1a1aa]">{settings.hero_subtitle}</p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Cover */}
            <div className="relative">
              {currentShow.cover ? (
                <img 
                  src={currentShow.cover} 
                  alt={currentShow.title}
                  className="w-48 h-48 md:w-56 md:h-56 rounded-2xl object-cover animate-pulse-glow" 
                />
              ) : (
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center animate-pulse-glow">
                  <Radio className="w-24 h-24 text-white" />
                </div>
              )}
              <div className="absolute -bottom-3 -right-3 px-4 py-2 rounded-full bg-[#ef4444] text-white text-sm font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                LIVE
              </div>
            </div>

            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <p className="text-[#a1a1aa] mb-2">Сейчас в эфире</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">{currentShow.title}</h2>
              <p className="text-[#71717a] mb-6">{currentShow.host}</p>
              
              {/* Stream URL indicator */}
              {currentShow.streamUrl && (
                <div className="mb-4 px-3 py-2 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20 inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                  <span className="text-sm text-[#22c55e]">Аудиопоток подключен</span>
                </div>
              )}
              
              <div className="flex items-center justify-center md:justify-start gap-4">
                <button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
                >
                  {isPlaying ? (
                    <div className="flex gap-1">
                      <div className="w-1.5 h-5 bg-[#0a0a0f] rounded-full" />
                      <div className="w-1.5 h-5 bg-[#0a0a0f] rounded-full" />
                    </div>
                  ) : (
                    <Play className="w-6 h-6 text-[#0a0a0f] ml-1" />
                  )}
                </button>
                
                <button className="p-3 rounded-full bg-[#13131f] hover:bg-[#1e1e2e] transition-colors">
                  <Heart className="w-5 h-5 text-[#71717a]" />
                </button>
                <button className="p-3 rounded-full bg-[#13131f] hover:bg-[#1e1e2e] transition-colors">
                  <Share2 className="w-5 h-5 text-[#71717a]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-xl font-bold mb-4">Категории</h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {categoryList.length > 0 ? categoryList.map((cat) => (
            <button
              key={cat.id}
              className="flex-shrink-0 px-5 py-3 rounded-xl bg-[#13131f] border border-[#27273a] hover:border-[#6366f1]/50 transition-colors text-left"
            >
              <div className="font-medium">{cat.name}</div>
              <div className="text-xs text-[#71717a]">{cat.count} передач</div>
            </button>
          )) : (
            ['Музыка', 'Новости', 'Развлечения', 'Обучение'].map(cat => (
              <button key={cat} className="flex-shrink-0 px-5 py-3 rounded-xl bg-[#13131f] border border-[#27273a]">
                <div className="font-medium">{cat}</div>
              </button>
            ))
          )}
        </div>
      </section>

      {/* Upcoming Shows */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Ближайшие передачи</h2>
          <button className="flex items-center gap-1 text-sm text-[#6366f1] hover:underline">
            Все <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          {upcomingShows.length > 0 ? upcomingShows.map((show) => (
            <div key={show.id} className="show-card flex items-center gap-4">
              <div className="flex-shrink-0 w-14 text-center">
                <Clock className="w-5 h-5 text-[#6366f1] mx-auto mb-1" />
                <span className="text-sm font-medium">{show.time}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{show.title}</h3>
                <p className="text-sm text-[#71717a]">{show.host}</p>
              </div>
              
              <span className="category-badge bg-[#6366f1]/10 text-[#6366f1] hidden sm:inline">
                {show.category}
              </span>
              
              <button className="p-2 rounded-xl hover:bg-[#1e1e2e] transition-colors">
                <Calendar className="w-5 h-5 text-[#71717a]" />
              </button>
            </div>
          )) : (
            <p className="text-[#71717a] text-center py-4">Нет запланированных передач</p>
          )}
        </div>
      </section>

      {/* Popular Podcasts */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Популярные подкасты</h2>
          <button className="flex items-center gap-1 text-sm text-[#6366f1] hover:underline">
            Все <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularPodcasts.length > 0 ? popularPodcasts.map((podcast) => (
            <div key={podcast.id} className="show-card group cursor-pointer">
              {podcast.cover_image ? (
                <div className="relative w-full h-32 rounded-xl overflow-hidden mb-3">
                  <img src={podcast.cover_image} alt={podcast.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                      <Play className="w-5 h-5 text-[#0a0a0f] ml-0.5" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${podcast.color} flex items-center justify-center mb-3`}>
                  <Headphones className="w-5 h-5 text-white" />
                </div>
              )}
              <h3 className="font-medium mb-1">{podcast.title}</h3>
              <p className="text-sm text-[#71717a] mb-2">{podcast.host}</p>
              <div className="flex items-center gap-3 text-xs text-[#71717a]">
                <span>{podcast.episodes} выпусков</span>
                <span>•</span>
                <span>{podcast.duration}</span>
              </div>
            </div>
          )) : (
            <p className="text-[#71717a] col-span-3 text-center py-4">Нет подкастов</p>
          )}
        </div>
      </section>
    </div>
  );
}
