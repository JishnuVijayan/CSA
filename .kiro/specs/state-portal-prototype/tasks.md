# Implementation Plan: State Portal Prototype

## Overview

This implementation plan breaks down the State Portal Prototype into discrete coding tasks. The application will be built incrementally, starting with project setup, then core components, friction features, and finally integration and testing. Each task builds on previous work to create a fully functional government-style portal with intentional usability challenges.

## Tasks

- [x] 1. Initialize Next.js project with dependencies
  - Create Next.js project in `frontend/` folder using App Router
  - Install dependencies: Tailwind CSS, Lucide-React, Zod, TypeScript
  - Configure Tailwind CSS and global styles
  - Set up TypeScript configuration
  - Create basic project structure (app/, components/, lib/ folders)
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 2. Create type definitions and validation schemas
  - Create `lib/types.ts` with FormData interface and component prop types
  - Create `lib/validation.ts` with Zod schema for form validation
  - Define constants for US states and application reasons
  - _Requirements: 8.3, 4.3, 4.4_

- [ ] 3. Implement Header and NewsTicker components
  - [x] 3.1 Create Header component with government portal styling
    - Build header layout with branding area
    - Style with official government aesthetics
    - _Requirements: 1.1, 1.2_
  
  - [x] 3.2 Create NewsTicker component with CSS animation
    - Implement horizontal scrolling animation using CSS keyframes
    - Duplicate content for seamless looping
    - Add sample news messages
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [ ]* 3.3 Write property test for news ticker animation
    - **Property 10: News ticker animates continuously**
    - **Validates: Requirements 2.1, 2.2**

- [x] 4. Implement Sidebar component
  - Create Sidebar component with navigation links
  - Add at least 5 redundant navigation links
  - Style with government portal aesthetics
  - Position adjacent to main content area
  - _Requirements: 1.2, 3.1, 3.3_

- [ ] 5. Implement SessionTimer and SessionExpiredOverlay components
  - [x] 5.1 Create SessionTimer component with countdown logic
    - Implement countdown starting at 10 minutes (600 seconds)
    - Use setInterval to decrement every second
    - Format display as MM:SS
    - Position in corner of interface
    - Call onExpire callback when reaching zero
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [x] 5.2 Create SessionExpiredOverlay component
    - Build full-screen overlay with high z-index
    - Display "Session Expired" message
    - Add "Refresh Page" button
    - _Requirements: 7.4_
  
  - [ ]* 5.3 Write property test for timer decrement
    - **Property 5: Session timer decrements continuously**
    - **Validates: Requirements 7.2**
  
  - [ ]* 5.4 Write property test for session expiration trigger
    - **Property 6: Session expiration triggers overlay**
    - **Validates: Requirements 7.4**

- [ ] 6. Implement CaptchaChallenge component
  - [x] 6.1 Create CaptchaChallenge component with arithmetic question
    - Generate random addition problem on mount (numbers 1-20)
    - Display question to user
    - Validate user answer against correct answer
    - Call onSolved callback when correct
    - Show feedback for incorrect answers
    - _Requirements: 5.1, 5.2, 5.3, 5.5_
  
  - [ ]* 6.2 Write property test for CAPTCHA validation
    - **Property 1: CAPTCHA validation controls submit button state**
    - **Validates: Requirements 5.2, 5.3**
  
  - [ ]* 6.3 Write property test for CAPTCHA question generation
    - **Property 11: CAPTCHA question changes on reload**
    - **Validates: Requirements 5.5**

- [ ] 7. Implement TermsModal component
  - [x] 7.1 Create TermsModal component with scroll detection
    - Build modal overlay with scrollable content area
    - Add terms and conditions text (sufficient length to require scrolling)
    - Implement scroll position tracking
    - Enable accept button only when scrolled to bottom
    - Call onAccept callback when accept button clicked
    - Prevent modal dismissal without accepting
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 7.2 Write property test for scroll-based button state
    - **Property 2: Terms modal scroll position controls accept button state**
    - **Validates: Requirements 6.3, 6.4**
  
  - [ ]* 7.3 Write property test for modal close behavior
    - **Property 4: Terms modal closes on accept**
    - **Validates: Requirements 6.5**

