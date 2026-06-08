import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Host } from '@/types'
import FileUpload from '@/components/FileUpload'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminHosts() {
  const queryClient = useQueryClient()
  const [editingHost, setEditingHost] = useState<Host | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [photoUrl, setPhotoUrl] = useState('')

  const { data: hosts = [], isLoading } = useQuery({
    queryKey: ['admin-hosts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('hosts').select('*').order('order_index')
      if (error) throw error
      return data as Host[]
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (host: Partial<Host>) => {
      if (host.id) {
        const { error } = await supabase.from('hosts').update(host).eq('id', host.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('hosts').insert([host])
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hosts'] })
      queryClient.invalidateQueries({ queryKey: ['hosts'] })
      toast.success('Ведущий сохранён')
      setIsFormOpen(false)
      setEditingHost(null)
      setPhotoUrl('')
    },
    onError: (error: any) => toast.error(error.message),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('hosts').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hosts'] })
      queryClient.invalidateQueries({ queryKey: ['hosts'] })
      toast.success('Ведущий удалён')
    },
    onError: (error: any) => toast.error(error.message),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Partial<Host> = {
      name: formData.get('name') as string,
      bio: formData.get('bio') as string,
      photo_url: photoUrl || editingHost?.photo_url || '',
      order_index: parseInt(formData.get('order_index') as string) || 0,
    }
    if (editingHost) data.id = editingHost.id
    saveMutation.mutate(data)
  }

  const openEdit = (host: Host) => {
    setEditingHost(host)
    setPhotoUrl(host.photo_url || '')
    setIsFormOpen(true)
  }

  if (isLoading) return <div className="text-gray-400">Загрузка...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Управление ведущими</h1>
        <button onClick={() => { setEditingHost(null); setPhotoUrl(''); setIsFormOpen(true) }} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Добавить ведущего
        </button>
      </div>

      {isFormOpen && (
        <div className="glass-card p-6 mb-8 fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{editingHost ? 'Редактировать ведущего' : 'Новый ведущий'}</h2>
            <button onClick={() => { setIsFormOpen(false); setEditingHost(null) }} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Имя *</label>
              <input name="name" defaultValue={editingHost?.name} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Биография</label>
              <textarea name="bio" defaultValue={editingHost?.bio} className="textarea-field" rows={3} />
            </div>
            <FileUpload
              bucket="images"
              folder="hosts"
              label="Фото ведущего"
              value={photoUrl}
              onChange={setPhotoUrl}
              allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
              maxSizeMB={5}
            />
            <div>
              <label className="block text-sm font-medium mb-2">Порядок</label>
              <input name="order_index" type="number" defaultValue={editingHost?.order_index || 0} className="input-field" />
            </div>
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <div className="flex-1" />
              <button type="button" onClick={() => { setIsFormOpen(false); setEditingHost(null) }} className="btn-secondary">Отмена</button>
              <button type="submit" disabled={saveMutation.isPending} className="btn-primary flex items-center gap-2">
                {saveMutation.isPending ? 'Сохранение...' : <><Save size={20} /> Сохранить</>}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {hosts.map((host) => (
          <div key={host.id} className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {host.photo_url && <img src={host.photo_url} alt={host.name} className="w-16 h-16 rounded-full object-cover" />}
              <div>
                <h3 className="font-bold">{host.name}</h3>
                {host.bio && <p className="text-sm text-gray-400 line-clamp-1">{host.bio}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(host)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg">
                <Edit2 size={18} />
              </button>
              <button onClick={() => { if(confirm('Удалить?')) deleteMutation.mutate(host.id) }} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
