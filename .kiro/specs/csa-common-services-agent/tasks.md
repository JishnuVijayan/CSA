# Implementation Plan: CSA (Common Services Agent)

## Overview

This implementation plan breaks down the CSA system into discrete, incremental coding tasks. The approach follows a bottom-up strategy: core infrastructure → individual services → integration → testing. Each task builds on previous work, ensuring no orphaned code.

The system will be implemented using:
- **Backend**: TypeScript with Node.js and FastAPI (Python for Vision AI)
- **Frontend**: React with TypeScript
- **Infrastructure**: Docker, Kubernetes, PostgreSQL, Redis, RabbitMQ
- **Testing**: Jest for unit tests, fast-check for property-based tests

## Tasks

- [ ] 1. Set up project structure and core infrastructure
  - Create monorepo structure with backend services, frontend apps, and shared libraries
  - Set up TypeScript configuration with strict mode
  - Configure Docker Compose for local development (PostgreSQL, Redis, RabbitMQ)
  - Set up ESLint, Prettier, and Husky for code quality
  - Create shared types package for cross-service interfaces
  - _Requirements: All (foundational)_

- [ ] 2. Implement data layer and core models
  - [ ] 2.1 Create PostgreSQL schema and migrations
    - Define tables: citizens, service_requests, documents, jan_rover_tasks, gig_workers, vle_licenses, proactive_reminders, agent_skills, payments, audit_logs
    - Set up Prisma ORM with schema definitions
    - Create initial migration scripts
    - _Requirements: 15.1, 18.1, 18.2_
  
  - [ ] 2.2 Implement Redis session manager
    - Create SessionManager class with create, get, update, expire methods
    - Implement context storage with 24-hour TTL
    - Add LRU eviction policy configuration
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_
  
  - [ ]* 2.3 Write property test for session lifecycle
    - **Property 62: Session Lifecycle Management**
    - **Validates: Requirements 20.1, 20.2, 20.5**
  
  - [ ]* 2.4 Write property test for session context retrieval
    - **Property 63: Session Context Retrieval**
    - **Validates: Requirements 20.3, 20.4**

- [ ] 3. Implement messaging gateway (OpenClaw Agent integration)
  - [ ] 3.1 Create MessagingGateway service
    - Implement WhatsApp Business API webhook handlers
    - Implement Telegram Bot API webhook handlers
    - Create message queue publisher (RabbitMQ)
    - Add voice transcription using Google Speech-to-Text
    - _Requirements: 1.1, 1.2, 1.3, 1.5_
  
  - [ ] 3.2 Implement multi-language support
    - Integrate language detection library
    - Create translation service wrapper
    - Support Hindi, English, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi
    - _Requirements: 1.4, 14.1, 14.2, 14.3, 14.5_
  
  - [ ]* 3.3 Write property test for voice message transcription
    - **Property 1: Voice Message Transcription**
    - **Validates: Requirements 1.3**
  
  - [ ]* 3.4 Write property test for response consistency
    - **Property 2: Response Consistency**
    - **Validates: Requirements 1.4, 1.5**
  
  - [ ]* 3.5 Write property test for language detection and consistency
    - **Property 43: Language Detection and Consistency**
    - **Validates: Requirements 14.1, 14.2**
  
  - [ ]* 3.6 Write property test for multi-language support
    - **Property 45: Multi-Language Support**
    - **Validates: Requirements 14.5**

- [ ] 4. Implement Vision AI service
  - [ ] 4.1 Create Vision AI service with OCR capabilities
    - Integrate Google Cloud Vision API or AWS Textract
    - Implement extractText, extractStructuredData methods
    - Add support for Indian document types (Aadhaar, PAN, driving license, etc.)
    - _Requirements: 2.1, 2.4_
  
  - [ ] 4.2 Implement image enhancement pipeline
    - Add deskew, denoise, and enhance functions using Sharp or Jimp
    - Create quality assessment logic
    - Implement automatic enhancement trigger for poor quality images
    - _Requirements: 2.2_
  
  - [ ] 4.3 Implement image compression
    - Create compressImage function with configurable size limits
    - Maintain readability while reducing file size
    - Support multiple output formats (JPEG, PNG, PDF)
    - _Requirements: 2.3_
  
  - [ ] 4.4 Add document validation
    - Implement field format validators (Aadhaar format, PAN format, etc.)
    - Create validation result structure with issues and suggestions
    - _Requirements: 2.4_
  
  - [ ]* 4.5 Write property test for document OCR extraction
    - **Property 3: Document OCR Extraction**
    - **Validates: Requirements 2.1**
  
  - [ ]* 4.6 Write property test for image enhancement pipeline
    - **Property 4: Image Enhancement Pipeline**
    - **Validates: Requirements 2.2**
  
  - [ ]* 4.7 Write property test for document compression
    - **Property 5: Document Compression**
    - **Validates: Requirements 2.3**
  
  - [ ]* 4.8 Write property test for extracted data validation
    - **Property 6: Extracted Data Validation**
    - **Validates: Requirements 2.4**
  
  - [ ]* 4.9 Write property test for processing failure recovery
    - **Property 7: Processing Failure Recovery**
    - **Validates: Requirements 2.5**

