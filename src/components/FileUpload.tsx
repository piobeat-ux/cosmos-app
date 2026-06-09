import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface FileUploadProps {
  bucket: 'images' | 'audio'
  onUpload: (url: string) => void
  accept?: string
  maxSize?: number // в байтах
}

export default function FileUpload({ bucket, onUpload, accept, maxSize }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setUploading(true)
    setProgress(0)

    try {
      // Проверка размера файла
      if (maxSize && file.size > maxSize) {
        throw new Error(`Файл слишком большой. Максимум: ${(maxSize / 1024 / 1024).toFixed(1)} MB`)
      }

      // Проверка существования бакета
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      if (bucketsError) throw bucketsError
      
      const bucketExists = buckets?.some(b => b.name === bucket)
      if (!bucketExists) {
        throw new Error(`Бакет "${bucket}" не существует. Создайте его в Supabase Dashboard.`)
      }

      // Генерируем уникальное имя файла
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      // Загрузка файла
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Получаем публичный URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)

      setProgress(100)
      onUpload(publicUrl)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Ошибка загрузки файла')
    } finally {
      setUploading(false)
    }
  }

  const defaultAccept = bucket === 'images' 
    ? 'image/jpeg,image/png,image/webp,image/gif'
    : 'audio/mpeg,audio/mp3,audio/wav,audio/ogg'

  const defaultMaxSize = bucket === 'images' ? 5 * 1024 * 1024 : 200 * 1024 * 1024

  return (
    <div className="space-y-2">
      <label className="block">
        <span className="sr-only">Выберите файл</span>
        <input
          type="file"
          accept={accept || defaultAccept}
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-purple-600 file:text-white
            hover:file:bg-purple-700
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </label>

      {uploading && (
        <div className="space-y-1">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Загрузка...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded">
          ❌ {error}
        </div>
      )}

      <p className="text-xs text-gray-500">
        Максимальный размер: {((maxSize || defaultMaxSize) / 1024 / 1024).toFixed(0)} MB
      </p>
    </div>
  )
}
