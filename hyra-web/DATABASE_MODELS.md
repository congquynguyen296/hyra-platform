# Database Models & Schemas

## Overview
This document defines all database models/schemas required for the Learning Platform application. These models are based on the UI requirements and API specifications.

---

## 1. User Model

**Collection/Table:** `users`

**Purpose:** Store user account information and preferences

**Schema:**
```typescript
{
  _id: ObjectId,
  name: string,                    // User's full name
  email: string,                   // Unique email address
  password: string,                // Hashed password (bcrypt)
  theme: enum('light', 'dark'),    // UI theme preference
  notifications: boolean,          // Email notification preference
  avatar?: string,                 // Profile picture URL (optional)
  emailVerified: boolean,          // Email verification status
  createdAt: timestamp,            // Account creation date
  updatedAt: timestamp,            // Last update date
  lastLoginAt?: timestamp,         // Last login timestamp
  refreshToken?: string,           // Current refresh token
  refreshTokenExpiresAt?: timestamp
}
```

**Indexes:**
```javascript
{
  email: 1  // Unique index for email lookup
}
{
  createdAt: -1  // Index for sorting users by registration date
}
```

**Validations:**
- `email`: Must be valid email format, unique
- `password`: Minimum 6 characters (stored as hash)
- `name`: Minimum 2 characters

---

## 2. Subject Model

**Collection/Table:** `subjects`

**Purpose:** Store subject/course information for organizing files

**Schema:**
```typescript
{
  _id: ObjectId,
  userId: ObjectId,                // Reference to User
  name: string,                    // Subject name (e.g., "Mathematics")
  folders: string[],               // Array of folder names
  color: string,                   // Hex color code for UI (e.g., "#3B82F6")
  description?: string,            // Optional description
  createdAt: timestamp,
  updatedAt: timestamp,
  deletedAt?: timestamp            // Soft delete support
}
```

**Indexes:**
```javascript
{
  userId: 1,
  createdAt: -1
}
{
  userId: 1,
  name: 1  // Compound index for user's subjects
}
```

**Validations:**
- `name`: Required, 2-100 characters
- `color`: Valid hex color code
- `folders`: Array of strings, max 20 folders

---

## 3. File Model

**Collection/Table:** `files`

**Purpose:** Store uploaded file metadata and information

**Schema:**
```typescript
{
  _id: ObjectId,
  userId: ObjectId,                // Reference to User
  subjectId: ObjectId,             // Reference to Subject
  name: string,                    // Display name
  originalName: string,            // Original filename from upload
  subject: string,                 // Subject name (denormalized)
  folder: string,                  // Folder name within subject
  uploadDate: date,                // Upload date
  
  // File storage information
  url: string,                     // Storage URL (S3/Cloud Storage)
  storageKey: string,              // Storage identifier/key
  size: number,                    // File size in bytes
  sizeFormatted: string,           // Human-readable size (e.g., "2.4 MB")
  mimeType: string,                // MIME type (e.g., "application/pdf")
  
  // Metadata
  metadata: {
    pages?: number,                // Number of pages (for PDFs)
    language?: string,             // Document language
    wordCount?: number,            // Approximate word count
    encoding?: string              // File encoding
  },
  
  // Processing status
  processedAt?: timestamp,         // When file was processed
  processingStatus: enum(          // Current processing status
    'pending',
    'processing', 
    'completed',
    'failed'
  ),
  processingError?: string,        // Error message if failed
  
  // Statistics
  summaryCount: number,            // Number of summaries generated
  quizCount: number,               // Number of quizzes generated
  viewCount: number,               // Number of times viewed
  downloadCount: number,           // Number of downloads
  
  createdAt: timestamp,
  updatedAt: timestamp,
  deletedAt?: timestamp            // Soft delete support
}
```

**Indexes:**
```javascript
{
  userId: 1,
  uploadDate: -1
}
{
  subjectId: 1,
  uploadDate: -1
}
{
  userId: 1,
  subject: 1,
  folder: 1
}
{
  processingStatus: 1
}
```

**Validations:**
- `name`: Required, 1-255 characters
- `size`: Max 50MB (52428800 bytes)
- `mimeType`: Must be in allowed types (application/pdf, application/msword, etc.)