- [ ] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement browser automation service
  - [ ] 6.1 Create Docker container management
    - Implement container pool with Chrome headless
    - Create BrowserSession lifecycle management (create, connect, terminate)
    - Add 30-minute timeout with automatic termination
    - Implement container reuse and cleanup
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ] 6.2 Implement CDP controller with Puppeteer
    - Create navigation methods (navigateToPortal, executeSkill)
    - Implement form interaction (fillForm, uploadDocument, submitForm)
    - Add screenshot capture for debugging
    - _Requirements: 3.1, 3.3, 3.4, 3.5_
  
  - [ ] 6.3 Integrate CAPTCHA solver
    - Implement CAPTCHA detection logic
    - Integrate CapSolver API
    - Add retry logic (up to 3 attempts)
    - Implement fallback to manual intervention
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [ ]* 6.4 Write property test for browser container lifecycle
    - **Property 27: Browser Container Lifecycle**
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4**
  
  - [ ]* 6.5 Write property test for container isolation
    - **Property 28: Container Isolation**
    - **Validates: Requirements 9.5**
  
  - [ ]* 6.6 Write property test for CAPTCHA detection and resolution
    - **Property 25: CAPTCHA Detection and Resolution**
    - **Validates: Requirements 8.1, 8.2, 8.3**
  
  - [ ]* 6.7 Write property test for CAPTCHA retry logic
    - **Property 26: CAPTCHA Retry Logic**
    - **Validates: Requirements 8.4, 8.5**

- [ ] 7. Implement AgentSkills registry
  - [ ] 7.1 Create AgentSkills data model and storage
    - Define AgentSkill interface with steps, selectors, and metadata
    - Implement PostgreSQL storage with versioning
    - Create skill CRUD operations
    - _Requirements: 4.2, 4.3, 4.4_
  
  - [ ] 7.2 Implement skill execution engine
    - Create step executor for navigate, click, input, select, upload, wait, verify actions
    - Add dynamic value injection using template expressions
    - Implement error handling with retry and fallback
    - Track success rates and completion times
    - _Requirements: 3.1, 4.1, 4.2_
  
  - [ ]* 7.3 Write property test for AgentSkills module selection
    - **Property 13: AgentSkills Module Selection**
    - **Validates: Requirements 4.2**
  
  - [ ]* 7.4 Write property test for unavailable skill handling
    - **Property 14: Unavailable Skill Handling**
    - **Validates: Requirements 4.3**
  
  - [ ]* 7.5 Write property test for navigation failure detection
    - **Property 15: Navigation Failure Detection**
    - **Validates: Requirements 4.4**

- [ ] 8. Implement authentication service
  - [ ] 8.1 Implement DigiLocker integration
    - Create OAuth 2.0 flow (initiateDigiLockerAuth, handleDigiLockerCallback)
    - Implement secure token storage with AWS KMS encryption
    - Add document retrieval (fetchDigiLockerDocument)
    - Implement fallback to manual upload on failure
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ] 8.2 Implement Aadhaar FaceRD integration
    - Integrate with UIDAI eKYC API
    - Implement selfie capture request flow
    - Add face verification with retry logic (up to 3 attempts)
    - Implement fallback to Jan-Rover on failure
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ] 8.3 Implement Jan-Rover dispatch system
    - Create geospatial worker matching (10km radius)
    - Implement task assignment and notification
    - Add task completion workflow with verification data
    - Handle no-worker-available scenario with queueing
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ]* 8.4 Write property test for DigiLocker authentication flow
    - **Property 16: DigiLocker Authentication Flow**
    - **Validates: Requirements 5.1, 5.2**
  
  - [ ]* 8.5 Write property test for DigiLocker document retrieval
    - **Property 17: DigiLocker Document Retrieval**
    - **Validates: Requirements 5.3, 5.4**
  
  - [ ]* 8.6 Write property test for DigiLocker fallback
    - **Property 18: DigiLocker Fallback**
    - **Validates: Requirements 5.5**
  
  - [ ]* 8.7 Write property test for Aadhaar FaceRD authentication flow
    - **Property 19: Aadhaar FaceRD Authentication Flow**
    - **Validates: Requirements 6.1, 6.2, 6.3**
  
  - [ ]* 8.8 Write property test for Aadhaar retry logic
    - **Property 20: Aadhaar Retry Logic**
    - **Validates: Requirements 6.4, 6.5**
  
  - [ ]* 8.9 Write property test for Jan-Rover worker discovery
    - **Property 21: Jan-Rover Worker Discovery**
    - **Validates: Requirements 7.1**
  
  - [ ]* 8.10 Write property test for Jan-Rover task assignment
    - **Property 22: Jan-Rover Task Assignment**
    - **Validates: Requirements 7.2, 7.3**

