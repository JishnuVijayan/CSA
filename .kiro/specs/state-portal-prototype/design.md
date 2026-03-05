# Design Document: State Portal Prototype

## Overview

The State Portal Prototype is a Next.js application that simulates a high-friction government website interface. The application is built as a single-page application using the Next.js App Router, with all state managed client-side using React hooks. The design intentionally incorporates usability challenges common to government portals to serve as a test bed for web automation tools.

The application consists of several key components:
- A persistent header with an animated news ticker
- A sidebar with redundant navigation links
- A main form area with 15+ input fields
- Interactive friction elements (CAPTCHA, terms modal, session timer)
- Client-side validation with error summary display

## Architecture

### Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide-React
- **Validation**: Zod
- **State Management**: React hooks (useState, useEffect, useRef)
- **Language**: TypeScript

### Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with global styles
│   ├── page.tsx            # Main portal page
│   └── globals.css         # Tailwind directives
├── components/
│   ├── Header.tsx          # Header with news ticker
│   ├── NewsTicker.tsx      # Animated news ticker component
│   ├── Sidebar.tsx         # Navigation sidebar
│   ├── PortalForm.tsx      # Main form component
│   ├── CaptchaChallenge.tsx # CAPTCHA logic puzzle
│   ├── TermsModal.tsx      # Terms and conditions modal
│   ├── SessionTimer.tsx    # Countdown timer
│   ├── ErrorSummary.tsx    # Validation error display
│   └── SessionExpiredOverlay.tsx # Session timeout overlay
├── lib/
│   ├── validation.ts       # Zod schemas
│   └── types.ts            # TypeScript type definitions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

### Component Hierarchy

```
page.tsx
├── Header
│   └── NewsTicker
├── Sidebar
├── PortalForm
│   ├── ErrorSummary
│   ├── [Form Fields]
│   ├── CaptchaChallenge
│   └── TermsModal
├── SessionTimer
└── SessionExpiredOverlay
```

## Components and Interfaces

### 1. Header Component

**Purpose**: Displays the portal header with branding and animated news ticker.

**Props**: None

**State**: None

**Behavior**:
- Renders a fixed or sticky header at the top of the page
- Contains the NewsTicker component
- Styled to resemble government website headers (official colors, seals, etc.)

### 2. NewsTicker Component

**Purpose**: Displays continuously scrolling news updates.

**Props**:
```typescript
interface NewsTickerProps {
  messages: string[];
  speed?: number; // pixels per second
}
```

**State**:
- `currentOffset: number` - Current horizontal scroll position

**Behavior**:
- Uses CSS animations or requestAnimationFrame for smooth scrolling
- Loops infinitely by duplicating content
- Messages scroll from right to left continuously

**Implementation Approach**:
- Use CSS `@keyframes` with `animation: scroll` for performance
- Duplicate message content to create seamless loop
- Calculate animation duration based on content width

### 3. Sidebar Component

**Purpose**: Displays redundant navigation links typical of government portals.

**Props**: None

**State**: None

**Behavior**:
- Renders a vertical list of navigation links
- Links are non-functional (href="#" or onClick preventDefault)
- Includes redundant categories like "Home", "Services", "About", "Contact", "FAQ", "Help", "Resources"
- Styled with government portal aesthetics

### 4. PortalForm Component

**Purpose**: Main form component managing all form state and orchestrating child components.

**Props**: None

**State**:
```typescript
interface FormState {
  // Personal Information
  firstName: string;
  middleName: string;
  lastName: string;
  ssn: string;
  email: string;
  phone: string;
  
  // Address
  streetAddress: string;
  apartmentUnit: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Date of Birth
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  
  // Application Details
  reasonForApplication: string;
  additionalInfo: string;
  
  // UI State
  termsAccepted: boolean;
  showTermsModal: boolean;
  captchaAnswer: string;
  captchaSolved: boolean;
  errors: Record<string, string>;
  touchedFields: Set<string>;
}
```

**Behavior**:
- Manages all form field values
- Tracks which fields have been touched/filled
- Triggers TermsModal when approximately 50% of fields are filled
- Validates form on submit using Zod schema
- Displays ErrorSummary when validation fails
- Prevents submission until CAPTCHA is solved and terms are accepted

**Field Tracking Logic**:
- Count total required fields (15+)
- Track number of non-empty fields
- When filled fields >= 50% and termsAccepted === false, show TermsModal

### 5. CaptchaChallenge Component

**Purpose**: Presents a simple arithmetic challenge that must be solved before form submission.

**Props**:
```typescript
interface CaptchaChallengeProps {
  onSolved: () => void;
  solved: boolean;
}
```

**State**:
- `question: { num1: number, num2: number, answer: number }` - Current challenge
- `userAnswer: string` - User's input

