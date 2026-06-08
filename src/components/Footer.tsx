import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { SocialLink, Contact } from '@/types'
import { Link } from 'react-router-dom'

export default function Footer() {
  const { data: socialLinks = [] } = useQuery({
    queryKey: ['socialLinks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('is_active', true)
        .order('order_index')
      
      if (error) throw error
      return data as SocialLink[]
    },
  })

  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('order_index')
      
      if (error) throw error
      return data as Contact[]
    },
  })

  const { data: footerText } = useQuery({
    queryKey: ['footerText'],
    queryFn: async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'footer_text')
        .single()
      
      return data?.value || '© 2026 Cosmos Radio. Все права защищены.'
    },
  })

  return (
    <footer className="glass-card border-t border-white/10 mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-400">О нас</h3>
            <p className="text-gray-400 leading-relaxed">
              Cosmos Radio - ваше любимое онлайн радио с лучшей музыкой и интересными шоу. Мы вещаем 24/7 для вашего удовольствия.
            </p>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-400">Контакты</h3>
            <ul className="space-y-2">
              {contacts.map((contact) => (
                <li key={contact.id} className="text-gray-400">
                  <span className="font-medium">{contact.label}:</span> {contact.value}
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-400">Социальные сети</h3>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-gray-300 hover:text-white"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400">{footerText}</p>
          <Link 
            to="/admin/login" 
            className="text-sm text-gray-500 hover:text-primary-400 mt-2 inline-block transition-colors"
          >
            Вход для администраторов
          </Link>
        </div>
      </div>
    </footer>
  )
}