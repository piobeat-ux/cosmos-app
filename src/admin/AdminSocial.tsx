import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { SocialLink } from '@/types'
import { Plus, Trash2, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminSocial() {
  const queryClient = useQueryClient()

  const { data: items = [] } = useQuery({
    queryKey: ['admin-social'],
    queryFn: async () => {
      const { data, error } = await supabase.from('social_links').select('*').order('order_index')
      if (error) throw error
      return data as SocialLink[]
    },
  })

  const addMutation = useMutation({
    mutationFn: async (item: Partial<SocialLink>) => {
      const { error } = await supabase.from('social_links').insert([item])
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-social'] })
      queryClient.invalidateQueries({ queryKey: ['socialLinks'] })
      toast.success('Добавлено')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('social_links').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-social'] })
      queryClient.invalidateQueries({ queryKey: ['socialLinks'] })
      toast.success('Удалено')
    },
  })

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    addMutation.mutate({
      platform: formData.get('platform') as string,
      url: formData.get('url') as string,
      order_index: parseInt(formData.get('order_index') as string) || 0,
      is_active: true
    })
    e.currentTarget.reset()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Социальные сети</h1>
      
      <form onSubmit={handleAdd} className="glass-card p-6 mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="platform" placeholder="Платформа (напр. Telegram)" className="input-field" required />
          <input name="url" placeholder="URL ссылки" className="input-field" required />
          <input name="order_index" type="number" placeholder="Порядок" className="input-field" />
        </div>
        <button type="submit" className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Добавить
        </button>
      </form>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="glass-card p-4 flex items-center justify-between">
            <div>
              <span className="font-bold">{item.platform}</span>
              <p className="text-sm text-gray-400 truncate max-w-md">{item.url}</p>
            </div>
            <button onClick={() => deleteMutation.mutate(item.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}