'use client';

import { useState } from 'react';
import { Shield, CheckCircle, XCircle } from 'lucide-react';

type CaptchaType = 'addition' | 'subtraction' | 'multiplication' | 'text' | 'pattern';

interface HumanVerificationProps {
  onVerified: () => void;
  captchaType: CaptchaType;
}

export default function HumanVerification({ onVerified, captchaType }: HumanVerificationProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [question, setQuestion] = useState(() => generateQuestion(captchaType));

  function generateQuestion(type: CaptchaType) {
    switch (type) {
      case 'addition': {
        const num1 = Math.floor(Math.random() * 20) + 1;
        const num2 = Math.floor(Math.random() * 20) + 1;
        return {
          text: `What is ${num1} + ${num2}?`,
          answer: (num1 + num2).toString()
        };
      }
      case 'subtraction': {
        const num1 = Math.floor(Math.random() * 30) + 20;
        const num2 = Math.floor(Math.random() * 15) + 1;
        return {
          text: `What is ${num1} - ${num2}?`,
          answer: (num1 - num2).toString()
        };
      }
      case 'multiplication': {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        return {
          text: `What is ${num1} × ${num2}?`,
          answer: (num1 * num2).toString()
        };
      }
      case 'text': {
        const words = ['PORTAL', 'SECURE', 'VERIFY', 'ACCESS', 'SYSTEM'];
        const word = words[Math.floor(Math.random() * words.length)];
        return {
          text: `Type the word: ${word}`,
          answer: word
        };
      }
      case 'pattern': {
        const patterns = [
          { text: 'Select the 3rd character: ABCDEFGH', answer: 'C' },
          { text: 'What comes after 5? (1, 3, 5, ?, 9)', answer: '7' },
          { text: 'Complete: A, B, C, ?', answer: 'D' },
          { text: 'How many letters in PORTAL?', answer: '6' }
        ];
        return patterns[Math.floor(Math.random() * patterns.length)];
      }
      default:
        return { text: 'Error', answer: '' };
    }
  }

  const handleVerify = () => {
    if (userAnswer.trim().toUpperCase() === question.answer.toUpperCase()) {
      setFeedback('correct');
      setTimeout(() => {
        onVerified();
      }, 1000);
    } else {
      setFeedback('incorrect');
      setTimeout(() => {
        setFeedback(null);
        setUserAnswer('');
        setQuestion(generateQuestion(captchaType));
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleVerify();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-100 rounded-full p-4">
            <Shield className="text-blue-900" size={48} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Human Verification Required
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Please complete the security challenge below to access this service
        </p>

        <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Security Challenge:
          </label>
          <div className="text-lg font-bold text-gray-900 mb-4">
            {question.text}
          </div>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => {
              setUserAnswer(e.target.value);
              setFeedback(null);
            }}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-lg"
            placeholder="Enter your answer"
            autoFocus
          />
        </div>

        {feedback === 'correct' && (
          <div className="flex items-center gap-2 text-green-600 mb-4 bg-green-50 p-3 rounded">
            <CheckCircle size={20} />
            <span className="font-semibold">Correct! Redirecting...</span>
          </div>
        )}

        {feedback === 'incorrect' && (
          <div className="flex items-center gap-2 text-red-600 mb-4 bg-red-50 p-3 rounded">
            <XCircle size={20} />
            <span className="font-semibold">Incorrect. Please try again.</span>
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={!userAnswer.trim() || feedback === 'correct'}
          className={`w-full py-3 rounded-lg font-bold text-lg transition-colors ${
            !userAnswer.trim() || feedback === 'correct'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-900 text-white hover:bg-blue-800 cursor-pointer'
          }`}
        >
          {feedback === 'correct' ? 'Verified ✓' : 'Verify'}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          This verification helps us ensure you are a human user
        </p>
      </div>
    </div>
  );
}
