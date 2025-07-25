"use client";

import { useState, useEffect } from 'react';

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState(59);

  useEffect(() => {
    if (timeLeft === 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-primary/20 border border-primary text-primary px-4 py-2 rounded-full shadow-lg">
      <p className="text-sm md:text-base font-semibold">
        Tempo restante da sua sorte: <span className="font-bold tabular-nums">{formatTime(timeLeft)}</span>
      </p>
    </div>
  );
}
