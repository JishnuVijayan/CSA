// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  applications: `${API_URL}/applications`,
  applicationStatus: (refNumber: string) => `${API_URL}/applications/status/${refNumber}`,
  updateStatus: (refNumber: string) => `${API_URL}/applications/status/${refNumber}`,
};
