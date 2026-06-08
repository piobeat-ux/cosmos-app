export default function LoadingSpinner({ text = 'Загрузка...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-gray-400">{text}</p>
      </div>
    </div>
  )
}