import { useState } from 'react';
import { Clock, User, Play, Calendar, Bell } from 'lucide-react';

const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const fullDays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

const schedule = {
  'Пн': [
    { time: '07:00', title: 'Утренний кофе', host: 'Анна Петрова', category: 'Утреннее шоу', duration: '3ч' },
    { time: '10:00', title: 'Новости отелей', host: 'Дмитрий Иванов', category: 'Новости', duration: '1ч' },
    { time: '12:00', title: 'Обеденный микс', host: 'Мария Козлова', category: 'Музыка', duration: '2ч' },
    { time: '15:00', title: 'Кофе-брейк', host: 'Елена Волкова', category: 'Разговорное', duration: '1ч' },
    { time: '18:00', title: 'Вечерний чилл', host: 'Алексей Смирнов', category: 'Музыка', duration: '3ч' },
  ],
  'Вт': [
    { time: '07:00', title: 'Доброе утро', host: 'Сергей Новиков', category: 'Утреннее шоу', duration: '3ч' },
    { time: '10:00', title: 'Бизнес-завтрак', host: 'Ольга Попова', category: 'Бизнес', duration: '1ч' },
    { time: '12:00', title: 'Хиты дня', host: 'Андрей Морозов', category: 'Музыка', duration: '2ч' },
    { time: '15:00', title: 'Истории гостей', host: 'Наталья Лебедева', category: 'Разговорное', duration: '1ч' },
    { time: '18:00', title: 'Джазовый вечер', host: 'Игорь Волков', category: 'Музыка', duration: '3ч' },
  ],
  'Ср': [
    { time: '07:00', title: 'Утренний кофе', host: 'Анна Петрова', category: 'Утреннее шоу', duration: '3ч' },
    { time: '10:00', title: 'Советы консьержа', host: 'Виктор Соколов', category: 'Обучение', duration: '1ч' },
    { time: '12:00', title: 'Ланч-тайм', host: 'Михаил Соколов', category: 'Музыка', duration: '2ч' },
    { time: '15:00', title: 'Кухня шеф-повара', host: 'Павел Кузнецов', category: 'Кулинария', duration: '1ч' },
    { time: '18:00', title: 'Релакс', host: 'Татьяна Новикова', category: 'Музыка', duration: '3ч' },
  ],
  'Чт': [
    { time: '07:00', title: 'Старт дня', host: 'Кирилл Петров', category: 'Утреннее шоу', duration: '3ч' },
    { time: '10:00', title: 'Тренды hospitality', host: 'Екатерина Смирнова', category: 'Бизнес', duration: '1ч' },
    { time: '12:00', title: 'Поп-чарт', host: 'Артем Васильев', category: 'Музыка', duration: '2ч' },
    { time: '15:00', title: 'Вопрос-ответ', host: 'Юлия Морозова', category: 'Разговорное', duration: '1ч' },
    { time: '18:00', title: 'Вечер хитов', host: 'Максим Козлов', category: 'Музыка', duration: '3ч' },
  ],
  'Пт': [
    { time: '07:00', title: 'Пятничное утро', host: 'Анна Петрова', category: 'Утреннее шоу', duration: '3ч' },
    { time: '10:00', title: 'Неделя в цифрах', host: 'Станислав Иванов', category: 'Новости', duration: '1ч' },
    { time: '12:00', title: 'Party mix', host: 'Денис Новиков', category: 'Музыка', duration: '2ч' },
    { time: '15:00', title: 'Интервью недели', host: 'София Лебедева', category: 'Разговорное', duration: '1ч' },
    { time: '18:00', title: 'Friday night', host: 'DJ Cosmos', category: 'Музыка', duration: '4ч' },
  ],
  'Сб': [
    { time: '09:00', title: 'Субботний бранч', host: 'Вера Попова', category: 'Утреннее шоу', duration: '3ч' },
    { time: '12:00', title: 'Weekend vibes', host: 'Глеб Морозов', category: 'Музыка', duration: '3ч' },
    { time: '15:00', title: 'Подкаст недели', host: 'Редакция', category: 'Подкаст', duration: '1ч' },
    { time: '18:00', title: 'Вечернее шоу', host: 'Алиса Волкова', category: 'Развлечения', duration: '4ч' },
  ],
  'Вс': [
    { time: '09:00', title: 'Воскресный завтрак', host: 'Марина Кузнецова', category: 'Утреннее шоу', duration: '3ч' },
    { time: '12:00', title: 'Chill Sunday', host: 'Роман Соколов', category: 'Музыка', duration: '3ч' },
    { time: '15:00', title: 'Лучшее за неделю', host: 'Редакция', category: 'Обзор', duration: '2ч' },
    { time: '18:00', title: 'Подготовка к неделе', host: 'Анна Петрова', category: 'Музыка', duration: '3ч' },
  ],
};