- [x] 8. Implement ErrorSummary component
  - Create ErrorSummary component
  - Display errors as list at top of form
  - Style with alert/warning colors
  - Implement scroll-into-view behavior
  - Only render when errors exist
  - _Requirements: 8.2, 8.4_

- [ ] 9. Implement PortalForm component
  - [x] 9.1 Create PortalForm component with all form fields
    - Set up form state for all 15+ fields (personal info, address, DOB, application details)
    - Create text inputs for firstName, middleName, lastName, SSN, email, phone
    - Create address fields: streetAddress, apartmentUnit, city, state (dropdown), zipCode
    - Create three separate dropdowns for DOB: day, month, year
    - Create dropdown for reasonForApplication
    - Create textarea for additionalInfo
    - Style form with government portal aesthetics
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  
  - [x] 9.2 Implement form field tracking and terms modal trigger
    - Track number of filled fields
    - Calculate percentage of form completion
    - Trigger terms modal when ~50% of fields are filled
    - _Requirements: 6.1_
  
  - [x] 9.3 Implement form validation and submission
    - Integrate Zod schema validation
    - Validate form on submit attempt
    - Display errors in ErrorSummary component
    - Prevent submission if validation fails
    - Prevent submission if CAPTCHA not solved
    - Prevent submission if terms not accepted
    - Prevent submission if session expired
    - _Requirements: 8.1, 8.5_
  
  - [ ]* 9.4 Write property test for terms modal triggering
    - **Property 3: Terms modal triggers at form midpoint**
    - **Validates: Requirements 6.1**
  
  - [ ]* 9.5 Write property test for incomplete form validation
    - **Property 8: Incomplete forms prevent submission**
    - **Validates: Requirements 8.1, 8.5**
  
  - [ ]* 9.6 Write property test for validation error display
    - **Property 9: Validation errors display comprehensively**
    - **Validates: Requirements 8.2, 8.4**
  
  - [ ]* 9.7 Write property test for session expiration blocking submission
    - **Property 7: Session expiration prevents submission**
    - **Validates: Requirements 7.5**
  
  - [ ]* 9.8 Write property test for no persistent storage
    - **Property 12: No persistent data storage**
    - **Validates: Requirements 10.3**

- [ ] 10. Integrate all components in main page
  - [x] 10.1 Create app/page.tsx with complete layout
    - Import and render Header with NewsTicker
    - Import and render Sidebar
    - Import and render PortalForm with all child components
    - Import and render SessionTimer with expiration handler
    - Import and render SessionExpiredOverlay with visibility control
    - Wire up all component interactions and callbacks
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [x] 10.2 Configure app/layout.tsx and globals.css
    - Set up root layout with proper HTML structure
    - Import Tailwind directives in globals.css
    - Add any custom global styles
    - _Requirements: 1.5_

- [x] 11. Checkpoint - Ensure all tests pass
  - Run all unit tests and property tests
  - Verify all components render correctly
  - Test complete user flow manually
  - Ensure all friction features work as expected
  - Ask the user if questions arise

- [ ]* 12. Write integration tests
  - Test complete form submission flow
  - Test session expiration during form filling
  - Test terms modal appearance and acceptance
  - Test CAPTCHA solving and form submission
  - Test validation error display and correction
  - _Requirements: 1.1, 4.1, 5.1, 6.1, 7.1, 8.1_

- [x] 13. Final checkpoint - Verify all requirements
  - Ensure all 15+ form fields are present and functional
  - Verify news ticker animates continuously
  - Verify sidebar has redundant links
  - Verify CAPTCHA blocks submission until solved
  - Verify terms modal appears at form midpoint
  - Verify session timer counts down and expires
  - Verify validation errors display at top of form
  - Ensure all tests pass
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests should run minimum 100 iterations each
- All components use TypeScript for type safety
- All styling uses Tailwind CSS utility classes
- No backend or API calls required - all client-side
- Project is created in `frontend/` folder at workspace root
