'use client';

import { useEffect, useRef } from 'react';
import { ErrorSummaryProps } from '@/lib/types';
import { AlertCircle } from 'lucide-react';

export default function ErrorSummary({ errors }: ErrorSummaryProps) {
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (Object.keys(errors).length > 0 && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [errors]);

  if (Object.keys(errors).length === 0) return null;

  return (
    <div 
      ref={errorRef}
      className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-6"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="text-red-600 shrink-0 mt-1" size={24} />
        <div className="flex-1">
          <h3 className="font-bold text-red-900 text-lg mb-2">
            Please correct the following errors:
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field} className="text-red-800">
                <span className="font-semibold">{field}:</span> {message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
