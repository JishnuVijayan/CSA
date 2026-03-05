'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import HumanVerification from '@/components/HumanVerification';
import SessionTimer from '@/components/SessionTimer';
import SessionExpiredOverlay from '@/components/SessionExpiredOverlay';
import ErrorSummary from '@/components/ErrorSummary';
import { Shield, CheckCircle, XCircle } from 'lucide-react';
import { API_ENDPOINTS } from '@/lib/config';

const inputClassName = "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900";

// Custom CAPTCHA for Aadhar - Subtraction
function SubtractionCaptcha({ onSolved, solved }: { onSolved: () => void; solved: boolean }) {
  const [question] = useState(() => {
    const num1 = Math.floor(Math.random() * 50) + 20;
    const num2 = Math.floor(Math.random() * 15) + 1;
    return { num1, num2, answer: num1 - num2 };
  });
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const handleVerify = () => {
    if (parseInt(userAnswer) === question.answer) {
      setFeedback('correct');
      onSolved();
    } else {
      setFeedback('incorrect');
    }
  };

  if (solved) {
    return (
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 flex items-center gap-3">
        <CheckCircle className="text-green-600" size={24} />
        <div>
          <div className="font-semibold text-green-900">Verification Complete</div>
          <div className="text-sm text-green-700">You may now submit the form</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="text-blue-900" size={24} />
        <h3 className="font-bold text-gray-900">Security Verification</h3>
      </div>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Please solve this problem to verify you are human:
          </label>
          <div className="text-lg font-bold text-gray-900 mb-2">
            What is {question.num1} - {question.num2}?
          </div>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => {
              setUserAnswer(e.target.value);
              setFeedback(null);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            placeholder="Enter your answer"
          />
        </div>
        {feedback === 'incorrect' && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <XCircle size={16} />
            <span>Incorrect answer. Please try again.</span>
          </div>
        )}
        <button
          type="button"
          onClick={handleVerify}
          className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors font-semibold"
        >
          Verify
        </button>
      </div>
    </div>
  );
}

export default function AadharUpdatePage() {
  const [verified, setVerified] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [captchaSolved, setCaptchaSolved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    aadharNumber: '',
    fullName: '',
    email: '',
    phone: '',
    updateType: '',
    newAddress: '',
    city: '',
    pincode: ''
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

    const newErrors: Record<string, string> = {};
    if (!formData.aadharNumber) newErrors.aadharNumber = 'Aadhar number is required';
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.updateType) newErrors.updateType = 'Update type is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const response = await fetch(API_ENDPOINTS.applications, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: 'aadhar-update',
          formData: formData
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Update request submitted successfully!\n\nYour Reference Number: ${data.referenceNumber}\n\nPlease save this number to check your application status.`);
        setFormData({
          aadharNumber: '',
          fullName: '',
          email: '',
          phone: '',
          updateType: '',
          newAddress: '',
          city: '',
          pincode: ''
        });
        setCaptchaSolved(false);
      } else {
        setErrors({ general: 'Failed to submit request. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please check if the backend server is running.' });
    }
  };

  if (!verified) {
    return <HumanVerification onVerified={() => setVerified(true)} captchaType="text" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-green-600">
                Aadhar Card Update Request
              </h2>

              <ErrorSummary errors={errors} />

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 bg-gray-100 px-3 py-2 rounded">
                  Aadhar Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Aadhar Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={handleChange}
                      placeholder="XXXX-XXXX-XXXX"
                      className={inputClassName}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={inputClassName}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Mobile Number
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
                  Update Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Type of Update <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="updateType"
                      value={formData.updateType}
                      onChange={handleChange}
                      className={inputClassName}
                      required
                    >
                      <option value="">Select Update Type</option>
                      <option value="address">Address Change</option>
                      <option value="mobile">Mobile Number Update</option>
                      <option value="email">Email Update</option>
                      <option value="name">Name Correction</option>
                      <option value="dob">Date of Birth Correction</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      New Address (if applicable)
                    </label>
                    <input
                      type="text"
                      name="newAddress"
                      value={formData.newAddress}
                      onChange={handleChange}
                      className={inputClassName}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        PIN Code
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className={inputClassName}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <SubtractionCaptcha 
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
                      : 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                  }`}
                >
                  Submit Update Request
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
