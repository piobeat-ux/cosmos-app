import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Contact } from '@/types'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminContacts() {
  const queryClient = useQueryClient()
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('contacts').select('*').order('order_index')
      if (error) throw error
      return data as Contact[]
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (contact: Partial<Contact>) => {
      if (contact.id) {
        const { error } = await supabase.from('contacts').update(contact).eq('id', contact.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('contacts').insert([contact])
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] })
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      toast.success('Контакт сохранён')
      setIsFormOpen(false)
      setEditingContact(null)
    },
    onError: (error: any) => toast.error(error.message),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('contacts').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] })
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      toast.success('Контакт удалён')
    },
    onError: (error: any) => toast.error(error.message),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Partial<Contact> = {
      type: formData.get('type') as string,
      value: formData.get('value') as string,
      label: formData.get('label') as string,
      order_index: parseInt(formData.get('order_index') as string) || 0,
    }
    if (editingContact) data.id = editingContact.id
    saveMutation.mutate(data)
  }

  if (isLoading) return <div className="text-gray-400">Загрузка...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Управление контактами</h1>
        <button onClick={() => { setEditingContact(null); setIsFormOpen(true) }} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Добавить контакт
        </button>
      </div>

      {isFormOpen && (
        <div className="glass-card p-6 mb-8 fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{editingContact ? 'Редактировать контакт' : 'Новый контакт'}</h2>
            <button onClick={() => { setIsFormOpen(false); setEditingContact(null) }} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Тип *</label>
                <select name="type" defaultValue={editingContact?.type} className="input-field" required>
                  <option value="email">Email</option>
                  <option value="phone">Телефон</option>
                  <option value="address">Адрес</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Метка</label>
                <input name="label" defaultValue={editingContact?.label} className="input-field" placeholder="Рабочий" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Значение *</label>
              <input name="value" defaultValue={editingContact?.value} className="input-field" placeholder="info@cosmos.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Порядок</label>
              <input name="order_index" type="number" defaultValue={editingContact?.order_index || 0} className="input-field" />
            </div>
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <div className="flex-1" />
              <button type="button" onClick={() => { setIsFormOpen(false); setEditingContact(null) }} className="btn-secondary">Отмена</button>
              <button type="submit" disabled={saveMutation.isPending} className="btn-primary flex items-center gap-2">
                {saveMutation.isPending ? 'Сохранение...' : <><Save size={20} /> Сохранить</>}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {contacts.map((contact) => (
          <div key={contact.id} className="glass-card p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold">{contact.label || contact.type}</h3>
              <p className="text-sm text-gray-400">{contact.value}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setEditingContact(contact); setIsFormOpen(true) }} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg">
                <Edit2 size={18} />
              </button>
              <button onClick={() => { if(confirm('Удалить?')) deleteMutation.mutate(contact.id) }} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
