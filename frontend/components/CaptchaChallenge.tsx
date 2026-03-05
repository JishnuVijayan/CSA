'use client';

import { useState, useEffect } from 'react';
import { CaptchaChallengeProps } from '@/lib/types';
import { Shield, CheckCircle, XCircle } from 'lucide-react';

export default function CaptchaChallenge({ onSolved, solved }: CaptchaChallengeProps) {
  const [question, setQuestion] = useState({ num1: 0, num2: 0, answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    // Generate random addition problem on mount
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    setQuestion({ num1, num2, answer: num1 + num2 });
  }, []);

  const handleVerify = () => {
    const answer = parseInt(userAnswer);
    
    if (answer === question.answer) {
      setFeedback('correct');
      onSolved();
    } else {
      setFeedback('incorrect');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleVerify();
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
            What is {question.num1} + {question.num2}?
          </div>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => {
              setUserAnswer(e.target.value);
              setFeedback(null);
            }}
            onKeyPress={handleKeyPress}
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
