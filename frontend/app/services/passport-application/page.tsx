'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import HumanVerification from '@/components/HumanVerification';
import SessionTimer from '@/components/SessionTimer';
import SessionExpiredOverlay from '@/components/SessionExpiredOverlay';
import ErrorSummary from '@/components/ErrorSummary';
import { Shield, CheckCircle, XCircle } from 'lucide-react';

const inputClassName = "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900";

// Multiplication CAPTCHA
function MultiplicationCaptcha({ onSolved, solved }: { onSolved: () => void; solved: boolean }) {
  const [question] = useState(() => {
    const num1 = Math.floor(Math.random() * 12) + 1;
    const num2 = Math.floor(Math.random() * 12) + 1;
    return { num1, num2, answer: num1 * num2 };
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
            What is {question.num1} × {question.num2}?
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

export default function PassportApplicationPage() {
  const [verified, setVerified] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [captchaSolved, setCaptchaSolved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    applicationType: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    gender: '',
    maritalStatus: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    fatherName: '',
    motherName: '',
    emergencyContact: ''
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
    if (!formData.applicationType) newErrors.applicationType = 'Application type is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    
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
          serviceType: 'passport',
          formData: formData
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Application submitted successfully!\n\nYour Reference Number: ${data.referenceNumber}\n\nPlease save this number to check your application status.`);
        setFormData({
          applicationType: '',
          firstName: '',
          middleName: '',
          lastName: '',
          dateOfBirth: '',
          placeOfBirth: '',
          gender: '',
          maritalStatus: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          fatherName: '',
          motherName: '',
          emergencyContact: ''
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
    return <HumanVerification onVerified={() => setVerified(true)} captchaType="multiplication" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-purple-600">
                Passport Application Form
              </h2>

              <ErrorSummary errors={errors} />

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 bg-gray-100 px-3 py-2 rounded">
                  Application Type
                </h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Type of Application <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="applicationType"
                    value={formData.applicationType}
                    onChange={handleChange}
                    className={inputClassName}
                    required
                  >
                    <option value="">Select Application Type</option>
                    <option value="fresh">Fresh Passport</option>
                    <option value="reissue">Re-issue of Passport</option>
                    <option value="renewal">Passport Renewal</option>
                    <option value="tatkal">Tatkal Passport</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 bg-gray-100 px-3 py-2 rounded">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      Middle Name
                    </label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                      className={inputClassName}
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Date of Birth <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className={inputClassName}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Place of Birth
                    </label>
                    <input
                      type="text"
                      name="placeOfBirth"
                      value={formData.placeOfBirth}
                      onChange={handleChange}
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={inputClassName}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Marital Status
                    </label>
                    <select
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleChange}
                      className={inputClassName}
                    >
                      <option value="">Select Status</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 bg-gray-100 px-3 py-2 rounded">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Address Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Full Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
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
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
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
                <h3 className="text-lg font-bold text-gray-800 mb-4 bg-gray-100 px-3 py-2 rounded">
                  Family Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Father's Name
                    </label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Mother's Name
                    </label>
                    <input
                      type="text"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleChange}
                      className={inputClassName}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Emergency Contact Number
                    </label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      className={inputClassName}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <MultiplicationCaptcha 
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
                      : 'bg-purple-600 text-white hover:bg-purple-700 cursor-pointer'
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