- [ ] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement payment service
  - [ ] 10.1 Create UPI payment integration
    - Integrate Razorpay or PhonePe UPI APIs
    - Implement payment link generation with QR code
    - Add webhook handler for payment verification
    - Implement payment failure handling with link regeneration
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_
  
  - [ ] 10.2 Implement VLE subscription management
    - Create subscription plans (basic, premium, enterprise)
    - Implement license verification and rate limit mapping
    - Add subscription lifecycle management
    - _Requirements: 17.5_
  
  - [ ]* 10.3 Write property test for UPI payment link generation
    - **Property 40: UPI Payment Link Generation**
    - **Validates: Requirements 13.1, 13.2**
  
  - [ ]* 10.4 Write property test for payment verification workflow
    - **Property 41: Payment Verification Workflow**
    - **Validates: Requirements 13.3, 13.4**
  
  - [ ]* 10.5 Write property test for payment failure handling
    - **Property 42: Payment Failure Handling**
    - **Validates: Requirements 13.5**

- [ ] 11. Implement NLU service and orchestration engine
  - [ ] 11.1 Create NLU service for intent recognition
    - Integrate LLM for natural language understanding
    - Implement intent classification (service types)
    - Add entity extraction (names, dates, document numbers)
    - Support multi-language input
    - _Requirements: 1.4, 3.1, 4.1_
  
  - [ ] 11.2 Implement orchestration engine core
    - Create workflow state machine
    - Implement ServiceRequest processing pipeline
    - Add workflow step execution with retry logic
    - Implement saga pattern for distributed transactions
    - Store workflow state in Redis, persist to PostgreSQL on completion
    - _Requirements: 3.1, 3.5, 16.2_
  
  - [ ] 11.3 Implement error handling and fallback chains
    - Add circuit breaker for external services
    - Implement retry with exponential backoff
    - Create fallback chains (auth, payment, portal navigation)
    - Add idempotency key handling
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_
  
  - [ ]* 11.4 Write property test for portal identification and navigation
    - **Property 8: Portal Identification and Navigation**
    - **Validates: Requirements 3.1**
  
  - [ ]* 11.5 Write property test for state determination
    - **Property 12: State Determination**
    - **Validates: Requirements 4.1**
  
  - [ ]* 11.6 Write property test for authentication fallback chain
    - **Property 52: Authentication Fallback Chain**
    - **Validates: Requirements 16.3, 16.5**

- [ ] 12. Implement proactive governance system
  - [ ] 12.1 Create reminder scheduling service
    - Implement expiry date storage and reminder scheduling
    - Create cron job for sending reminders 30 days before expiry
    - Add opt-out handling
    - _Requirements: 10.1, 10.2, 10.5_
  
  - [ ] 12.2 Implement auto-renewal workflow
    - Create auto-renewal initiation 15 days before expiry
    - Integrate with orchestration engine for renewal execution
    - Add completion notification
    - _Requirements: 10.3, 10.4_
  
  - [ ]* 12.3 Write property test for proactive reminder scheduling
    - **Property 29: Proactive Reminder Scheduling**
    - **Validates: Requirements 10.1, 10.2**
  
  - [ ]* 12.4 Write property test for auto-renewal workflow
    - **Property 30: Auto-Renewal Workflow**
    - **Validates: Requirements 10.3, 10.4**
  
  - [ ]* 12.5 Write property test for reminder opt-out respect
    - **Property 31: Reminder Opt-Out Respect**
    - **Validates: Requirements 10.5**

