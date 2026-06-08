import { Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { MenuItem } from '@/types'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { data: menuItems = [] } = useQuery({
    queryKey: ['menuItems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_active', true)
        .order('order_index')
      if (error) throw error
      return data as MenuItem[]
    },
  })

  const { data: siteName } = useQuery({
    queryKey: ['siteName'],
    queryFn: async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'site_name')
        .single()
      return data?.value || 'Cosmos Radio'
    },
  })

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white hover:text-primary-400">
            {siteName}
          </Link>
          <ul className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.url}
                  className={`transition-colors ${
                    location.pathname === item.url
                      ? 'text-primary-400 font-semibold'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 fade-in">
            <ul className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.url}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block ${
                      location.pathname === item.url
                        ? 'text-primary-400 font-semibold'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}
