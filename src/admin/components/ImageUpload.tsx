import { useState, useRef } from 'react';
import { X, ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (base64: string) => void;
  label?: string;
  previewSize?: 'sm' | 'md' | 'lg';
}

export function ImageUpload({ value, onChange, label = 'Изображение', previewSize = 'md' }: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-32',
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение (JPG, PNG, GIF)');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер: 2MB');
      return;
    }
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        onChange(reader.result as string);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      alert('Ошибка загрузки изображения');
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      {label && <label className="block text-sm text-[#a1a1aa] mb-2">{label}</label>}
      
      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Preview"
            className={`${sizeClasses[previewSize]} rounded-xl object-cover border border-[#27273a]`}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#ef4444] text-white flex items-center justify-center hover:bg-[#dc2626] transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`${sizeClasses[previewSize]} rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-[#6366f1] bg-[#6366f1]/10'
              : 'border-[#27273a] hover:border-[#6366f1]/50 bg-[#13131f]'
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ImageIcon className="w-6 h-6 text-[#71717a] mb-1" />
              <span className="text-[10px] text-[#71717a]">PNG, JPG до 2MB</span>
            </>
          )}
        </div>
      )}
      
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