**Behavior**:
- Generates random addition problem on mount (e.g., "What is 5 + 7?")
- Validates user input against correct answer
- Calls `onSolved()` when correct answer is entered
- Displays feedback for incorrect answers
- Numbers range from 1-20 for simplicity

### 6. TermsModal Component

**Purpose**: Displays terms and conditions that require scrolling to accept.

**Props**:
```typescript
interface TermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onClose: () => void;
}
```

**State**:
- `hasScrolledToBottom: boolean` - Whether user has scrolled to end
- `scrollPosition: number` - Current scroll position

**Behavior**:
- Renders as a modal overlay when `isOpen` is true
- Contains scrollable content area with terms text
- Monitors scroll position using `onScroll` event
- Enables "Accept" button only when user has scrolled to bottom
- Calls `onAccept()` when accept button is clicked
- Prevents closing modal without accepting (no X button or backdrop click)

**Scroll Detection**:
```typescript
const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  const element = e.currentTarget;
  const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 10;
  setHasScrolledToBottom(isAtBottom);
};
```

### 7. SessionTimer Component

**Purpose**: Displays countdown timer and triggers session expiration.

**Props**:
```typescript
interface SessionTimerProps {
  onExpire: () => void;
  initialSeconds?: number; // default 600 (10 minutes)
}
```

**State**:
- `secondsRemaining: number` - Current countdown value

**Behavior**:
- Starts countdown on component mount
- Decrements every second using `setInterval`
- Displays time in MM:SS format
- Calls `onExpire()` when countdown reaches 0
- Cleans up interval on unmount
- Positioned in top-right or bottom-right corner

**Display Format**:
```typescript
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
```

### 8. SessionExpiredOverlay Component

**Purpose**: Displays full-screen overlay when session expires.

**Props**:
```typescript
interface SessionExpiredOverlayProps {
  isVisible: boolean;
}
```

**State**: None

**Behavior**:
- Renders full-screen overlay when `isVisible` is true
- Displays "Session Expired" message
- Provides "Refresh Page" button to reload
- Prevents interaction with underlying form
- Uses high z-index to cover all content

### 9. ErrorSummary Component

**Purpose**: Displays validation errors at the top of the form.

**Props**:
```typescript
interface ErrorSummaryProps {
  errors: Record<string, string>;
}
```

**State**: None

**Behavior**:
- Renders only when errors object is not empty
- Displays each error as a list item
- Styled with alert/warning colors (red background, border)
- Positioned at top of form, above all fields
- Scrolls into view when errors appear

## Data Models

### FormData Type

```typescript
interface FormData {
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
```

### Validation Schema

```typescript
import { z } from 'zod';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  ssn: z.string().regex(/^\d{3}-?\d{2}-?\d{4}$/, 'Invalid SSN format'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{3}-?\d{3}-?\d{4}$/, 'Invalid phone number'),
  streetAddress: z.string().min(1, 'Street address is required'),
  apartmentUnit: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  dobDay: z.string().min(1, 'Day is required'),
  dobMonth: z.string().min(1, 'Month is required'),
  dobYear: z.string().min(1, 'Year is required'),
  reasonForApplication: z.string().min(1, 'Reason is required'),
  additionalInfo: z.string().optional(),
}).refine((data) => {
  // Validate date of birth is a valid date
  const day = parseInt(data.dobDay);
  const month = parseInt(data.dobMonth);
  const year = parseInt(data.dobYear);
  const date = new Date(year, month - 1, day);
  return date.getDate() === day && date.getMonth() === month - 1;
}, {
  message: 'Invalid date of birth',
  path: ['dobDay'],
});
```

### State Options

```typescript
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];
```

### Application Reasons

```typescript
const APPLICATION_REASONS = [
  'New Application',
  'Renewal',
  'Replacement',
  'Address Change',
  'Name Change',
  'Duplicate',
  'Other'
];
```



## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: CAPTCHA validation controls submit button state

*For any* CAPTCHA answer input, the submit button should be enabled if and only if the answer is correct.

**Validates: Requirements 5.2, 5.3**

### Property 2: Terms modal scroll position controls accept button state

*For any* scroll position within the terms modal, the accept button should be enabled if and only if the user has scrolled to the bottom of the content.

**Validates: Requirements 6.3, 6.4**

### Property 3: Terms modal triggers at form midpoint

*For any* form filling sequence, when approximately 50% of required fields are filled, the terms modal should appear automatically.

**Validates: Requirements 6.1**

### Property 4: Terms modal closes on accept

*For any* terms modal state, clicking the accept button (when enabled) should close the modal and allow form completion to continue.

**Validates: Requirements 6.5**

### Property 5: Session timer decrements continuously

*For any* time interval after the timer starts, the displayed time should be less than the initial value and should continue decreasing until it reaches zero.

