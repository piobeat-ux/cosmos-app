import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Upload, X, Link } from 'lucide-react'
import toast from 'react-hot-toast'

interface FileUploadProps {
  bucket: 'images' | 'audio'
  folder: string
  value?: string
  onChange: (url: string) => void
  allowedTypes: string[]
  maxSizeMB: number
  label: string
}

export default function FileUpload({ 
  bucket, folder, value, onChange, allowedTypes, maxSizeMB, label 
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [manualUrl, setManualUrl] = useState(value || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileType = file.type
    if (!allowedTypes.includes(fileType)) {
      toast.error(`Недопустимый тип файла: ${fileType}`)
      return
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      toast.error(`Файл слишком большой: ${(file.size / 1024 / 1024).toFixed(2)} MB. Макс: ${maxSizeMB} MB`)
      return
    }

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
      
      onChange(data.publicUrl)
      setManualUrl(data.publicUrl)
      toast.success('Файл загружен!')
    } catch (error: any) {
      toast.error(`Ошибка: ${error.message}`)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleManualUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setManualUrl(url)
    onChange(url)
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      
      {/* Ручной ввод URL */}
      <div className="flex gap-2">
        <input
          type="url"
          value={manualUrl}
          onChange={handleManualUrlChange}
          placeholder="Или вставьте URL файла..."
          className="input-field flex-1"
        />
        <Link className="w-5 h-5 text-gray-400 mt-3" />
      </div>

      {/* Загрузка файла */}
      {value ? (
        <div className="flex items-center gap-4 glass-card p-3">
          {bucket === 'images' ? (
            <img src={value} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
          ) : (
            <div className="w-16 h-16 flex items-center justify-center bg-primary-500/20 rounded-lg">
              <span className="text-xs text-primary-400">AUDIO</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-400 truncate">{value.split('/').pop()}</p>
          </div>
          <button
            type="button"
            onClick={() => { onChange(''); setManualUrl('') }}
            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed border-white/10 rounded-lg p-4 text-center cursor-pointer hover:border-primary-500/50 hover:bg-white/5 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={allowedTypes.join(',')}
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500" />
              <span className="text-sm text-gray-400">Загрузка...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-400">Или нажмите для загрузки</span>
              <span className="text-xs text-gray-500">Макс. {maxSizeMB} MB</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
