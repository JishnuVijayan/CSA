'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import HumanVerification from '@/components/HumanVerification';
import SessionTimer from '@/components/SessionTimer';
import SessionExpiredOverlay from '@/components/SessionExpiredOverlay';
import CaptchaChallenge from '@/components/CaptchaChallenge';
import ErrorSummary from '@/components/ErrorSummary';
import { formSchema } from '@/lib/validation';
import { US_STATES } from '@/lib/types';

const inputClassName = "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900";

export default function LicenseRenewalPage() {
  const [verified, setVerified] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [captchaSolved, setCaptchaSolved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!captchaSolved) {
      setErrors({ captcha: 'Please complete the security verification' });
      return;
    }

    // Simple validation
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.licenseNumber) newErrors.licenseNumber = 'License number is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const response = await fetch('http://localhost:3001/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: 'license-renewal',
          formData: formData
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Application submitted successfully!\n\nYour Reference Number: ${data.referenceNumber}\n\nPlease save this number to check your application status.`);
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          licenseNumber: '',
          dateOfBirth: '',
          address: '',
          city: '',
          state: '',
          zipCode: ''
        });
        setCaptchaSolved(false);
      } else {
        setErrors({ general: 'Failed to submit application. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please check if the backend server is running.' });
    }
  };

  if (!verified) {
    return <HumanVerification onVerified={() => setVerified(true)} captchaType="addition" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-900">
                Driver License Renewal Application
              </h2>

              <ErrorSummary errors={errors} />

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 bg-gray-100 px-3 py-2 rounded">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      First Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={inputClassName}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Last Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={inputClassName}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClassName}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputClassName}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 bg-gray-100 px-3 py-2 rounded">
                  License Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      License Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className={inputClassName}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className={inputClassName}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 bg-gray-100 px-3 py-2 rounded">
                  Address
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={inputClassName}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={inputClassName}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        State
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={inputClassName}
                      >
                        <option value="">Select State</option>
                        {US_STATES.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className={inputClassName}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <CaptchaChallenge 
                  onSolved={() => setCaptchaSolved(true)}
                  solved={captchaSolved}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={sessionExpired || !captchaSolved}
                  className={`px-8 py-3 rounded-lg font-bold text-lg transition-colors ${
                    sessionExpired || !captchaSolved
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-900 text-white hover:bg-blue-800 cursor-pointer'
                  }`}
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      <SessionTimer onExpire={() => setSessionExpired(true)} initialSeconds={600} />
      <SessionExpiredOverlay isVisible={sessionExpired} />
    </div>
  );
}
