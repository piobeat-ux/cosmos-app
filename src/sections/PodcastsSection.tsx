import { useState } from 'react';
import { Search, Play, Clock, Headphones, Heart, Share2 } from 'lucide-react';

const categories = ['Все', 'Истории', 'Обучение', 'Развлечения', 'Новости', 'Музыка'];

const podcasts = [
  {
    title: 'Истории отелей',
    description: 'Удивительные истории из жизни отелей сети Cosmos',
    host: 'Наталья Лебедева',
    episodes: 24,
    duration: '45 мин',
    category: 'Истории',
    likes: 128,
    color: 'from-[#f59e0b] to-[#f97316]',
  },
  {
    title: 'Секреты консьержа',
    description: 'Профессиональные советы от лучших консьержей',
    host: 'Виктор Соколов',
    episodes: 18,
    duration: '30 мин',
    category: 'Обучение',
    likes: 96,
    color: 'from-[#22c55e] to-[#14b8a6]',
  },
  {
    title: 'Кухня шеф-повара',
    description: 'Кулинарные секреты и рецепты от наших шефов',
    host: 'Павел Кузнецов',
    episodes: 32,
    duration: '60 мин',
    category: 'Обучение',
    likes: 215,
    color: 'from-[#ef4444] to-[#f97316]',
  },
  {
    title: 'Cosmos News',
    description: 'Главные новости сети отелей Cosmos',
    host: 'Редакция',
    episodes: 52,
    duration: '15 мин',
    category: 'Новости',
    likes: 78,
    color: 'from-[#3b82f6] to-[#06b6d4]',
  },
  {
    title: 'Вечерний разговор',
    description: 'Легкие беседы на интересные темы',
    host: 'Алиса Волкова',
    episodes: 45,
    duration: '40 мин',
    category: 'Развлечения',
    likes: 167,
    color: 'from-[#8b5cf6] to-[#ec4899]',
  },
  {
    title: 'Музыкальная подборка',
    description: 'Лучшие треки из эфира Cosmos FM',
    host: 'DJ Cosmos',
    episodes: 68,
    duration: '120 мин',
    category: 'Музыка',
    likes: 342,
    color: 'from-[#6366f1] to-[#8b5cf6]',
  },
];

export function PodcastsSection() {
  const [activeCategory, setActiveCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPodcasts = podcasts.filter(
    (podcast) =>
      (activeCategory === 'Все' || podcast.category === activeCategory) &&
      podcast.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Подкасты</h1>
        <p className="text-[#71717a]">Записи эфиров и эксклюзивный контент</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#71717a]" />
        <input
          type="text"
          placeholder="Поиск подкастов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#13131f] border border-[#27273a] focus:border-[#6366f1] focus:outline-none transition-colors"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white'
                : 'bg-[#13131f] border border-[#27273a] text-[#a1a1aa] hover:border-[#6366f1]/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Podcasts Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPodcasts.map((podcast, index) => (
          <div
            key={index}
            className="show-card group"
          >
            {/* Cover */}
            <div className={`w-full aspect-video rounded-xl bg-gradient-to-br ${podcast.color} flex items-center justify-center mb-4 relative overflow-hidden`}>
              <Headphones className="w-12 h-12 text-white/50" />
              <button className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                  <Play className="w-6 h-6 text-[#0a0a0f] ml-1" />
                </div>
              </button>
            </div>

            {/* Content */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold truncate">{podcast.title}</h3>
              <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-[#6366f1]/10 text-[#6366f1] text-xs">
                {podcast.category}
              </span>
            </div>
            
            <p className="text-sm text-[#71717a] mb-3 line-clamp-2">
              {podcast.description}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-[#71717a] mb-4">
              <span className="flex items-center gap-1">
                <Headphones className="w-3 h-3" />
                {podcast.episodes} вып.
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {podcast.duration}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {podcast.likes}
              </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[#27273a]">
              <span className="text-sm text-[#a1a1aa]">{podcast.host}</span>
              <button className="p-2 rounded-xl hover:bg-[#1e1e2e] transition-colors">
                <Share2 className="w-4 h-4 text-[#71717a]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPodcasts.length === 0 && (
        <div className="text-center py-12">
          <Headphones className="w-12 h-12 text-[#27273a] mx-auto mb-4" />
          <p className="text-[#71717a]">Подкасты не найдены</p>
        </div>
      )}
    </div>
  );
}
