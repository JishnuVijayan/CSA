'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import HumanVerification from '@/components/HumanVerification';
import SessionTimer from '@/components/SessionTimer';
import SessionExpiredOverlay from '@/components/SessionExpiredOverlay';
import ErrorSummary from '@/components/ErrorSummary';
import { Shield, CheckCircle, XCircle, Square, CheckSquare } from 'lucide-react';

const inputClassName = "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900";

// Image Selection CAPTCHA (simulated with emojis)
function ImageSelectionCaptcha({ onSolved, solved }: { onSolved: () => void; solved: boolean }) {
  const [challenge] = useState(() => {
    const challenges = [
      { 
        instruction: 'Select all images with VEHICLES',
        images: ['🚗', '🏠', '🚙', '🌳', '🚕', '🌸', '🚌', '🎨', '🚐'],
        correctIndices: [0, 2, 4, 6, 8]
      },
      { 
        instruction: 'Select all images with BUILDINGS',
        images: ['🏢', '🚗', '🏠', '🌳', '🏛️', '🌸', '🏬', '🎨', '🏭'],
        correctIndices: [0, 2, 4, 6, 8]
      },
      { 
        instruction: 'Select all images with NATURE',
        images: ['🌳', '🚗', '🌸', '🏠', '🌺', '🚙', '🌲', '🎨', '🌻'],
        correctIndices: [0, 2, 4, 6, 8]
      }
    ];
    return challenges[Math.floor(Math.random() * challenges.length)];
  });
  
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const toggleSelection = (index: number) => {
    setSelectedIndices(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
    setFeedback(null);
  };

  const handleVerify = () => {
    const isCorrect = 
      selectedIndices.length === challenge.correctIndices.length &&
      selectedIndices.every(idx => challenge.correctIndices.includes(idx));
    
    if (isCorrect) {
      setFeedback('correct');
      onSolved();
    } else {
      setFeedback('incorrect');
      setTimeout(() => {
        setSelectedIndices([]);
        setFeedback(null);
      }, 2000);
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
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            {challenge.instruction}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {challenge.images.map((emoji, index) => (
              <button
                key={index}
                type="button"
                onClick={() => toggleSelection(index)}
                className={`relative aspect-square rounded-lg border-2 flex items-center justify-center text-5xl transition-all ${
                  selectedIndices.includes(index)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                {emoji}
                {selectedIndices.includes(index) && (
                  <div className="absolute top-1 right-1">
                    <CheckSquare className="text-blue-600" size={20} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        {feedback === 'incorrect' && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <XCircle size={16} />
            <span>Incorrect selection. Please try again.</span>
          </div>
        )}
        <button
          type="button"
          onClick={handleVerify}
          disabled={selectedIndices.length === 0}
          className={`w-full py-2 rounded font-semibold transition-colors ${
            selectedIndices.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-900 text-white hover:bg-blue-800'
          }`}
        >
          Verify Selection
        </button>
      </div>
    </div>
  );
}

export default function PropertyTaxPage() {
  const [verified, setVerified] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [captchaSolved, setCaptchaSolved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    propertyId: '',
    ownerName: '',
    email: '',
    phone: '',
    propertyAddress: '',
    city: '',
    pincode: '',
    propertyType: '',
    builtUpArea: '',
    taxYear: '',
    taxAmount: '',
    paymentMode: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!captchaSolved) {
      setErrors({ captcha: 'Please complete the security verification' });
      return;
    }

    const newErrors: Record<string, string> = {};
    if (!formData.propertyId) newErrors.propertyId = 'Property ID is required';
    if (!formData.ownerName) newErrors.ownerName = 'Owner name is required';
    if (!formData.taxYear) newErrors.taxYear = 'Tax year is required';
    if (!formData.taxAmount) newErrors.taxAmount = 'Tax amount is required';
    
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
          serviceType: 'property-tax',
          formData: formData
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Payment request submitted successfully!\n\nYour Reference Number: ${data.referenceNumber}\n\nPlease save this number to check your payment status.`);
        setFormData({
          propertyId: '',
          ownerName: '',
          email: '',
          phone: '',
          propertyAddress: '',
          city: '',
          pincode: '',
          propertyType: '',
          builtUpArea: '',
          taxYear: '',
          taxAmount: '',
          paymentMode: ''
        });
        setCaptchaSolved(false);
      } else {
        setErrors({ general: 'Failed to submit payment request. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please check if the backend server is running.' });
    }
  };

  if (!verified) {
    return <HumanVerification onVerified={() => setVerified(true)} captchaType="subtraction" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-orange-600">
                Property Tax Payment Form
              </h2>

              <ErrorSummary errors={errors} />

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 bg-gray-100 px-3 py-2 rounded">
                  Property Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Property ID/Assessment Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="propertyId"
                      value={formData.propertyId}
                      onChange={handleChange}
                      className={inputClassName}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Property Type
                    </label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className={inputClassName}
                    >
                      <option value="">Select Type</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="industrial">Industrial</option>
                      <option value="agricultural">Agricultural</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Property Address
                    </label>
                    <textarea
                      name="propertyAddress"
                      value={formData.propertyAddress}
                      onChange={handleChange}
                      rows={2}
                      className={inputClassName}
                    />
                  </div>
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
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Built-up Area (sq. ft.)
                    </label>
                    <input
                      type="number"
                      name="builtUpArea"
                      value={formData.builtUpArea}
                      onChange={handleChange}
                      className={inputClassName}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 bg-gray-100 px-3 py-2 rounded">
                  Owner Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Owner Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      className={inputClassName}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Email Address
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
                  Tax Payment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Tax Year <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="taxYear"
                      value={formData.taxYear}
                      onChange={handleChange}
                      className={inputClassName}
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="2024-25">2024-25</option>
                      <option value="2023-24">2023-24</option>
                      <option value="2022-23">2022-23</option>
                      <option value="2021-22">2021-22</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Tax Amount (₹) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      name="taxAmount"
                      value={formData.taxAmount}
                      onChange={handleChange}
                      className={inputClassName}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Payment Mode
                    </label>
                    <select
                      name="paymentMode"
                      value={formData.paymentMode}
                      onChange={handleChange}
                      className={inputClassName}
                    >
                      <option value="">Select Payment Mode</option>
                      <option value="online">Online Payment</option>
                      <option value="netbanking">Net Banking</option>
                      <option value="upi">UPI</option>
                      <option value="card">Credit/Debit Card</option>
                      <option value="challan">Bank Challan</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> After submitting this form, you will be redirected to the payment gateway. 
                  Please keep your payment details ready. A receipt will be sent to your registered email address.
                </p>
              </div>

              <div className="mb-6">
                <ImageSelectionCaptcha 
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
                      : 'bg-orange-600 text-white hover:bg-orange-700 cursor-pointer'
                  }`}
                >
                  Proceed to Payment
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