---

## 4. Summary Model

**Collection/Table:** `summaries`

**Purpose:** Store AI-generated summaries of documents

**Schema:**
```typescript
{
  _id: ObjectId,
  userId: ObjectId,                // Reference to User
  fileId: ObjectId,                // Reference to File
  fileName: string,                // File name (denormalized)
  
  // Summary content
  content: string,                 // Main summary text (min 100, max 5000 chars)
  keyConcepts: string[],           // Array of key concepts (3-10 items)
  
  // Language and translation
  language: enum(                  // Current language
    'english',
    'vietnamese', 
    'chinese'
  ),
  originalLanguage?: string,       // Original language if translated
  translations?: {                 // Store translations
    vietnamese?: string,
    english?: string,
    chinese?: string
  },
  
  // Metadata
  metadata: {
    wordCount: number,             // Summary word count
    readingTime: string,           // Estimated reading time
    confidence: number,            // AI confidence score (0-1)
    model: string                  // AI model used for generation
  },
  
  // User interactions
  isImportant: boolean,            // User marked as important
  viewCount: number,               // Number of views
  
  // Generation info
  generatedAt: timestamp,          // When summary was generated
  generationJobId?: string,        // Processing job ID
  generationTime: number,          // Time taken to generate (seconds)
  
  createdAt: timestamp,
  updatedAt: timestamp,
  deletedAt?: timestamp            // Soft delete support
}
```

**Indexes:**
```javascript
{
  userId: 1,
  createdAt: -1
}
{
  fileId: 1
}
{
  userId: 1,
  isImportant: 1,
  createdAt: -1
}
// Text search index
{
  content: 'text',
  keyConcepts: 'text'
}
```

**Validations:**
- `content`: Required, 100-5000 characters
- `keyConcepts`: Array with 3-10 items, each 2-50 characters
- `language`: Must be one of supported languages

---

## 5. Quiz Model

**Collection/Table:** `quizzes`

**Purpose:** Store AI-generated quizzes

**Schema:**
```typescript
{
  _id: ObjectId,
  userId: ObjectId,                // Reference to User
  fileId: ObjectId,                // Reference to File
  fileName: string,                // File name (denormalized)
  subject: string,                 // Subject name (denormalized)
  
  // Quiz configuration
  difficulty: enum(                // Quiz difficulty level
    'Easy',
    'Medium',
    'Hard'
  ),
  totalQuestions: number,          // Total number of questions (5-20)
  
  // Quiz content
  questions: [
    {
      id: string,                  // Unique question ID
      question: string,            // Question text
      options: string[],           // Array of 4 options
      correctAnswer: number,       // Index of correct answer (0-3)
      explanation?: string,        // Optional explanation
      userAnswer?: number,         // User's selected answer (0-3)
      isCorrect?: boolean          // Whether user answered correctly
    }
  ],
  
  // Quiz results
  completed: boolean,              // Whether quiz has been attempted
  completedAt?: timestamp,         // When quiz was completed
  score?: number,                  // Score percentage (0-100)
  correctAnswers?: number,         // Number of correct answers
  timeSpent?: string,              // Time spent on quiz (e.g., "15 minutes")
  timeSpentSeconds?: number,       // Time in seconds
  
  // Generation info
  generatedAt: timestamp,          // When quiz was generated
  generationJobId?: string,        // Processing job ID
  generationTime: number,          // Time taken to generate (seconds)
  
  // Metadata
  metadata: {
    model: string,                 // AI model used
    confidence: number             // Average confidence score
  },
  
  createdAt: timestamp,
  updatedAt: timestamp,
  deletedAt?: timestamp            // Soft delete support
}
```

**Indexes:**
```javascript
{
  userId: 1,
  createdAt: -1
}
{
  fileId: 1
}
{
  userId: 1,
  subject: 1,
  completed: 1
}
{
  userId: 1,
  difficulty: 1
}
```

**Validations:**
- `totalQuestions`: Between 5 and 20
- `difficulty`: Must be Easy, Medium, or Hard
- `questions`: Array with correct number of items
- `questions[].options`: Must have exactly 4 options
- `questions[].correctAnswer`: Must be 0, 1, 2, or 3
- `score`: Between 0 and 100

