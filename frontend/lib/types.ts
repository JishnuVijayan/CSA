export interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  ssn: string;
  email: string;
  phone: string;
  streetAddress: string;
  apartmentUnit: string;
  city: string;
  state: string;
  zipCode: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  reasonForApplication: string;
  additionalInfo: string;
}

export interface NewsTickerProps {
  messages: string[];
  speed?: number;
}

export interface CaptchaChallengeProps {
  onSolved: () => void;
  solved: boolean;
}

export interface TermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onClose: () => void;
}

export interface SessionTimerProps {
  onExpire: () => void;
  initialSeconds?: number;
}

export interface SessionExpiredOverlayProps {
  isVisible: boolean;
}

export interface ErrorSummaryProps {
  errors: Record<string, string>;
}

export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export const APPLICATION_REASONS = [
  'New Application',
  'Renewal',
  'Replacement',
  'Address Change',
  'Name Change',
  'Duplicate',
  'Other'
];
