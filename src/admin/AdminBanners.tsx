import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Banner } from '@/types'
import FileUpload from '@/components/FileUpload'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminBanners() {
  const queryClient = useQueryClient()
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: async () => {
      const { data, error } = await supabase.from('banners').select('*').order('order_index')
      if (error) throw error
      return data as Banner[]
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (banner: Partial<Banner>) => {
      if (banner.id) {
        const { error } = await supabase.from('banners').update(banner).eq('id', banner.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('banners').insert([banner])
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] })
      queryClient.invalidateQueries({ queryKey: ['banners'] })
      toast.success('Баннер сохранён')
      setIsFormOpen(false)
      setEditingBanner(null)
      setImageUrl('')
    },
    onError: (error: any) => toast.error(error.message),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('banners').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] })
      queryClient.invalidateQueries({ queryKey: ['banners'] })
      toast.success('Баннер удалён')
    },
    onError: (error: any) => toast.error(error.message),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Partial<Banner> = {
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      image_url: imageUrl || editingBanner?.image_url || '',
      link_url: formData.get('link_url') as string,
      button_text: formData.get('button_text') as string,
      order_index: parseInt(formData.get('order_index') as string) || 0,
      is_active: formData.get('is_active') === 'on',
    }
    if (editingBanner) data.id = editingBanner.id
    saveMutation.mutate(data)
  }

  const openEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setImageUrl(banner.image_url || '')
    setIsFormOpen(true)
  }

  if (isLoading) return <div className="text-gray-400">Загрузка...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Управление баннерами</h1>
        <button onClick={() => { setEditingBanner(null); setImageUrl(''); setIsFormOpen(true) }} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Добавить баннер
        </button>
      </div>

      {isFormOpen && (
        <div className="glass-card p-6 mb-8 fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{editingBanner ? 'Редактировать баннер' : 'Новый баннер'}</h2>
            <button onClick={() => { setIsFormOpen(false); setEditingBanner(null) }} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Заголовок</label>
                <input name="title" defaultValue={editingBanner?.title} className="input-field" placeholder="Cosmos Radio" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Подзаголовок</label>
                <input name="subtitle" defaultValue={editingBanner?.subtitle} className="input-field" placeholder="Ваша любимая музыка 24/7" />
              </div>
            </div>
            <FileUpload
              bucket="images"
              folder="banners"
              label="Изображение баннера *"
              value={imageUrl}
              onChange={setImageUrl}
              allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
              maxSizeMB={5}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">URL кнопки</label>
                <input name="link_url" defaultValue={editingBanner?.link_url} className="input-field" placeholder="/shows" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Текст кнопки</label>
                <input name="button_text" defaultValue={editingBanner?.button_text} className="input-field" placeholder="Слушать сейчас" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Порядок</label>
              <input name="order_index" type="number" defaultValue={editingBanner?.order_index || 0} className="input-field" />
            </div>
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_active" defaultChecked={editingBanner?.is_active ?? true} className="w-5 h-5 rounded border-white/20 bg-white/5 text-primary-600 focus:ring-primary-500" />
                <span>Активен</span>
              </label>
              <div className="flex-1" />
              <button type="button" onClick={() => { setIsFormOpen(false); setEditingBanner(null) }} className="btn-secondary">Отмена</button>
              <button type="submit" disabled={saveMutation.isPending} className="btn-primary flex items-center gap-2">
                {saveMutation.isPending ? 'Сохранение...' : <><Save size={20} /> Сохранить</>}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {banners.map((banner) => (
          <div key={banner.id} className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {banner.image_url && <img src={banner.image_url} alt={banner.title} className="w-24 h-16 rounded-lg object-cover" />}
              <div>
                <h3 className="font-bold">{banner.title}</h3>
                <p className="text-sm text-gray-400">{banner.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs ${banner.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                {banner.is_active ? 'Активен' : 'Скрыт'}
              </span>
              <button onClick={() => openEdit(banner)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg">
                <Edit2 size={18} />
              </button>
              <button onClick={() => { if(confirm('Удалить?')) deleteMutation.mutate(banner.id) }} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
