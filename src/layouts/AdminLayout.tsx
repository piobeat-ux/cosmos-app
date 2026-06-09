import { Outlet, Link, useLocation } from 'react-router-dom'

export default function AdminLayout() {
  const location = useLocation()
  
  const menuItems = [
    { path: '/admin', label: '📊 Обзор', icon: '📊' },
    { path: '/admin/shows', label: '🎵 Шоу', icon: '🎵' },
    { path: '/admin/hosts', label: '🎤 Ведущие', icon: '🎤' },
    { path: '/admin/podcasts', label: '🎧 Подкасты', icon: '🎧' },
    { path: '/admin/banners', label: '🖼️ Баннеры', icon: '🖼️' },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <aside className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen p-6">
        <div className="mb-8">
          <Link to="/" className="text-xl font-bold text-purple-400">
            ← На сайт
          </Link>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
