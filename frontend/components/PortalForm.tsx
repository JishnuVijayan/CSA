'use client';

import { useState, useEffect } from 'react';
import { FormData } from '@/lib/types';
import { formSchema } from '@/lib/validation';
import { US_STATES, APPLICATION_REASONS } from '@/lib/types';
import ErrorSummary from './ErrorSummary';
import CaptchaChallenge from './CaptchaChallenge';
import TermsModal from './TermsModal';

const inputClassName = "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900";

export default function PortalForm({ sessionExpired }: { sessionExpired: boolean }) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    ssn: '',
    email: '',
    phone: '',
    streetAddress: '',
    apartmentUnit: '',
    city: '',
    state: '',
    zipCode: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    reasonForApplication: '',
    additionalInfo: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [captchaSolved, setCaptchaSolved] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Track filled fields
  useEffect(() => {
    const requiredFields = [
      'firstName', 'lastName', 'ssn', 'email', 'phone',
      'streetAddress', 'city', 'state', 'zipCode',
      'dobDay', 'dobMonth', 'dobYear', 'reasonForApplication'
    ];
    
    const filled = requiredFields.filter(field => {
      const value = formData[field as keyof FormData];
      return value && value.toString().trim() !== '';
    }).length;

    // Show terms modal when ~50% of required fields are filled
    if (filled >= 7 && !termsAccepted && !showTermsModal) {
      setShowTermsModal(true);
    }
  }, [formData, termsAccepted, showTermsModal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (sessionExpired) {
      return;
    }

    if (!captchaSolved) {
      setErrors({ captcha: 'Please complete the security verification' });
      return;
    }

    if (!termsAccepted) {
      setErrors({ terms: 'Please accept the terms and conditions' });
      return;
    }

    const result = formSchema.safeParse(formData);
    
    if (result.success) {
      setErrors({});
      alert('Form submitted successfully! (This is a prototype - no data is actually sent)');
    } else {
      console.log('Validation error:', result.error);
      const validationErrors: Record<string, string> = {};
      
      // Zod error structure has issues array
      if (result.error && result.error.issues) {
        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as string;
          validationErrors[field] = issue.message;
        });
      } else {
        validationErrors['general'] = 'Validation failed. Please check your inputs.';
      }
      setErrors(validationErrors);
    }
  };

  const handleTermsAccept = () => {
    setTermsAccepted(true);
    setShowTermsModal(false);
  };

  // Generate day, month, year options
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  return (
    <>
      <TermsModal 
        isOpen={showTermsModal}
        onAccept={handleTermsAccept}
        onClose={() => {}}
      />
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-900">
          State Portal Application Form
        </h2>

        <ErrorSummary errors={errors} />

        {/* Personal Information Section */}
        <div className="mb-8">
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
                Social Security Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="ssn"
                value={formData.ssn}
                onChange={handleChange}
                placeholder="XXX-XX-XXXX"
                className={inputClassName}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address <span className="text-red-600">*</span>
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
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Phone Number <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="XXX-XXX-XXXX"
              className={inputClassName}
              required
            />
          </div>
        </div>

        {/* Address Section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 bg-gray-100 px-3 py-2 rounded">
            Address Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Street Address <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                className={inputClassName}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Apartment/Unit Number
              </label>
              <input
                type="text"
                name="apartmentUnit"
                value={formData.apartmentUnit}
                onChange={handleChange}
                className={inputClassName}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  City <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={inputClassName}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  State <span className="text-red-600">*</span>
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={inputClassName}
                  required
                >
                  <option value="">Select State</option>
                  {US_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  ZIP Code <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="XXXXX"
                  className={inputClassName}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Date of Birth Section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 bg-gray-100 px-3 py-2 rounded">
            Date of Birth
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Month <span className="text-red-600">*</span>
              </label>
              <select
                name="dobMonth"
                value={formData.dobMonth}
                onChange={handleChange}
                className={inputClassName}
                required
              >
                <option value="">Select</option>
                {months.map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Day <span className="text-red-600">*</span>
              </label>
              <select
                name="dobDay"
                value={formData.dobDay}
                onChange={handleChange}
                className={inputClassName}
                required
              >
                <option value="">Select</option>
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Year <span className="text-red-600">*</span>
              </label>
              <select
                name="dobYear"
                value={formData.dobYear}
                onChange={handleChange}
                className={inputClassName}
                required
              >
                <option value="">Select</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Application Details Section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 bg-gray-100 px-3 py-2 rounded">
            Application Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Reason for Application <span className="text-red-600">*</span>
              </label>
              <select
                name="reasonForApplication"
                value={formData.reasonForApplication}
                onChange={handleChange}
                className={inputClassName}
                required
              >
                <option value="">Select Reason</option>
                {APPLICATION_REASONS.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Additional Information
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows={4}
                className={inputClassName}
                placeholder="Please provide any additional information relevant to your application..."
              />
            </div>
          </div>
        </div>

        {/* CAPTCHA Section */}
        <div className="mb-8">
          <CaptchaChallenge 
            onSolved={() => setCaptchaSolved(true)}
            solved={captchaSolved}
          />
        </div>

        {/* Terms Acceptance */}
        <div className="mb-6">
          <div className={`p-4 rounded-lg ${termsAccepted ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border-2 border-gray-300'}`}>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-5 h-5"
                disabled
              />
              <span className="text-sm text-gray-700">
                {termsAccepted 
                  ? '✓ You have accepted the Terms and Conditions'
                  : 'Terms and Conditions acceptance required (will appear during form completion)'}
              </span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={sessionExpired || !captchaSolved || !termsAccepted}
            className={`px-8 py-3 rounded-lg font-bold text-lg transition-colors ${
              sessionExpired || !captchaSolved || !termsAccepted
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-900 text-white hover:bg-blue-800 cursor-pointer'
            }`}
          >
            Submit Application
          </button>
        </div>
      </form>
    </>
  );
}