---

## 6. Activity Model

**Collection/Table:** `activities`

**Purpose:** Track user activities for dashboard and analytics

**Schema:**
```typescript
{
  _id: ObjectId,
  userId: ObjectId,                // Reference to User
  
  // Activity information
  type: enum(                      // Type of activity
    'file_upload',
    'file_delete',
    'summary_generated',
    'summary_viewed',
    'summary_deleted',
    'quiz_generated',
    'quiz_started',
    'quiz_completed',
    'quiz_deleted',
    'subject_created',
    'subject_updated',
    'subject_deleted'
  ),
  
  // Activity details
  title: string,                   // Display title (e.g., "Completed Quiz")
  subtitle: string,                // Subtitle (e.g., "Binary Trees - Hard")
  description?: string,            // Optional detailed description
  
  // Related resources
  resourceType?: enum(             // Type of related resource
    'file',
    'summary',
    'quiz',
    'subject'
  ),
  resourceId?: ObjectId,           // ID of related resource
  
  // Metadata
  metadata: object,                // Activity-specific metadata
  /*
    Examples:
    - For quiz_completed: { score: 85, timeSpent: "15 minutes" }
    - For file_upload: { fileName: "test.pdf", size: "2.4 MB" }
    - For summary_generated: { summaryId: ObjectId, wordCount: 450 }
  */
  
  timestamp: timestamp,            // When activity occurred
  createdAt: timestamp
}
```

**Indexes:**
```javascript
{
  userId: 1,
  timestamp: -1  // For recent activity queries
}
{
  userId: 1,
  type: 1,
  timestamp: -1
}
{
  resourceId: 1
}
```

---

## 7. ProcessingJob Model

**Collection/Table:** `processing_jobs`

**Purpose:** Track async processing tasks (summary/quiz generation)

