'use client';

import { useState } from 'react';
import { TermsModalProps } from '@/lib/types';
import { FileText, ArrowDown } from 'lucide-react';

export default function TermsModal({ isOpen, onAccept }: TermsModalProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  if (!isOpen) return null;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 10;
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="bg-blue-900 text-white px-6 py-4 rounded-t-lg flex items-center gap-3">
          <FileText size={24} />
          <h2 className="text-xl font-bold">Terms and Conditions</h2>
        </div>
        
        <div 
          className="flex-1 overflow-y-auto px-6 py-4 space-y-4 text-gray-700"
          onScroll={handleScroll}
        >
          <p className="font-semibold text-gray-900">
            Please read and accept the following terms and conditions to continue with your application.
          </p>
          
          <h3 className="font-bold text-gray-900 mt-4">1. Acceptance of Terms</h3>
          <p>
            By accessing and using this State Portal, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these terms, you must not use this portal.
          </p>

          <h3 className="font-bold text-gray-900 mt-4">2. User Responsibilities</h3>
          <p>
            You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>

          <h3 className="font-bold text-gray-900 mt-4">3. Information Accuracy</h3>
          <p>
            You certify that all information provided in your application is true, accurate, and complete to the best of your knowledge. Providing false or misleading information may result in denial of services and potential legal consequences.
          </p>

          <h3 className="font-bold text-gray-900 mt-4">4. Privacy and Data Collection</h3>
          <p>
            We collect and process personal information in accordance with applicable privacy laws. Your information will be used solely for the purpose of processing your application and providing government services. We do not sell or share your personal information with third parties except as required by law.
          </p>

          <h3 className="font-bold text-gray-900 mt-4">5. Service Availability</h3>
          <p>
            While we strive to maintain continuous service availability, we do not guarantee that the portal will be available at all times. We reserve the right to suspend or terminate services for maintenance, updates, or other operational reasons without prior notice.
          </p>

          <h3 className="font-bold text-gray-900 mt-4">6. Limitation of Liability</h3>
          <p>
            The State Portal and its services are provided "as is" without warranties of any kind. We shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of this portal.
          </p>

          <h3 className="font-bold text-gray-900 mt-4">7. Modifications to Terms</h3>
          <p>
            We reserve the right to modify these terms and conditions at any time. Continued use of the portal after changes constitutes acceptance of the modified terms.
          </p>

          <h3 className="font-bold text-gray-900 mt-4">8. Governing Law</h3>
          <p>
            These terms shall be governed by and construed in accordance with the laws of the State, without regard to its conflict of law provisions.
          </p>

          <h3 className="font-bold text-gray-900 mt-4">9. Contact Information</h3>
          <p>
            If you have any questions about these Terms and Conditions, please contact the Department of Administrative Services at the address provided on our contact page.
          </p>

          <p className="font-semibold text-gray-900 mt-6 pb-4">
            By clicking "Accept" below, you acknowledge that you have read and agree to these Terms and Conditions.
          </p>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-lg">
          {!hasScrolledToBottom && (
            <div className="flex items-center gap-2 text-amber-700 text-sm mb-3 animate-bounce">
              <ArrowDown size={16} />
              <span>Please scroll to the bottom to accept</span>
            </div>
          )}
          <button
            onClick={onAccept}
            disabled={!hasScrolledToBottom}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              hasScrolledToBottom
                ? 'bg-blue-900 text-white hover:bg-blue-800 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {hasScrolledToBottom ? 'Accept Terms and Continue' : 'Scroll to Bottom to Accept'}
          </button>
        </div>
      </div>
    </div>
  );
}
