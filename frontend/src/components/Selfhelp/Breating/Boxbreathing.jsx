import React, { useState, useEffect } from 'react';
import { Wind, Play, Pause, RotateCcw } from 'lucide-react';

const BoxBreathingAnimation = () => {
  const [phase, setPhase] = useState(0); // 0: Inhale, 1: Hold, 2: Exhale, 3: Hold
  const [isActive, setIsActive] = useState(false);
  const [count, setCount] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);
  const [totalCycles] = useState(5);

  const phases = [
    { name: 'Breathe In', duration: 4000, color: 'from-blue-400 to-blue-600' },
    { name: 'Hold', duration: 4000, color: 'from-purple-400 to-purple-600' },
    { name: 'Breathe Out', duration: 4000, color: 'from-pink-400 to-pink-600' },
    { name: 'Hold', duration: 4000, color: 'from-indigo-400 to-indigo-600' }
  ];

  useEffect(() => {
    let timer;
    let countdownTimer;

    if (isActive) {
      // Countdown timer
      countdownTimer = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount <= 1) {
            return 4;
          }
          return prevCount - 1;
        });
      }, 1000);

      // Phase timer
      timer = setTimeout(() => {
        setPhase((prevPhase) => {
          const nextPhase = (prevPhase + 1) % 4;
          if (nextPhase === 0) {
            setCycleCount((prev) => {
              const newCount = prev + 1;
              if (newCount >= totalCycles) {
                setIsActive(false);
                return 0;
              }
              return newCount;
            });
          }
          return nextPhase;
        });
        setCount(4);
      }, phases[phase].duration);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(countdownTimer);
    };
  }, [isActive, phase]);

  const handleStart = () => {
    setIsActive(true);
    setCycleCount(0);
    setPhase(0);
    setCount(4);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase(0);
    setCount(4);
    setCycleCount(0);
  };

  const getCircleScale = () => {
    switch (phase) {
      case 0: return 'scale-150'; // Breathe In - expand
      case 1: return 'scale-150'; // Hold In - stay expanded
      case 2: return 'scale-75';  // Breathe Out - shrink
      case 3: return 'scale-75';  // Hold Out - stay shrunk
      default: return 'scale-100';
    }
  };

  const getCircleOpacity = () => {
    switch (phase) {
      case 0: return 'opacity-100'; // Breathe In
      case 1: return 'opacity-90';  // Hold In
      case 2: return 'opacity-70';  // Breathe Out
      case 3: return 'opacity-60';  // Hold Out
      default: return 'opacity-80';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Wind className="w-8 h-8 text-white" />
            <h1 className="text-4xl font-bold text-white">Box Breathing</h1>
          </div>
          <p className="text-gray-300 text-lg">
            4 seconds in • 4 seconds hold • 4 seconds out • 4 seconds hold
          </p>
        </div>

        {/* Breathing Circle Animation */}
        <div className="relative flex items-center justify-center mb-12" style={{ height: '400px' }}>
          {/* Outer glow rings */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-4000 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`absolute w-96 h-96 rounded-full bg-gradient-to-br ${phases[phase].color} blur-3xl ${getCircleOpacity()} transition-all duration-4000`}></div>
          </div>

          {/* Main breathing circle */}
          <div className={`relative w-64 h-64 rounded-full bg-gradient-to-br ${phases[phase].color} shadow-2xl flex items-center justify-center transition-all duration-4000 ease-in-out ${isActive ? getCircleScale() : 'scale-100'}`}>
            {/* Inner circle with count */}
            <div className="absolute inset-8 rounded-full bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="text-8xl font-bold text-white mb-2">
                {count}
              </div>
              <div className="text-xl font-semibold text-white/90">
                {phases[phase].name}
              </div>
            </div>

            {/* Pulsing ring effect */}
            {isActive && (
              <div className={`absolute inset-0 rounded-full border-4 border-white/30 animate-ping`}></div>
            )}
          </div>

          {/* Corner indicators */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`absolute w-4 h-4 rounded-full transition-all duration-500 ${
                  phase === i ? 'bg-white scale-125' : 'bg-white/30 scale-100'
                }`}
                style={{
                  top: i === 0 || i === 1 ? '20%' : '80%',
                  left: i === 0 || i === 3 ? '20%' : '80%',
                  transform: 'translate(-50%, -50%)'
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Cycle Counter */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
            <span className="text-white text-lg font-semibold">
              Cycle {cycleCount} / {totalCycles}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-8 py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition duration-200 shadow-lg hover:shadow-xl"
            >
              <Play className="w-5 h-5" />
              Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold px-8 py-4 rounded-xl hover:from-yellow-600 hover:to-orange-700 transition duration-200 shadow-lg hover:shadow-xl"
            >
              <Pause className="w-5 h-5" />
              Pause
            </button>
          )}
          
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold px-8 py-4 rounded-xl hover:from-gray-700 hover:to-gray-800 transition duration-200 shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>

        {/* Instructions */}
        {!isActive && cycleCount === 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-300 text-sm">
              Click Start to begin your breathing exercise. Follow the circle and the countdown.
            </p>
          </div>
        )}

        {cycleCount >= totalCycles && (
          <div className="mt-8 text-center">
            <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4">
              <p className="text-green-300 font-semibold text-lg">
                ✓ Exercise Complete! Well done.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoxBreathingAnimation;