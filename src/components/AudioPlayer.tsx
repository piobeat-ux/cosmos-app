import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { formatTime } from '@/lib/utils'

interface AudioPlayerProps {
  src: string
  title?: string
  subtitle?: string
  autoPlay?: boolean
}

export default function AudioPlayer({ src, title, subtitle, autoPlay = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)

    if (autoPlay) {
      audio.play().catch(console.error)
      setIsPlaying(true)
    }

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [autoPlay, src])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (isPlaying) {
        audio.pause()
      } else {
        await audio.play()
      }
      setIsPlaying(!isPlaying)
    } catch (error) {
      console.error('Playback error:', error)
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = parseFloat(e.target.value)
    audio.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  return (
    <div className="glass-card p-6 rounded-xl">
      <audio ref={audioRef} src={src} preload="metadata" />
      
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h4 className="text-xl font-bold">{title}</h4>}
          {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-14 h-14 flex items-center justify-center bg-primary-600 hover:bg-primary-700 rounded-full transition-all shadow-lg hover:shadow-xl flex-shrink-0"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>

        {/* Progress Bar */}
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full"
            aria-label="Seek"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="hidden sm:flex items-center gap-2">
          <button 
            onClick={toggleMute} 
            className="text-gray-400 hover:text-white transition-colors"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24"
            aria-label="Volume"
          />
        </div>
      </div>

      {/* Audio Wave Animation */}
      {isPlaying && (
        <div className="flex items-end justify-center gap-1 mt-6 h-8">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="audio-wave-bar w-1 bg-primary-500 rounded-full"
              style={{ height: '100%' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}