import { Mic2, Calendar, Instagram, Mail, ChevronRight } from 'lucide-react';

const hosts = [
  {
    name: 'Анна Петрова',
    role: 'Ведущая утреннего шоу',
    hotel: 'Cosmos Moscow',
    shows: ['Утренний кофе', 'Пятничное утро'],
    schedule: 'Пн, Ср, Пт 07:00',
    bio: '5 лет в индустрии гостеприимства. Любит кофе и добрые утренние разговоры.',
    color: 'from-[#f59e0b] to-[#f97316]',
  },
  {
    name: 'Михаил Соколов',
    role: 'Музыкальный редактор',
    hotel: 'Cosmos St. Petersburg',
    shows: ['Обеденный микс', 'Ланч-тайм'],
    schedule: 'Пн-Пт 12:00',
    bio: 'DJ с 10-летним стажем. Подбирает идеальный саундтрек для вашего дня.',
    color: 'from-[#8b5cf6] to-[#6366f1]',
  },
  {
    name: 'Елена Волкова',
    role: 'Ведущая разговорных шоу',
    hotel: 'Cosmos Sochi',
    shows: ['Кофе-брейк', 'Истории гостей'],
    schedule: 'Пн, Вт 15:00',
    bio: 'Журналист и сторителлер. Умеет найти интересную историю в каждом госте.',
    color: 'from-[#22c55e] to-[#14b8a6]',
  },
  {
    name: 'Дмитрий Иванов',
    role: 'Ведущий новостей',
    hotel: 'Cosmos Moscow',
    shows: ['Новости отелей', 'Неделя в цифрах'],
    schedule: 'Пн, Пт 10:00',
    bio: 'Эксперт в сфере hospitality. Рассказывает о трендах индустрии.',
    color: 'from-[#3b82f6] to-[#06b6d4]',
  },
  {
    name: 'Павел Кузнецов',
    role: 'Шеф-повар',
    hotel: 'Cosmos Collection',
    shows: ['Кухня шеф-повара'],
    schedule: 'Ср 15:00',
    bio: 'Звездный шеф с Мишленовским опытом. Делится секретами кулинарии.',
    color: 'from-[#ef4444] to-[#f97316]',
  },
  {
    name: 'DJ Cosmos',
    role: 'Резидент',
    hotel: 'Все отели',
    shows: ['Friday night', 'Weekend vibes'],
    schedule: 'Пт-Вс вечер',
    bio: 'Главный по вечеринкам. Создает атмосферу праздника каждый день.',
    color: 'from-[#ec4899] to-[#8b5cf6]',
  },
];

export function HostsSection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Наши ведущие</h1>
        <p className="text-[#71717a]">Профессионалы индустрии гостеприимства</p>
      </div>

      {/* Hosts Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {hosts.map((host, index) => (
          <div
            key={index}
            className="show-card group"
          >
            {/* Avatar & Basic Info */}
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${host.color} flex items-center justify-center flex-shrink-0`}>
                <span className="text-xl font-bold text-white">
                  {host.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg">{host.name}</h3>
                <p className="text-sm text-[#6366f1]">{host.role}</p>
                <p className="text-xs text-[#71717a]">{host.hotel}</p>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-[#a1a1aa] mb-4 line-clamp-2">
              {host.bio}
            </p>

            {/* Shows */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-xs text-[#71717a] mb-2">
                <Mic2 className="w-3 h-3" />
                <span>Передачи:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {host.shows.map((show, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded-lg bg-[#1e1e2e] text-xs"
                  >
                    {show}
                  </span>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div className="flex items-center gap-2 text-xs text-[#71717a] mb-4">
              <Calendar className="w-3 h-3" />
              <span>{host.schedule}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#27273a]">
              <div className="flex gap-2">
                <button className="p-2 rounded-xl hover:bg-[#1e1e2e] transition-colors">
                  <Instagram className="w-4 h-4 text-[#71717a]" />
                </button>
                <button className="p-2 rounded-xl hover:bg-[#1e1e2e] transition-colors">
                  <Mail className="w-4 h-4 text-[#71717a]" />
                </button>
              </div>
              <button className="flex items-center gap-1 text-sm text-[#6366f1] hover:underline">
                Профиль <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