**Schema:**
```typescript
{
  _id: ObjectId,
  jobId: string,                   // Unique job identifier
  userId: ObjectId,                // Reference to User
  fileId: ObjectId,                // Reference to File
  
  // Job information
  type: enum(                      // Job type
    'summary_generation',
    'quiz_generation',
    'file_processing',
    'translation'
  ),
  
  // Job status
  status: enum(                    // Current status
    'queued',
    'processing',
    'completed',
    'failed',
    'cancelled'
  ),
  progress: number,                // Progress percentage (0-100)
  
  // Timing
  queuedAt: timestamp,             // When job was queued
  startedAt?: timestamp,           // When processing started
  completedAt?: timestamp,         // When job completed
  estimatedCompletion?: timestamp, // Estimated completion time
  processingTime?: number,         // Actual processing time (seconds)
  
  // Job configuration
  config: object,                  // Job-specific configuration
  /*
    Examples:
    - summary: { language: 'english' }
    - quiz: { difficulty: 'Medium', numberOfQuestions: 10 }
    - translation: { sourceLanguage: 'english', targetLanguage: 'vietnamese' }
  */
  
  // Results
  result?: {
    resourceId: ObjectId,          // ID of created resource (summary/quiz)
    resourceType: string,          // Type of resource created
    metadata?: object              // Additional result data
  },
  
  // Error handling
  error?: {
    code: string,                  // Error code
    message: string,               // Error message
    details?: object,              // Additional error details
    stackTrace?: string            // Stack trace (for debugging)
  },
  
  // Retry logic
  retryCount: number,              // Number of retry attempts
  maxRetries: number,              // Maximum retry attempts
  
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Indexes:**
```javascript
{
  jobId: 1  // Unique index
}
{
  userId: 1,
  status: 1,
  createdAt: -1
}
{
  status: 1,
  queuedAt: 1  // For job queue processing
}
{
  fileId: 1,
  type: 1
}
```

**Validations:**
- `jobId`: Unique, required
- `progress`: Between 0 and 100
- `retryCount`: Between 0 and maxRetries

---

## 8. Session Model

**Collection/Table:** `sessions`

**Purpose:** Store user session data for authentication

**Schema:**
```typescript
{
  _id: ObjectId,
  userId: ObjectId,                // Reference to User
  token: string,                   // Access token (hashed)
  refreshToken: string,            // Refresh token (hashed)
  
  // Session information
  deviceInfo: {
    userAgent: string,             // Browser/device user agent
    ip: string,                    // IP address
    deviceType: string,            // desktop/mobile/tablet
    browser?: string,              // Browser name
    os?: string                    // Operating system
  },
  
  // Timing
  createdAt: timestamp,            // Session creation
  expiresAt: timestamp,            // Token expiration
  refreshTokenExpiresAt: timestamp,// Refresh token expiration
  lastActivityAt: timestamp,       // Last activity timestamp
  
  // Status
  isActive: boolean,               // Session active status
  isRevoked: boolean,              // Manually revoked
  revokedAt?: timestamp,           // When revoked
  revokeReason?: string            // Why revoked
}
```

**Indexes:**
```javascript
{
  token: 1  // Unique index
}
{
  refreshToken: 1  // Unique index
}
{
  userId: 1,
  isActive: 1,
  expiresAt: -1
}
{
  expiresAt: 1  // TTL index for auto-cleanup
}
```

---

## 9. Notification Model (Optional)

**Collection/Table:** `notifications`

**Purpose:** Store in-app and email notifications

**Schema:**
```typescript
{
  _id: ObjectId,
  userId: ObjectId,                // Reference to User
  
  // Notification content
  type: enum(                      // Notification type
    'summary_completed',
    'quiz_completed',
    'quiz_ready',
    'achievement',
    'reminder',
    'system'
  ),
  title: string,                   // Notification title
  message: string,                 // Notification message
  
  // Related resource
  resourceType?: string,           // Type of related resource
  resourceId?: ObjectId,           // ID of related resource
  actionUrl?: string,              // URL to navigate on click
  
  // Status
  read: boolean,                   // Whether user has read
  readAt?: timestamp,              // When marked as read
  
  // Delivery
  channels: enum[](                // Delivery channels
    'in_app',
    'email',
    'push'
  ),
  emailSent: boolean,              // Email sent status
  emailSentAt?: timestamp,
  
  // Metadata
  metadata?: object,               // Additional data
  priority: enum(                  // Priority level
    'low',
    'normal',
    'high',
    'urgent'
  ),
  
  expiresAt?: timestamp,           // Auto-delete after this date
  createdAt: timestamp
}
```

**Indexes:**
```javascript
{
  userId: 1,
  read: 1,
  createdAt: -1
}
{
  userId: 1,
  type: 1,
  createdAt: -1
}
{
  expiresAt: 1  // TTL index
}
```

---

## 10. Webhook Model (Optional)

**Collection/Table:** `webhooks`

**Purpose:** Store webhook configurations for external integrations

**Schema:**
```typescript
{
  _id: ObjectId,
  userId: ObjectId,                // Reference to User
  
  // Webhook configuration
  url: string,                     // Webhook endpoint URL
  secret: string,                  // Webhook secret for verification
  events: string[],                // Subscribed events
  
  // Status
  enabled: boolean,                // Active status
  
  // Statistics
  lastTriggeredAt?: timestamp,
  successCount: number,
  failureCount: number,
  
  // Retry configuration
  maxRetries: number,
  retryDelay: number,              // Delay between retries (seconds)
  
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Indexes:**
```javascript
{
  userId: 1,
  enabled: 1
}
```

---

## Relationships Diagram

```
User (1) ─────┬───── (*) Subject
              │
              ├───── (*) File
              │
              ├───── (*) Summary
              │
              ├───── (*) Quiz
              │
              ├───── (*) Activity
              │
              ├───── (*) ProcessingJob
              │
              ├───── (*) Session
              │
              └───── (*) Notification

Subject (1) ──────── (*) File

File (1) ─────┬───── (*) Summary
              │
              └───── (*) Quiz
```

---

## Data Denormalization Strategy

For performance optimization, some data is intentionally denormalized:

1. **Subject name** is stored in File model (avoid frequent joins)
2. **File name** is stored in Summary and Quiz models
3. **User statistics** can be cached in User model or separate collection

**Cache/Derived Collections:**

### UserStatistics (Derived Collection)
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  
  // Counts
  totalFiles: number,
  totalSummaries: number,
  totalQuizzes: number,
  completedQuizzes: number,
  
  // Scores
  averageQuizScore: number,
  bestQuizScore: number,
  
  // Trends (last 7/30 days)
  filesUploaded7d: number,
  filesUploaded30d: number,
  summariesGenerated7d: number,
  summariesGenerated30d: number,
  quizzesCompleted7d: number,
  quizzesCompleted30d: number,
  
  // Last activity
  lastFileUpload?: timestamp,
  lastSummaryGenerated?: timestamp,
  lastQuizCompleted?: timestamp,
  
  lastUpdated: timestamp
}
```

---

## Migration Notes

### Initial Setup
1. Create all collections with specified schemas
2. Add all indexes for performance
3. Set up TTL indexes for automatic cleanup
4. Configure text search indexes

### Data Validation Rules
Implement validation at application level and database level (MongoDB validators/PostgreSQL constraints)

### Backup Strategy
- Daily full backups
- Real-time replication for critical collections (users, files)
- Point-in-time recovery capability

### Scaling Considerations
- **Sharding key for Files**: userId + createdAt
- **Sharding key for Activities**: userId + timestamp
- **Read replicas** for analytics and reporting
- **Caching layer** (Redis) for frequently accessed data

---

## Common Queries & Indexes

### Query 1: User Dashboard Statistics
```javascript
// Aggregation pipeline
db.files.aggregate([
  { $match: { userId: ObjectId("...") } },
  { $group: {
    _id: "$userId",
    totalFiles: { $sum: 1 },
    totalSummaries: { $sum: "$summaryCount" },
    totalQuizzes: { $sum: "$quizCount" }
  }}
])
```

### Query 2: Recent Activities
```javascript
db.activities.find({
  userId: ObjectId("...")
}).sort({ timestamp: -1 }).limit(10)
```

### Query 3: Subject with File Counts
```javascript
db.files.aggregate([
  { $match: { userId: ObjectId("...") } },
  { $group: {
    _id: "$subjectId",
    subject: { $first: "$subject" },
    totalFiles: { $sum: 1 },
    totalSummaries: { $sum: "$summaryCount" },
    totalQuizzes: { $sum: "$quizCount" }
  }}
])
```

### Query 4: Search Summaries
```javascript
db.summaries.find({
  $text: { $search: "limits continuity" },
  userId: ObjectId("...")
}).sort({ score: { $meta: "textScore" } })
```

---

## Security Considerations

1. **Password Hashing**: Use bcrypt with salt rounds >= 10
2. **Token Storage**: Hash tokens before storing in database
3. **File URLs**: Use signed URLs with expiration
4. **Soft Deletes**: Implement soft delete for recovery capability
5. **Data Encryption**: Encrypt sensitive fields at rest
6. **Access Control**: Implement row-level security based on userId
7. **Rate Limiting**: Track API usage per user
8. **Audit Logs**: Log all data modifications

---

## Performance Optimization

1. **Compound Indexes**: Create compound indexes for common query patterns
2. **Projection**: Only fetch required fields in queries
3. **Pagination**: Implement cursor-based pagination for large datasets
4. **Aggregation**: Use aggregation pipelines for complex queries
5. **Caching**: Cache frequently accessed data (user profiles, statistics)
6. **Denormalization**: Store computed values to avoid real-time calculations
7. **Archiving**: Move old data to archive collections

---

## Data Lifecycle

### File Storage
- Active files: Hot storage (S3 Standard)
- Files > 90 days old: Warm storage (S3 Infrequent Access)
- Files > 1 year old: Cold storage (S3 Glacier)

### Database Records
- Active records: Main collections
- Completed jobs > 30 days: Archive to separate collection
- Activities > 90 days: Aggregate and archive
- Sessions: Auto-expire using TTL indexes

---

## Monitoring & Alerts

Track these metrics:
1. Collection sizes and growth rates
2. Index usage and performance
3. Slow queries (> 100ms)
4. Failed processing jobs
5. Storage usage
6. API error rates
7. User engagement metrics

---

## Testing Data Requirements

### Seed Data for Development:
- 5 test users with different usage patterns
- 10-15 subjects across different domains
- 50+ files with various types
- 100+ summaries with different languages
- 75+ quizzes with varying difficulties
- 500+ activity records
- Sample processing jobs in different states