const categoryColors: Record<string, string> = {
  'Утреннее шоу': 'bg-[#f59e0b]/20 text-[#f59e0b]',
  'Новости': 'bg-[#3b82f6]/20 text-[#3b82f6]',
  'Музыка': 'bg-[#8b5cf6]/20 text-[#8b5cf6]',
  'Разговорное': 'bg-[#22c55e]/20 text-[#22c55e]',
  'Бизнес': 'bg-[#06b6d4]/20 text-[#06b6d4]',
  'Обучение': 'bg-[#ec4899]/20 text-[#ec4899]',
  'Кулинария': 'bg-[#f97316]/20 text-[#f97316]',
  'Подкаст': 'bg-[#6366f1]/20 text-[#6366f1]',
  'Развлечения': 'bg-[#ef4444]/20 text-[#ef4444]',
  'Обзор': 'bg-[#14b8a6]/20 text-[#14b8a6]',
};

export function ScheduleSection() {
  const [activeDay, setActiveDay] = useState('Пн');
  const today = 'Пн'; // В реальном приложении - текущий день

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Расписание</h1>
          <p className="text-[#71717a]">{fullDays[days.indexOf(activeDay)]}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#13131f] border border-[#27273a] hover:border-[#6366f1]/50 transition-colors">
          <Calendar className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">Мое расписание</span>
        </button>
      </div>

      {/* Days Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`flex-shrink-0 px-4 py-3 rounded-xl font-medium transition-all ${
              activeDay === day
                ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white'
                : day === today
                ? 'bg-[#13131f] border border-[#22c55e]/50 text-[#22c55e]'
                : 'bg-[#13131f] border border-[#27273a] text-[#a1a1aa] hover:border-[#6366f1]/30'
            }`}
          >
            {day}
            {day === today && <span className="ml-1 text-xs">(сегодня)</span>}
          </button>
        ))}
      </div>

      {/* Schedule List */}
      <div className="space-y-3">
        {schedule[activeDay as keyof typeof schedule]?.map((show, index) => (
          <div
            key={index}
            className="show-card flex flex-col sm:flex-row sm:items-center gap-4"
          >
            {/* Time */}
            <div className="flex items-center gap-3 sm:w-24 flex-shrink-0">
              <Clock className="w-4 h-4 text-[#6366f1]" />
              <span className="font-medium">{show.time}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium truncate">{show.title}</h3>
                <span className={`category-badge ${categoryColors[show.category] || 'bg-[#6366f1]/10 text-[#6366f1]'}`}>
                  {show.category}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#71717a]">
                <User className="w-3 h-3" />
                <span>{show.host}</span>
                <span>•</span>
                <span>{show.duration}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl hover:bg-[#1e1e2e] transition-colors">
                <Bell className="w-4 h-4 text-[#71717a]" />
              </button>
              <button className="p-2 rounded-xl bg-[#6366f1]/20 hover:bg-[#6366f1]/30 transition-colors">
                <Play className="w-4 h-4 text-[#6366f1]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
