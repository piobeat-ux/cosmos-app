import { AlertCircle } from 'lucide-react'

interface ErrorDisplayProps {
  message: string
  onRetry?: () => void
}

export default function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="glass-card p-6 rounded-xl text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <p className="text-gray-300 mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Попробовать снова
        </button>
      )}
    </div>
  )
}