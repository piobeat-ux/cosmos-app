import { useState } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { 
  LayoutDashboard, 
  Image, 
  Radio, 
  Users, 
  Headphones, 
  Menu as MenuIcon, 
  Share2, 
  Phone, 
  Settings, 
  LogOut,
  X
} from 'lucide-react'
import AdminShows from './AdminShows'
import AdminHosts from './AdminHosts'
import AdminPodcasts from './AdminPodcasts'
import AdminBanners from './AdminBanners'
import AdminMenu from './AdminMenu'
import AdminSocial from './AdminSocial'
import AdminContacts from './AdminContacts'
import AdminSettings from './AdminSettings'

export default function AdminDashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Обзор' },
    { path: '/admin/banners', icon: Image, label: 'Баннеры' },
    { path: '/admin/shows', icon: Radio, label: 'Шоу' },
    { path: '/admin/hosts', icon: Users, label: 'Ведущие' },
    { path: '/admin/podcasts', icon: Headphones, label: 'Подкасты' },
    { path: '/admin/menu', icon: MenuIcon, label: 'Меню' },
    { path: '/admin/social', icon: Share2, label: 'Соцсети' },
    { path: '/admin/contacts', icon: Phone, label: 'Контакты' },
    { path: '/admin/settings', icon: Settings, label: 'Настройки' },
  ]

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 glass-card border-r border-white/10 transform transition-transform duration-200 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold gradient-text">Admin Panel</h2>
            <p className="text-gray-400 text-sm mt-1">Cosmos Radio</p>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors mb-2"
            >
              <LayoutDashboard size={20} />
              <span>На сайт</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors w-full"
            >
              <LogOut size={20} />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar toggle */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-0">
        <header className="glass-card border-b border-white/10 p-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white"
          >
            <MenuIcon size={24} />
          </button>
        </header>

        <div className="p-6 lg:p-8">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="shows" element={<AdminShows />} />
            <Route path="hosts" element={<AdminHosts />} />
            <Route path="podcasts" element={<AdminPodcasts />} />
            <Route path="menu" element={<AdminMenu />} />
            <Route path="social" element={<AdminSocial />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

function AdminOverview() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Обзор</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-gray-400 text-sm mb-2">Всего шоу</h3>
          <p className="text-3xl font-bold text-primary-400">-</p>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-gray-400 text-sm mb-2">Ведущих</h3>
          <p className="text-3xl font-bold text-primary-400">-</p>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-gray-400 text-sm mb-2">Подкастов</h3>
          <p className="text-3xl font-bold text-primary-400">-</p>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-gray-400 text-sm mb-2">Баннеров</h3>
          <p className="text-3xl font-bold text-primary-400">-</p>
        </div>
      </div>
      <div className="mt-8 glass-card p-6">
        <h2 className="text-xl font-bold mb-4">Добро пожаловать в админ-панель!</h2>
        <p className="text-gray-400">
          Здесь вы можете управлять всем контентом вашего сайта. Используйте меню слева для навигации.
        </p>
      </div>
    </div>
  )
}