import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { MenuItem } from '@/types'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminMenu() {
  const queryClient = useQueryClient()
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ['admin-menu'],
    queryFn: async () => {
      const { data, error } = await supabase.from('menu_items').select('*').order('order_index')
      if (error) throw error
      return data as MenuItem[]
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (item: Partial<MenuItem>) => {
      if (item.id) {
        const { error } = await supabase.from('menu_items').update(item).eq('id', item.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('menu_items').insert([item])
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu'] })
      queryClient.invalidateQueries({ queryKey: ['menuItems'] })
      toast.success('Пункт меню сохранён')
      setIsFormOpen(false)
      setEditingItem(null)
    },
    onError: (error: any) => toast.error(error.message),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('menu_items').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu'] })
      queryClient.invalidateQueries({ queryKey: ['menuItems'] })
      toast.success('Пункт меню удалён')
    },
    onError: (error: any) => toast.error(error.message),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Partial<MenuItem> = {
      title: formData.get('title') as string,
      url: formData.get('url') as string,
      order_index: parseInt(formData.get('order_index') as string) || 0,
      is_active: formData.get('is_active') === 'on',
    }
    if (editingItem) data.id = editingItem.id
    saveMutation.mutate(data)
  }

  if (isLoading) return <div className="text-gray-400">Загрузка...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Управление меню</h1>
        <button onClick={() => { setEditingItem(null); setIsFormOpen(true) }} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Добавить пункт
        </button>
      </div>

      {isFormOpen && (
        <div className="glass-card p-6 mb-8 fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{editingItem ? 'Редактировать пункт' : 'Новый пункт меню'}</h2>
            <button onClick={() => { setIsFormOpen(false); setEditingItem(null) }} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Название *</label>
                <input name="title" defaultValue={editingItem?.title} className="input-field" placeholder="Главная" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">URL *</label>
                <input name="url" defaultValue={editingItem?.url} className="input-field" placeholder="/" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Порядок</label>
              <input name="order_index" type="number" defaultValue={editingItem?.order_index || 0} className="input-field" />
            </div>
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_active" defaultChecked={editingItem?.is_active ?? true} className="w-5 h-5 rounded border-white/20 bg-white/5 text-primary-600 focus:ring-primary-500" />
                <span>Активен</span>
              </label>
              <div className="flex-1" />
              <button type="button" onClick={() => { setIsFormOpen(false); setEditingItem(null) }} className="btn-secondary">Отмена</button>
              <button type="submit" disabled={saveMutation.isPending} className="btn-primary flex items-center gap-2">
                {saveMutation.isPending ? 'Сохранение...' : <><Save size={20} /> Сохранить</>}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {menuItems.map((item) => (
          <div key={item.id} className="glass-card p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.url}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs ${item.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                {item.is_active ? 'Активен' : 'Скрыт'}
              </span>
              <button onClick={() => { setEditingItem(item); setIsFormOpen(true) }} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg">
                <Edit2 size={18} />
              </button>
              <button onClick={() => { if(confirm('Удалить?')) deleteMutation.mutate(item.id) }} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
