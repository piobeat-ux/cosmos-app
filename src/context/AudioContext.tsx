import React, { createContext, useContext, useState, useCallback } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  duration: string;
  isLive?: boolean;
}

interface AudioContextType {
  isPlaying: boolean;
  currentTrack: Track | null;
  volume: number;
  isExpanded: boolean;
  togglePlay: () => void;
  setTrack: (track: Track) => void;
  setVolume: (volume: number) => void;
  toggleExpanded: () => void;
}

const defaultTrack: Track = {
  id: '1',
  title: 'Утренний кофе',
  artist: 'Cosmos FM • Прямой эфир',
  cover: '/radio-cover.jpg',
  duration: 'Live',
  isLive: true,
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track>(defaultTrack);
  const [volume, setVolume] = useState(80);
  const [isExpanded, setIsExpanded] = useState(false);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const setTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        currentTrack,
        volume,
        isExpanded,
        togglePlay,
        setTrack,
        setVolume,
        toggleExpanded,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
}
