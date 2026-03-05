import { SessionExpiredOverlayProps } from '@/lib/types';
import { AlertTriangle } from 'lucide-react';

export default function SessionExpiredOverlay({ isVisible }: SessionExpiredOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 rounded-full p-4">
            <AlertTriangle size={48} className="text-red-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Expired</h2>
        <p className="text-gray-600 mb-6">
          Your session has timed out due to inactivity. Please refresh the page to start a new session.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}
