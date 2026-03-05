'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Search, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { API_ENDPOINTS } from '@/lib/config';

const inputClassName = "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900";

export default function StatusCheckPage() {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setApplication(null);

    try {
      const response = await fetch(API_ENDPOINTS.applicationStatus(referenceNumber));
      const data = await response.json();

      if (response.ok) {
        setApplication(data.application);
      } else {
        setError(data.message || 'Application not found');
      }
    } catch (err) {
      setError('Failed to fetch application status. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="text-green-600" size={48} />;
      case 'REJECTED':
        return <XCircle className="text-red-600" size={48} />;
      case 'UNDER_REVIEW':
        return <AlertCircle className="text-yellow-600" size={48} />;
      default:
        return <Clock className="text-blue-600" size={48} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'UNDER_REVIEW':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-900">
                Check Application Status
              </h2>

              <form onSubmit={handleSearch} className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter Reference Number
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="REF-XXXXXXXXX-XXXXXX"
                    className={inputClassName}
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors font-semibold flex items-center gap-2 disabled:bg-gray-400"
                  >
                    <Search size={20} />
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </form>

              {error && (
                <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <XCircle className="text-red-600" size={24} />
                    <div>
                      <div className="font-semibold text-red-900">Error</div>
                      <div className="text-sm text-red-700">{error}</div>
                    </div>
                  </div>
                </div>
              )}

              {application && (
                <div className="border-2 border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="shrink-0">
                      {getStatusIcon(application.status)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Application Details
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-semibold text-gray-600">Reference Number:</span>
                          <p className="text-lg font-mono text-gray-900">{application.referenceNumber}</p>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-600">Service Type:</span>
                          <p className="text-gray-900 capitalize">{application.serviceType.replace(/-/g, ' ')}</p>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-600">Status:</span>
                          <div className="mt-1">
                            <span className={`inline-block px-4 py-2 rounded-full font-semibold border-2 ${getStatusColor(application.status)}`}>
                              {application.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-600">Submitted On:</span>
                          <p className="text-gray-900">{new Date(application.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-600">Last Updated:</span>
                          <p className="text-gray-900">{new Date(application.updatedAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                    <p className="text-sm text-blue-800">
                      {application.status === 'PENDING' && 'Your application is pending review. You will be notified once it is processed.'}
                      {application.status === 'UNDER_REVIEW' && 'Your application is currently under review. Please check back later for updates.'}
                      {application.status === 'APPROVED' && 'Congratulations! Your application has been approved.'}
                      {application.status === 'REJECTED' && 'Your application has been rejected. Please contact support for more information.'}
                    </p>
                  </div>

                  <div className="border-t-2 border-gray-200 pt-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Submitted Form Data</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(application.formData as Record<string, any>).map(([key, value]) => (
                          <div key={key} className="border-b border-gray-200 pb-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <p className="text-gray-900 mt-1">
                              {value || <span className="text-gray-400 italic">Not provided</span>}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
