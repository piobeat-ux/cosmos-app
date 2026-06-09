import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { MenuItem } from '../types'

export default function Header() {
  const { data: menuItems } = useQuery({
    queryKey: ['menu'],
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

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-purple-400">
            🎵 Cosmos Radio
          </Link>
          
          <div className="flex gap-6">
            {menuItems?.map((item) => {
              const isExternal = item.url.startsWith('http')
              
              if (isExternal) {
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-purple-400 transition-colors"
                  >
                    {item.title}
                  </a>
                )
              }
              
              return (
                <Link
                  key={item.id}
                  to={item.url}
                  className="text-gray-300 hover:text-purple-400 transition-colors"
                >
                  {item.title}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </header>
  )
}
