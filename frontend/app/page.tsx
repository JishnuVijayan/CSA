'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SessionTimer from '@/components/SessionTimer';
import SessionExpiredOverlay from '@/components/SessionExpiredOverlay';
import { FileText, CreditCard, User, Car, Home as HomeIcon } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [sessionExpired, setSessionExpired] = useState(false);

  const handleSessionExpire = () => {
    setSessionExpired(true);
  };

  const services = [
    {
      id: 'license-renewal',
      title: 'Driver License Renewal',
      description: 'Renew your driving license online',
      icon: Car,
      href: '/services/license-renewal',
      color: 'bg-blue-600'
    },
    {
      id: 'aadhar-update',
      title: 'Aadhar Card Update',
      description: 'Update your Aadhar card details',
      icon: CreditCard,
      href: '/services/aadhar-update',
      color: 'bg-green-600'
    },
    {
      id: 'passport-application',
      title: 'Passport Application',
      description: 'Apply for a new passport',
      icon: FileText,
      href: '/services/passport-application',
      color: 'bg-purple-600'
    },
    {
      id: 'voter-registration',
      title: 'Voter ID Registration',
      description: 'Register for voter ID card',
      icon: User,
      href: '/services/voter-registration',
      color: 'bg-red-600'
    },
    {
      id: 'property-tax',
      title: 'Property Tax Payment',
      description: 'Pay your property taxes online',
      icon: HomeIcon,
      href: '/services/property-tax',
      color: 'bg-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to State Portal
              </h1>
              <p className="text-gray-600 mb-6">
                Select a service below to get started. Please have all required documents ready before proceeding.
              </p>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Important Notice:</strong> All services require human verification and completion of security challenges. 
                  Please ensure you have a stable internet connection and sufficient time to complete your application.
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Track Your Application:</strong> Already submitted an application?{' '}
                  <Link href="/status" className="font-bold underline hover:text-blue-900">
                    Check your application status here
                  </Link>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Link
                    key={service.id}
                    href={service.href}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border-2 border-gray-200 hover:border-blue-500"
                  >
                    <div className={`${service.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="text-white" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {service.description}
                    </p>
                    <div className="mt-4 text-blue-600 font-semibold text-sm flex items-center gap-2">
                      Apply Now
                      <span>→</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      <SessionTimer onExpire={handleSessionExpire} initialSeconds={600} />
      <SessionExpiredOverlay isVisible={sessionExpired} />
    </div>
  );
}