- [ ] 13. Implement rate limiting and security
  - [ ] 13.1 Create rate limiting service
    - Implement Redis-based rate limiter (10 requests/hour for citizens)
    - Add VLE tier-based rate limits
    - Implement request queueing for exceeded limits
    - _Requirements: 17.1, 17.4, 17.5_
  
  - [ ] 13.2 Implement abuse detection and blocking
    - Create suspicious activity detection rules
    - Implement temporary blocking with notification
    - Add administrator alerting
    - _Requirements: 17.2, 17.3_
  
  - [ ] 13.3 Implement data encryption
    - Add AES-256 encryption for data at rest using AWS KMS
    - Enforce TLS 1.3 for all external communications
    - Implement secure token storage
    - _Requirements: 15.1, 15.2_
  
  - [ ] 13.4 Implement data retention and deletion
    - Create 24-hour auto-deletion for documents (with opt-out)
    - Implement citizen data deletion workflow (7-day completion)
    - Add third-party data sharing consent verification
    - _Requirements: 15.3, 15.4, 15.5_
  
  - [ ]* 13.5 Write property test for rate limiting enforcement
    - **Property 54: Rate Limiting Enforcement**
    - **Validates: Requirements 17.1, 17.4**
  
  - [ ]* 13.6 Write property test for VLE rate limit differentiation
    - **Property 56: VLE Rate Limit Differentiation**
    - **Validates: Requirements 17.5**
  
  - [ ]* 13.7 Write property test for data encryption
    - **Property 46: Data Encryption**
    - **Validates: Requirements 15.1, 15.2**
  
  - [ ]* 13.8 Write property test for document auto-deletion
    - **Property 47: Document Auto-Deletion**
    - **Validates: Requirements 15.3**

- [ ] 14. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Implement analytics and logging
  - [ ] 15.1 Create audit logging service
    - Implement request lifecycle logging (initiation and completion)
    - Log to PostgreSQL with correlation IDs
    - Add distributed tracing with Jaeger integration
    - _Requirements: 18.1, 18.2_
  
  - [ ] 15.2 Implement analytics service
    - Create report generation with anonymization
    - Calculate metrics: total requests, success rate, avg completion time, revenue
    - Support daily, weekly, monthly aggregation
    - _Requirements: 18.3, 18.4, 18.5_
  
  - [ ]* 15.3 Write property test for request lifecycle logging
    - **Property 57: Request Lifecycle Logging**
    - **Validates: Requirements 18.1, 18.2**
  
  - [ ]* 15.4 Write property test for analytics report generation
    - **Property 58: Analytics Report Generation**
    - **Validates: Requirements 18.3, 18.4**

- [ ] 16. Implement webhook integration
  - [ ] 16.1 Create webhook delivery service
    - Implement HTTP POST sender with JSON payload
    - Add retry logic with exponential backoff (up to 5 attempts)
    - Support events: request_initiated, request_completed, payment_received, authentication_completed
    - Implement failure logging and administrator alerting
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_
  
  - [ ]* 16.2 Write property test for webhook delivery
    - **Property 60: Webhook Delivery**
    - **Validates: Requirements 19.1, 19.2, 19.5**
  
  - [ ]* 16.3 Write property test for webhook retry logic
    - **Property 61: Webhook Retry Logic**
    - **Validates: Requirements 19.3, 19.4**

- [ ] 17. Implement Admin Console (React frontend)
  - [ ] 17.1 Create Admin Console React app structure
    - Set up React with TypeScript and React Router
    - Create authentication and authorization
    - Implement responsive layout with navigation
    - _Requirements: 11.1, 11.2, 11.4, 11.5_
  
  - [ ] 17.2 Implement real-time metrics dashboard
    - Create dashboard with active sessions, success rates, error logs
    - Add real-time updates using WebSocket or Server-Sent Events
    - Implement critical error alert notifications
    - _Requirements: 11.1, 11.4_
  
  - [ ] 17.3 Implement AgentSkills management interface
    - Create skills listing with status indicators
    - Add visual skill editor for creating/updating skills
    - Implement skill validation and testing
    - _Requirements: 11.2_
  
  - [ ] 17.4 Implement log export functionality
    - Create export interface with date range selection
    - Generate CSV and JSON format reports
    - Add download functionality
    - _Requirements: 11.5_
  
  - [ ]* 17.5 Write property test for admin console metrics display
    - **Property 32: Admin Console Metrics Display**
    - **Validates: Requirements 11.1**
  
  - [ ]* 17.6 Write property test for AgentSkills listing
    - **Property 33: AgentSkills Listing**
    - **Validates: Requirements 11.2**

