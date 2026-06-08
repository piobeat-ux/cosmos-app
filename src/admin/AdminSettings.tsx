import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { SiteSettings } from '@/types'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const queryClient = useQueryClient()

  const { data: settings = [] } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('*')
      if (error) throw error
      return data as SiteSettings[]
    },
  })

  const getSettingValue = (key: string) => settings.find(s => s.key === key)?.value || ''

  const saveMutation = useMutation({
    mutationFn: async (updates: { key: string, value: string }[]) => {
      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ key: update.key, value: update.value, type: 'string' })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] })
      queryClient.invalidateQueries({ queryKey: ['siteName'] })
      queryClient.invalidateQueries({ queryKey: ['footerText'] })
      queryClient.invalidateQueries({ queryKey: ['aboutText'] })
      toast.success('Настройки сохранены')
    },
    onError: (error: any) => toast.error(error.message),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const updates = [
      { key: 'site_name', value: formData.get('site_name') as string },
      { key: 'footer_text', value: formData.get('footer_text') as string },
      { key: 'about_text', value: formData.get('about_text') as string },
    ]
    saveMutation.mutate(updates)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Глобальные настройки</h1>
      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-2">Название сайта</label>
          <input name="site_name" defaultValue={getSettingValue('site_name')} className="input-field" placeholder="Cosmos Radio" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Текст "О нас" (главная)</label>
          <textarea name="about_text" defaultValue={getSettingValue('about_text')} className="textarea-field" rows={4} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Текст в футере</label>
          <input name="footer_text" defaultValue={getSettingValue('footer_text')} className="input-field" placeholder="© 2026 Cosmos Radio" />
        </div>
        <button type="submit" disabled={saveMutation.isPending} className="btn-primary flex items-center gap-2">
          {saveMutation.isPending ? 'Сохранение...' : <><Save size={20} /> Сохранить настройки</>}
        </button>
      </form>
    </div>
  )
}