**Validates: Requirements 7.2**

### Property 6: Session expiration triggers overlay

*For any* session timer state, when the timer reaches zero, the session expired overlay should be displayed.

**Validates: Requirements 7.4**

### Property 7: Session expiration prevents submission

*For any* form state, when the session expired overlay is visible, form submission should be prevented.

**Validates: Requirements 7.5**

### Property 8: Incomplete forms prevent submission

*For any* form data with missing required fields, attempting to submit should be prevented and validation should fail.

**Validates: Requirements 8.1, 8.5**

### Property 9: Validation errors display comprehensively

*For any* form data that fails validation, all fields that failed validation should be listed in the error summary at the top of the page.

**Validates: Requirements 8.2, 8.4**

### Property 10: News ticker animates continuously

*For any* time interval after page load, the news ticker should be animating without requiring user interaction.

**Validates: Requirements 2.1, 2.2**

### Property 11: CAPTCHA question changes on reload

*For any* two consecutive page loads, the CAPTCHA question should be different (different numbers in the arithmetic problem).

**Validates: Requirements 5.5**

### Property 12: No persistent data storage

*For any* form interaction, no data should be persisted to localStorage, sessionStorage, or any other persistent storage mechanism.

**Validates: Requirements 10.3**

## Error Handling

### Validation Errors

**Strategy**: Use Zod schema validation to catch all input errors before submission.

**Error Types**:
- Missing required fields
- Invalid format (email, phone, SSN, ZIP code)
- Invalid date of birth (non-existent dates)

**Error Display**:
- All errors displayed in ErrorSummary component at top of form
- Error summary scrolls into view when validation fails
- Each error message includes field name and specific issue
- Form submission is blocked until all errors are resolved

### Session Expiration

**Strategy**: Graceful degradation with clear user feedback.

**Behavior**:
- Timer provides advance warning (10 minutes)
- When expired, overlay prevents all form interaction
- User must refresh page to restart session
- No data recovery mechanism (intentional friction)

### CAPTCHA Failures

**Strategy**: Inline feedback with retry capability.

**Behavior**:
- Incorrect answers display error message
- User can retry unlimited times
- Submit button remains disabled until correct answer
- No lockout or rate limiting (client-side only)

### Terms Modal

**Strategy**: Forced interaction with clear requirements.

**Behavior**:
- Modal cannot be dismissed without accepting
- Accept button clearly indicates scroll requirement
- No escape hatch (no X button, no backdrop click)
- User must scroll to bottom to proceed

## Testing Strategy

### Dual Testing Approach

The State Portal Prototype will use both unit tests and property-based tests to ensure comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, component rendering, and user interactions
- **Property tests**: Verify universal properties across randomized inputs and state variations

### Unit Testing

**Framework**: Jest with React Testing Library

**Focus Areas**:
- Component rendering (all components render without errors)
- Specific user interactions (button clicks, form input, scrolling)
- Edge cases (empty inputs, boundary values, timer at zero)
- Integration between components (form triggers modal, timer triggers overlay)

**Example Unit Tests**:
- Header renders with news ticker
- Sidebar contains at least 5 links
- Form contains at least 15 input fields
- CAPTCHA displays an arithmetic question
- Terms modal has scrollable content
- Session timer starts at 10:00
- Error summary displays when validation fails

### Property-Based Testing

**Framework**: fast-check (for TypeScript/JavaScript)

**Configuration**: Minimum 100 iterations per property test

**Test Tagging**: Each property test must include a comment referencing the design property:
```typescript
// Feature: state-portal-prototype, Property 1: CAPTCHA validation controls submit button state
```

**Focus Areas**:
- CAPTCHA validation with random correct/incorrect answers
- Terms modal scroll behavior with random scroll positions
- Form validation with random incomplete/invalid data
- Timer behavior with random time intervals
- Modal triggering with random form completion percentages

**Example Property Tests**:

1. **Property 1 Test**: Generate random CAPTCHA answers (both correct and incorrect), verify submit button state matches correctness
2. **Property 2 Test**: Generate random scroll positions in terms modal, verify accept button state matches scroll-to-bottom condition
3. **Property 8 Test**: Generate random form data with various missing required fields, verify submission is prevented
4. **Property 9 Test**: Generate random invalid form data, verify all validation errors appear in error summary
5. **Property 11 Test**: Generate multiple page loads, verify CAPTCHA questions differ

### Testing Balance

- Unit tests handle specific examples and component integration
- Property tests handle comprehensive input coverage through randomization
- Both are necessary and complementary for full coverage
- Avoid writing too many unit tests for scenarios covered by property tests
- Focus unit tests on concrete examples and edge cases
- Focus property tests on universal rules and randomized inputs