- [ ] 18. Implement Jan-Rover PWA (React frontend)
  - [ ] 18.1 Create Jan-Rover PWA React app
    - Set up React PWA with offline support
    - Implement service worker for push notifications
    - Create authentication for gig-workers
    - _Requirements: 12.1, 12.2, 12.3, 12.5_
  
  - [ ] 18.2 Implement task management interface
    - Create task list sorted by proximity
    - Add task acceptance flow
    - Display citizen location, contact details, required documents
    - Implement photo capture and document upload
    - _Requirements: 12.2, 12.3_
  
  - [ ] 18.3 Implement earnings tracking
    - Display current earnings and completed tasks
    - Show task history with payment details
    - _Requirements: 12.5_
  
  - [ ]* 18.4 Write property test for Jan-Rover task notification
    - **Property 36: Jan-Rover Task Notification**
    - **Validates: Requirements 12.1**
  
  - [ ]* 18.5 Write property test for Jan-Rover task sorting
    - **Property 37: Jan-Rover Task Sorting**
    - **Validates: Requirements 12.2**

- [ ] 19. Integration and end-to-end wiring
  - [ ] 19.1 Wire messaging gateway to orchestration engine
    - Connect WhatsApp/Telegram webhooks to message queue
    - Implement message queue consumer in orchestration engine
    - Add response routing back through messaging gateway
    - _Requirements: 1.1, 1.2, 1.5_
  
  - [ ] 19.2 Wire orchestration engine to all services
    - Integrate Vision AI service for document processing
    - Integrate authentication service for DigiLocker/Aadhaar/Jan-Rover
    - Integrate browser automation service for portal navigation
    - Integrate payment service for UPI transactions
    - Integrate AgentSkills registry for portal-specific logic
    - _Requirements: 2.1, 3.1, 5.1, 6.1, 13.1_
  
  - [ ] 19.3 Implement complete service request workflow
    - Create end-to-end flow: message → NLU → auth → document processing → portal navigation → payment → confirmation
    - Add workflow state persistence and recovery
    - Implement all error handling and fallback chains
    - _Requirements: 3.1, 3.5, 16.1, 16.2, 16.3_
  
  - [ ]* 19.4 Write integration tests for complete workflows
    - Test driving license renewal flow
    - Test ration card application flow
    - Test payment integration flow
    - Test Jan-Rover dispatch flow
    - _Requirements: All_

- [ ] 20. Implement monitoring and observability
  - [ ] 20.1 Set up Prometheus metrics collection
    - Add metrics for success rates, completion times, error rates
    - Implement container utilization tracking
    - Add payment success rate tracking
    - _Requirements: 18.1, 18.2_
  
  - [ ] 20.2 Configure Grafana dashboards
    - Create real-time monitoring dashboards
    - Add alerting rules for critical thresholds
    - Implement PagerDuty integration
    - _Requirements: 11.1, 11.4_
  
  - [ ] 20.3 Set up ELK stack for log aggregation
    - Configure Elasticsearch for log storage
    - Set up Logstash for log processing
    - Create Kibana dashboards for log analysis
    - _Requirements: 11.1, 18.1_

- [ ] 21. Deployment and infrastructure
  - [ ] 21.1 Create Kubernetes deployment manifests
    - Define deployments for all microservices
    - Configure services, ingress, and load balancers
    - Set up auto-scaling policies
    - Add health checks and readiness probes
    - _Requirements: All (infrastructure)_
  
  - [ ] 21.2 Set up CI/CD pipeline
    - Configure GitHub Actions or GitLab CI
    - Implement automated testing in pipeline
    - Add staging and production deployment workflows
    - Configure blue-green deployment strategy
    - _Requirements: All (infrastructure)_
  
  - [ ] 21.3 Configure AWS infrastructure
    - Set up EKS cluster
    - Configure RDS for PostgreSQL
    - Set up ElastiCache for Redis
    - Configure S3 buckets with lifecycle policies
    - Set up CloudFront CDN
    - _Requirements: All (infrastructure)_

- [ ] 22. Final checkpoint - Ensure all tests pass and system is operational
  - Run full test suite (unit, property, integration, E2E)
  - Verify all services are deployed and healthy
  - Test complete user journeys in staging environment
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with minimum 100 iterations
- Integration happens incrementally - each service is wired as it's completed
- Checkpoints ensure validation at reasonable intervals
- The implementation follows a bottom-up approach: data layer → services → orchestration → frontends → integration
