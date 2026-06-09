import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export default function AdminOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [shows, hosts, podcasts, banners] = await Promise.all([
        supabase.from('shows').select('*', { count: 'exact', head: true }),
        supabase.from('hosts').select('*', { count: 'exact', head: true }),
        supabase.from('podcasts').select('*', { count: 'exact', head: true }),
        supabase.from('banners').select('*', { count: 'exact', head: true }),
      ])

      return {
        shows: shows.count || 0,
        hosts: hosts.count || 0,
        podcasts: podcasts.count || 0,
        banners: banners.count || 0,
      }
    },
  })

  const statCards = [
    { label: 'Всего шоу', value: stats?.shows ?? '-', icon: '🎵', color: 'from-purple-500 to-pink-500' },
    { label: 'Ведущих', value: stats?.hosts ?? '-', icon: '🎤', color: 'from-blue-500 to-cyan-500' },
    { label: 'Подкастов', value: stats?.podcasts ?? '-', icon: '🎧', color: 'from-green-500 to-emerald-500' },
    { label: 'Баннеров', value: stats?.banners ?? '-', icon: '🖼️', color: 'from-orange-500 to-red-500' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Обзор</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`bg-gradient-to-br ${card.color} rounded-lg p-6 text-white shadow-lg`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">{card.icon}</span>
              <span className="text-3xl font-bold">
                {isLoading ? '...' : card.value}
              </span>
            </div>
            <p className="text-sm opacity-90">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/admin/shows" className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-colors">
            <h3 className="font-semibold mb-1">🎵 Управление шоу</h3>
            <p className="text-sm text-gray-400">Добавление и редактирование шоу</p>
          </a>
          <a href="/admin/hosts" className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-colors">
            <h3 className="font-semibold mb-1">🎤 Управление ведущими</h3>
            <p className="text-sm text-gray-400">Добавление и редактирование ведущих</p>
          </a>
          <a href="/admin/podcasts" className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-colors">
            <h3 className="font-semibold mb-1">🎧 Управление подкастами</h3>
            <p className="text-sm text-gray-400">Загрузка и управление подкастами</p>
          </a>
          <a href="/admin/banners" className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-colors">
            <h3 className="font-semibold mb-1">🖼️ Управление баннерами</h3>
            <p className="text-sm text-gray-400">Загрузка и управление баннерами</p>
          </a>
        </div>
      </div>
    </div>
  )
}
