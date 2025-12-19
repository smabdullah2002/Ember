import React, { useEffect, useState } from "react";
import { Wind, Play, Pause, RotateCcw } from "lucide-react";

const steps = [
  { name: "Inhale Left", duration: 4000, side: "left", color: "from-blue-400 to-blue-600" },
  { name: "Hold", duration: 4000, side: "both", color: "from-purple-400 to-purple-600" },
  { name: "Exhale Right", duration: 4000, side: "right", color: "from-pink-400 to-pink-600" },
  { name: "Inhale Right", duration: 4000, side: "right", color: "from-blue-400 to-blue-600" },
  { name: "Hold", duration: 4000, side: "both", color: "from-purple-400 to-purple-600" },
  { name: "Exhale Left", duration: 4000, side: "left", color: "from-pink-400 to-pink-600" }
];

const AlternateNostrilBreathing = () => {
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const [cycle, setCycle] = useState(0);
  const totalCycles = 5;

  useEffect(() => {
    if (!isActive) return;

    const countdown = setInterval(() => {
      setCount((c) => (c <= 1 ? 4 : c - 1));
    }, 1000);

    const timer = setTimeout(() => {
      setStep((prev) => {
        const next = (prev + 1) % steps.length;
        if (next === 0) {
          setCycle((c) => {
            if (c + 1 >= totalCycles) {
              setIsActive(false);
              return 0;
            }
            return c + 1;
          });
        }
        return next;
      });
      setCount(4);
    }, steps[step].duration);

    return () => {
      clearInterval(countdown);
      clearTimeout(timer);
    };
  }, [isActive, step]);

  const handleStart = () => {
    setIsActive(true);
    setStep(0);
    setCount(4);
    setCycle(0);
  };

  const handlePause = () => setIsActive(false);

  const handleReset = () => {
    setIsActive(false);
    setStep(0);
    setCount(4);
    setCycle(0);
  };

  const activeSide = steps[step].side;

  return (
    <div className="h-[450px] bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4 rounded-2xl">
      <div className="max-w-xl w-full">

        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Wind className="w-5 h-5 text-white" />
            <h1 className="text-xl font-bold text-white">Alternate Nostril Breathing</h1>
          </div>
        </div>

        {/* Face / Nose Animation */}
        <div className="relative flex items-center justify-center mb-6  h-[180px]">
          <div className={`absolute w-56 h-56 rounded-full bg-gradient-to-br ${steps[step].color} blur-3xl transition-all duration-4000 ${isActive ? "opacity-100" : "opacity-0"}`} />

          <div className={`relative w-36 h-36 rounded-full bg-gradient-to-br ${steps[step].color} flex items-center justify-center shadow-2xl transition-all duration-4000`}>
            {/* Inner timer */}
            <div className="absolute inset-8 rounded-full bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-white">{count}</div>
              <div className="text-xs text-white/90 mt-1">
                {steps[step].name}
              </div>
            </div>

            {/* Nose indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-7">
              <div
                className={`w-4 h-4 rounded-full transition-all ${
                  activeSide === "left" || activeSide === "both"
                    ? "bg-white scale-125"
                    : "bg-white/30"
                }`}
              />
              <div
                className={`w-4 h-4 rounded-full transition-all ${
                  activeSide === "right" || activeSide === "both"
                    ? "bg-white scale-125"
                    : "bg-white/30"
                }`}
              />
            </div>

            {isActive && (
              <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
            )}
          </div>
        </div>

        {/* Cycle Counter */}
        <div className="text-center mb-6">
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
            <span className="text-white text-lg font-semibold">
              Cycle {cycle} / {totalCycles}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl"
            >
              <Play className="w-4 h-4" />
              Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl"
            >
              <Pause className="w-4 h-4" />
              Pause
            </button>
          )}

          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>

        {/* Completion */}
        {cycle >= totalCycles && (
          <div className="mt-3 text-center">
            <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4">
              <p className="text-green-300 font-semibold text-lg">
                ✓ Session Complete. Breathe easy.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AlternateNostrilBreathing;
