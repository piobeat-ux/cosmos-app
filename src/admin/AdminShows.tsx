import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Show } from '@/types'
import FileUpload from '@/components/FileUpload'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminShows() {
  const queryClient = useQueryClient()
  const [editingShow, setEditingShow] = useState<Show | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [audioUrl, setAudioUrl] = useState('')

  const { data: shows = [], isLoading } = useQuery({
    queryKey: ['admin-shows'],
    queryFn: async () => {
      const { data, error } = await supabase.from('shows').select('*').order('order_index')
      if (error) throw error
      return data as Show[]
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (show: Partial<Show>) => {
      if (show.id) {
        const { error } = await supabase.from('shows').update(show).eq('id', show.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('shows').insert([show])
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shows'] })
      queryClient.invalidateQueries({ queryKey: ['shows'] })
      toast.success('Шоу сохранено')
      setIsFormOpen(false)
      setEditingShow(null)
      setImageUrl('')
      setAudioUrl('')
    },
    onError: (error: any) => toast.error(error.message),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('shows').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shows'] })
      queryClient.invalidateQueries({ queryKey: ['shows'] })
      toast.success('Шоу удалено')
    },
    onError: (error: any) => toast.error(error.message),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Partial<Show> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      time: formData.get('time') as string,
      days: formData.get('days') as string,
      host_name: formData.get('host_name') as string,
      category: formData.get('category') as string,
      order_index: parseInt(formData.get('order_index') as string) || 0,
      is_active: formData.get('is_active') === 'on',
      image_url: imageUrl || editingShow?.image_url || '',
      audio_url: audioUrl || editingShow?.audio_url || '',
    }
    if (editingShow) data.id = editingShow.id
    saveMutation.mutate(data)
  }

  const openEdit = (show: Show) => {
    setEditingShow(show)
    setImageUrl(show.image_url || '')
    setAudioUrl(show.audio_url || '')
    setIsFormOpen(true)
  }

  if (isLoading) return <div className="text-gray-400">Загрузка...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Управление шоу</h1>
        <button onClick={() => { setEditingShow(null); setImageUrl(''); setAudioUrl(''); setIsFormOpen(true) }} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Добавить шоу
        </button>
      </div>

      {isFormOpen && (
        <div className="glass-card p-6 mb-8 fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{editingShow ? 'Редактировать шоу' : 'Новое шоу'}</h2>
            <button onClick={() => { setIsFormOpen(false); setEditingShow(null) }} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Название *</label>
                <input name="title" defaultValue={editingShow?.title} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Ведущий</label>
                <input name="host_name" defaultValue={editingShow?.host_name} className="input-field" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Описание</label>
              <textarea name="description" defaultValue={editingShow?.description} className="textarea-field" rows={3} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Дни</label>
                <input name="days" defaultValue={editingShow?.days} placeholder="Пн-Пт" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Время</label>
                <input name="time" defaultValue={editingShow?.time} placeholder="18:00-20:00" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Порядок</label>
                <input name="order_index" type="number" defaultValue={editingShow?.order_index || 0} className="input-field" />
              </div>
            </div>

            <FileUpload
              bucket="images"
              folder="shows"
              label="Обложка шоу"
              value={imageUrl}
              onChange={setImageUrl}
              allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
              maxSizeMB={5}
            />

            <FileUpload
              bucket="audio"
              folder="shows"
              label="Аудио файл"
              value={audioUrl}
              onChange={setAudioUrl}
              allowedTypes={['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']}
              maxSizeMB={100}
            />

            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_active" defaultChecked={editingShow?.is_active ?? true} className="w-5 h-5 rounded border-white/20 bg-white/5 text-primary-600 focus:ring-primary-500" />
                <span>Активно</span>
              </label>
              <div className="flex-1" />
              <button type="button" onClick={() => { setIsFormOpen(false); setEditingShow(null) }} className="btn-secondary">Отмена</button>
              <button type="submit" disabled={saveMutation.isPending} className="btn-primary flex items-center gap-2">
                {saveMutation.isPending ? 'Сохранение...' : <><Save size={20} /> Сохранить</>}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {shows.map((show) => (
          <div key={show.id} className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {show.image_url && <img src={show.image_url} alt={show.title} className="w-16 h-16 rounded-lg object-cover" />}
              <div>
                <h3 className="font-bold">{show.title}</h3>
                <p className="text-sm text-gray-400">{show.days} {show.time} • {show.host_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs ${show.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                {show.is_active ? 'Активно' : 'Скрыто'}
              </span>
              <button onClick={() => openEdit(show)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg">
                <Edit2 size={18} />
              </button>
              <button onClick={() => { if(confirm('Удалить?')) deleteMutation.mutate(show.id) }} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
