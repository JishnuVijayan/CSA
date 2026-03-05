'use client';

import { useState, useEffect } from 'react';
import { SessionTimerProps } from '@/lib/types';
import { Clock } from 'lucide-react';

export default function SessionTimer({ onExpire, initialSeconds = 600 }: SessionTimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onExpire]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = secondsRemaining < 60;

  return (
    <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
      isLowTime ? 'bg-red-600 text-white animate-pulse' : 'bg-blue-900 text-white'
    }`}>
      <Clock size={20} />
      <div>
        <div className="text-xs font-semibold">Session Time</div>
        <div className="text-lg font-bold">{formatTime(secondsRemaining)}</div>
      </div>
    </div>
  );
}
