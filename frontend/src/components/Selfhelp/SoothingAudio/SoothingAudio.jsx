import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

const AudioCard = ({ title, description, audioUrl, color }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const gradientClass = {
    purple: 'from-purple-400 via-pink-400 to-indigo-400',
    blue: 'from-blue-400 via-cyan-400 to-teal-400',
    green: 'from-green-400 via-emerald-400 to-teal-400',
    orange: 'from-orange-400 via-amber-400 to-yellow-400'
  }[color];

  const ringClass = {
    purple: 'bg-purple-400',
    blue: 'bg-blue-400',
    green: 'bg-green-400',
    orange: 'bg-orange-400'
  }[color];

  const textClass = {
    purple: 'text-purple-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600'
  }[color];

  const bgClass = {
    purple: 'bg-purple-600',
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    orange: 'bg-orange-600'
  }[color];

  const progressColor = {
    purple: 'rgb(192, 132, 252)',
    blue: 'rgb(96, 165, 250)',
    green: 'rgb(52, 211, 153)',
    orange: 'rgb(251, 146, 60)'
  }[color];

  const progressBgColor = {
    purple: 'rgb(233, 213, 255)',
    blue: 'rgb(219, 234, 254)',
    green: 'rgb(209, 250, 229)',
    orange: 'rgb(254, 215, 170)'
  }[color];

  return (
    <div className="relative">
      {/* Animated rings */}
      <div className={`absolute inset-0 ${isPlaying ? 'animate-ping' : ''} opacity-20`}>
        <div className={`absolute inset-0 rounded-full ${ringClass}`}></div>
      </div>
      
      <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6">
        {/* Gradient orb */}
        <div className="relative mx-auto w-32 h-32 mb-4">
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradientClass} ${isPlaying ? 'animate-pulse' : ''}`}></div>
          <div className="absolute inset-2 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300"
            >
              {isPlaying ? (
                <Pause className={`w-7 h-7 ${textClass}`} />
              ) : (
                <Play className={`w-7 h-7 ${textClass} ml-1`} />
              )}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-light text-center text-gray-800 mb-1">
          {title}
        </h3>
        <p className="text-center text-gray-500 mb-4 text-xs">
          {description}
        </p>

        {/* Progress bar */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${progressColor} 0%, ${progressColor} ${(currentTime / duration) * 100}%, ${progressBgColor} ${(currentTime / duration) * 100}%, ${progressBgColor} 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume control */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
          <Volume2 className="w-4 h-4 text-gray-600 flex-shrink-0" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${progressColor} 0%, ${progressColor} ${volume * 100}%, ${progressBgColor} ${volume * 100}%, ${progressBgColor} 100%)`
            }}
          />
          <span className="text-xs text-gray-600 w-8 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>

        {/* Status indicator */}
        <div className="mt-4 text-center">
          <span className={`inline-flex items-center gap-2 text-xs ${isPlaying ? textClass : 'text-gray-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? bgClass + ' animate-pulse' : 'bg-gray-400'}`}></span>
            {isPlaying ? 'Playing' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioUrl} />
    </div>
  );
};

export default function SoothingAudioCards() {
  const audioTracks = [
    {
      title: "Ocean Waves",
      description: "Gentle waves on shore",
      audioUrl: "/ocean-vibes.mp3",
      color: "blue"
    },
    {
      title: "Forest Rain",
      description: "Peaceful rainfall sounds",
      audioUrl: "YOUR_AUDIO_URL_2",
      color: "green"
    },
    {
      title: "Meditation",
      description: "Calming ambient tones",
      audioUrl: "YOUR_AUDIO_URL_3",
      color: "purple"
    },
    {
      title: "Sunrise",
      description: "Morning bird songs",
      audioUrl: "YOUR_AUDIO_URL_4",
      color: "orange"
    }
  ];

  return (
    <div className="backdrop-blur-md bg-white/70 rounded-3xl shadow-2xl p-8 border border-purple-200/50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-light text-center text-gray-800 mb-3">
          Peaceful Sounds
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Choose your ambient soundscape for relaxation
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {audioTracks.map((track, index) => (
            <AudioCard
              key={index}
              title={track.title}
              description={track.description}
              audioUrl={track.audioUrl}
              color={track.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}