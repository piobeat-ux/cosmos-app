import { useState } from 'react';
import { Headphones, Heart, Clock } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { DataTable } from '@/admin/components/DataTable';
import { ModalForm } from '@/admin/components/ModalForm';
import type { Podcast } from '@/types/database';

const CATEGORIES = ['Истории', 'Обучение', 'Развлечения', 'Новости', 'Музыка', 'Кулинария'];
const GRADIENT_OPTIONS = [
  'from-[#f59e0b] to-[#f97316]',
  'from-[#8b5cf6] to-[#6366f1]',
  'from-[#22c55e] to-[#14b8a6]',
  'from-[#3b82f6] to-[#06b6d4]',
  'from-[#ef4444] to-[#f97316]',
  'from-[#ec4899] to-[#8b5cf6]',
  'from-[#6366f1] to-[#8b5cf6]',
];

export function PodcastsPage() {
  const { podcasts, hosts, addPodcast, editPodcast, removePodcast } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState<Podcast | undefined>();

  const hostNames = hosts.map(h => h.name);

  const handleAdd = () => {
    setEditingPodcast(undefined);
    setModalOpen(true);
  };

  const handleEdit = (podcast: Podcast) => {
    setEditingPodcast(podcast);
    setModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    data.episodes = Number(data.episodes) || 0;
    data.likes = Number(data.likes) || 0;
    
    if (editingPodcast) {
      await editPodcast(editingPodcast.id, data);
    } else {
      await addPodcast(data);
    }
    setModalOpen(false);
  };

  const formFields = [
    { name: 'title', label: 'Название', type: 'text' as const, required: true, placeholder: 'Например: Истории отелей' },
    { name: 'description', label: 'Описание', type: 'textarea' as const, placeholder: 'Краткое описание подкаста' },
    { name: 'host', label: 'Ведущий', type: 'select' as const, required: true, options: hostNames.length > 0 ? hostNames : ['Наталья Лебедева', 'Виктор Соколов'] },
    { name: 'episodes', label: 'Кол-во выпусков', type: 'number' as const, required: true, placeholder: '24' },
    { name: 'duration', label: 'Длительность', type: 'text' as const, required: true, placeholder: '45 мин' },
    { name: 'category', label: 'Категория', type: 'select' as const, required: true, options: CATEGORIES },
    { name: 'likes', label: 'Лайки', type: 'number' as const, placeholder: '0' },
    { name: 'color', label: 'Цвет обложки', type: 'select' as const, options: GRADIENT_OPTIONS },
    { name: 'cover_image', label: 'URL обложки (или Base64)', type: 'text' as const, placeholder: 'https://... или оставьте пустым' },
    { name: 'audio_url', label: 'URL аудиофайла', type: 'text' as const, placeholder: 'https://...' },
  ];

  const columns = [
    { key: 'title', header: 'Название', render: (p: Podcast) => (
      <div className="flex items-center gap-3">
        {p.cover_image ? (
          <img src={p.cover_image} alt="" className="w-8 h-8 rounded-lg object-cover" />
        ) : (
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center`}>
            <Headphones className="w-4 h-4 text-white" />
          </div>
        )}
        <span className="font-medium">{p.title}</span>
      </div>
    )},
    { key: 'host', header: 'Ведущий' },
    { key: 'episodes', header: 'Выпуски', render: (p: Podcast) => (
      <span className="text-sm text-[#71717a]">{p.episodes}</span>
    )},
    { key: 'duration', header: 'Длительность', render: (p: Podcast) => (
      <div className="flex items-center gap-1 text-sm text-[#71717a]">
        <Clock className="w-3 h-3" /> {p.duration}
      </div>
    )},
    { key: 'likes', header: 'Лайки', render: (p: Podcast) => (
      <div className="flex items-center gap-1 text-sm text-[#ef4444]">
        <Heart className="w-3 h-3" /> {p.likes}
      </div>
    )},
    { key: 'category', header: 'Категория', render: (p: Podcast) => (
      <span className="inline-flex px-2 py-1 rounded-full text-xs bg-[#6366f1]/10 text-[#6366f1]">
        {p.category}
      </span>
    )},
  ];

  return (
    <div>
      <DataTable
        title="Подкасты"
        items={podcasts}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={removePodcast}
        searchFields={['title', 'host', 'category']}
      />
      <ModalForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingPodcast ? 'Редактировать подкаст' : 'Новый подкаст'}
        fields={formFields}
        initialData={editingPodcast}
      />
    </div>
  );
}
