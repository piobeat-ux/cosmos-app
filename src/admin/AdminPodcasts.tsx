import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Podcast } from '@/types'
import FileUpload from '@/components/FileUpload'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminPodcasts() {
  const queryClient = useQueryClient()
  const [editingPodcast, setEditingPodcast] = useState<Podcast | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [audioUrl, setAudioUrl] = useState('')
  const [coverUrl, setCoverUrl] = useState('')

  const { data: podcasts = [], isLoading } = useQuery({
    queryKey: ['admin-podcasts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('podcasts').select('*').order('published_at', { ascending: false })
      if (error) throw error
      return data as Podcast[]
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (podcast: Partial<Podcast>) => {
      if (podcast.id) {
        const { error } = await supabase.from('podcasts').update(podcast).eq('id', podcast.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('podcasts').insert([podcast])
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-podcasts'] })
      queryClient.invalidateQueries({ queryKey: ['podcasts'] })
      toast.success('Подкаст сохранён')
      setIsFormOpen(false)
      setEditingPodcast(null)
      setAudioUrl('')
      setCoverUrl('')
    },
    onError: (error: any) => toast.error(error.message),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('podcasts').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-podcasts'] })
      queryClient.invalidateQueries({ queryKey: ['podcasts'] })
      toast.success('Подкаст удалён')
    },
    onError: (error: any) => toast.error(error.message),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Partial<Podcast> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      audio_url: audioUrl || editingPodcast?.audio_url || '',
      cover_url: coverUrl || editingPodcast?.cover_url || '',
      show_title: formData.get('show_title') as string,
      is_published: formData.get('is_published') === 'on',
    }
    if (editingPodcast) data.id = editingPodcast.id
    saveMutation.mutate(data)
  }

  const openEdit = (podcast: Podcast) => {
    setEditingPodcast(podcast)
    setAudioUrl(podcast.audio_url || '')
    setCoverUrl(podcast.cover_url || '')
    setIsFormOpen(true)
  }

  if (isLoading) return <div className="text-gray-400">Загрузка...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Управление подкастами</h1>
        <button onClick={() => { setEditingPodcast(null); setAudioUrl(''); setCoverUrl(''); setIsFormOpen(true) }} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Добавить подкаст
        </button>
      </div>

      {isFormOpen && (
        <div className="glass-card p-6 mb-8 fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{editingPodcast ? 'Редактировать подкаст' : 'Новый подкаст'}</h2>
            <button onClick={() => { setIsFormOpen(false); setEditingPodcast(null) }} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Название *</label>
              <input name="title" defaultValue={editingPodcast?.title} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Описание</label>
              <textarea name="description" defaultValue={editingPodcast?.description} className="textarea-field" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Название шоу</label>
              <input name="show_title" defaultValue={editingPodcast?.show_title} className="input-field" />
            </div>
            <FileUpload
              bucket="audio"
              folder="podcasts"
              label="Аудио файл *"
              value={audioUrl}
              onChange={setAudioUrl}
              allowedTypes={['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']}
              maxSizeMB={100}
            />
            <FileUpload
              bucket="images"
              folder="podcasts"
              label="Обложка"
              value={coverUrl}
              onChange={setCoverUrl}
              allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
              maxSizeMB={5}
            />
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_published" defaultChecked={editingPodcast?.is_published ?? true} className="w-5 h-5 rounded border-white/20 bg-white/5 text-primary-600 focus:ring-primary-500" />
                <span>Опубликовать</span>
              </label>
              <div className="flex-1" />
              <button type="button" onClick={() => { setIsFormOpen(false); setEditingPodcast(null) }} className="btn-secondary">Отмена</button>
              <button type="submit" disabled={saveMutation.isPending} className="btn-primary flex items-center gap-2">
                {saveMutation.isPending ? 'Сохранение...' : <><Save size={20} /> Сохранить</>}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {podcasts.map((podcast) => (
          <div key={podcast.id} className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {podcast.cover_url && <img src={podcast.cover_url} alt={podcast.title} className="w-16 h-16 rounded-lg object-cover" />}
              <div>
                <h3 className="font-bold">{podcast.title}</h3>
                <p className="text-sm text-gray-400">{podcast.show_title} • {new Date(podcast.published_at).toLocaleDateString('ru-RU')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs ${podcast.is_published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                {podcast.is_published ? 'Опубликован' : 'Черновик'}
              </span>
              <button onClick={() => openEdit(podcast)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg">
                <Edit2 size={18} />
              </button>
              <button onClick={() => { if(confirm('Удалить?')) deleteMutation.mutate(podcast.id) }} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
