import React, { useState, useEffect } from 'react';
import { Wind, Play, Pause, RotateCcw } from 'lucide-react';

const Breathing478Animation = () => {
  const [phase, setPhase] = useState(0); // 0: Inhale, 1: Hold, 2: Exhale
  const [isActive, setIsActive] = useState(false);
  const [count, setCount] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);
  const [totalCycles] = useState(4);

  const phases = [
    { name: 'Breathe In', duration: 4000, maxCount: 4, color: 'from-blue-400 to-blue-600' },
    { name: 'Hold', duration: 7000, maxCount: 7, color: 'from-purple-400 to-purple-600' },
    { name: 'Breathe Out', duration: 8000, maxCount: 8, color: 'from-pink-400 to-pink-600' }
  ];

  useEffect(() => {
    let timer;
    let countdownTimer;

    if (isActive) {
      // Countdown timer
      countdownTimer = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount <= 1) {
            return phases[phase].maxCount;
          }
          return prevCount - 1;
        });
      }, 1000);

      // Phase timer
      timer = setTimeout(() => {
        setPhase((prevPhase) => {
          const nextPhase = (prevPhase + 1) % 3;
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
          setCount(phases[nextPhase].maxCount);
          return nextPhase;
        });
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
      case 1: return 'scale-150'; // Hold - stay expanded
      case 2: return 'scale-75';  // Breathe Out - shrink
      default: return 'scale-100';
    }
  };

  const getCircleOpacity = () => {
    switch (phase) {
      case 0: return 'opacity-100'; // Breathe In
      case 1: return 'opacity-90';  // Hold
      case 2: return 'opacity-70';  // Breathe Out
      default: return 'opacity-80';
    }
  };

  return (
    <div className="h-[400px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 rounded-2xl">
      <div className="max-w-xl w-full">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Wind className="w-5 h-5 text-white" />
            <h1 className="text-xl font-bold text-white">4-7-8 Breathing</h1>
          </div>
          <p className="text-gray-300 text-md">
            4s in • 7s hold • 8s out
          </p>
        </div>

        {/* Breathing Circle Animation */}
        <div className="relative flex items-center justify-center mb-4" style={{ height: '180px' }}>
          {/* Outer glow rings */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all ${isActive ? 'opacity-100' : 'opacity-0'}`}
               style={{ transitionDuration: `${phases[phase].duration}ms` }}>
            <div className={`absolute w-56 h-56 rounded-full bg-gradient-to-br ${phases[phase].color} blur-3xl ${getCircleOpacity()}`}
                 style={{ transition: `all ${phases[phase].duration}ms ease-in-out` }}></div>
          </div>

          {/* Main breathing circle */}
          <div className={`relative w-36 h-36 rounded-full bg-gradient-to-br ${phases[phase].color} shadow-2xl flex items-center justify-center ease-in-out ${isActive ? getCircleScale() : 'scale-100'}`}
               style={{ transition: `all ${phases[phase].duration}ms ease-in-out` }}>
            {/* Inner circle with count */}
            <div className="absolute inset-5 rounded-full bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-white mb-1">
                {count}
              </div>
              <div className="text-xs font-semibold text-white/90">
                {phases[phase].name}
              </div>
            </div>

            {/* Pulsing ring effect */}
            {isActive && (
              <div className={`absolute inset-0 rounded-full border-4 border-white/30 animate-ping`}></div>
            )}
          </div>

          {/* Triangle indicators (3 points for 3 phases) */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`absolute w-3 h-3 rounded-full transition-all duration-500 ${
                  phase === i ? 'bg-white scale-125' : 'bg-white/30 scale-100'
                }`}
                style={{
                  top: i === 0 ? '10%' : '85%',
                  left: i === 0 ? '50%' : (i === 1 ? '20%' : '80%'),
                  transform: 'translate(-50%, -50%)'
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Cycle Counter */}
        <div className="text-center mb-3">
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5">
            <span className="text-white text-xs font-semibold">
              Cycle {cycleCount} / {totalCycles}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:from-green-600 hover:to-emerald-700 transition duration-200 shadow-lg hover:shadow-xl text-sm"
            >
              <Play className="w-4 h-4" />
              Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:from-yellow-600 hover:to-orange-700 transition duration-200 shadow-lg hover:shadow-xl text-sm"
            >
              <Pause className="w-4 h-4" />
              Pause
            </button>
          )}
          
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold px-5 py-2.5 rounded-lg hover:from-gray-700 hover:to-gray-800 transition duration-200 shadow-lg hover:shadow-xl text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Instructions */}
        {!isActive && cycleCount === 0 && (
          <div className="mt-3 text-center">
            <p className="text-gray-300 text-xs">
              Click Start to begin your breathing exercise
            </p>
          </div>
        )}

        {cycleCount >= totalCycles && (
          <div className="mt-3 text-center">
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-2">
              <p className="text-green-300 font-semibold text-xs">
                ✓ Exercise Complete! Well done.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Breathing478Animation;