import { NewsTickerProps } from '@/lib/types';
import { AlertCircle } from 'lucide-react';

export default function NewsTicker({ messages, speed = 50 }: NewsTickerProps) {
  const tickerContent = messages.join(' • ');
  
  return (
    <div className="bg-yellow-500 text-black py-2 overflow-hidden relative">
      <div className="flex items-center gap-2">
        <div className="px-4 flex items-center gap-2 bg-red-600 text-white font-bold whitespace-nowrap">
          <AlertCircle size={16} />
          <span>LATEST NEWS</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="flex overflow-hidden">
            <div className="flex whitespace-nowrap animate-scroll">
              {tickerContent} • {tickerContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
