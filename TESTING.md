# Progress Tracking Testing Checklist

## Backend Tests

### Database
- [ ] Topics seeded successfully (100 topics, 20 chapters)
- [ ] Representative embeddings calculated for all level-1 topics
- [ ] Prisma migrations applied without errors
- [ ] Indexes created on TopicInteraction (userId, topicId, createdAt)

### Topic Mapping
- [ ] Citation "Indexes" maps to chapter-level topic
- [ ] Citation "B-tree Indexes" maps to subtopic with high confidence
- [ ] Citation "btree index" fuzzy matches to "B-tree Indexes" (>0.85 confidence)
- [ ] Query "How do I speed up queries?" maps to multiple relevant topics
- [ ] Ambiguous query with low confidence (<0.6) doesn't record interaction

### Mastery Calculation
- [ ] After 3 questions on same topic: status = LEARNING
- [ ] After 8+ high-confidence questions: status = PROFICIENT
- [ ] Cramming (all questions within 1 hour): retention score ~40%
- [ ] Spaced questions (3+ days apart): retention score ~90%
- [ ] Diverse questions: diversity score >60%
- [ ] Repeated similar questions: diversity score <40%
- [ ] Meeting all criteria: status = MASTERED, completedAt set

### API Endpoints
- [ ] GET /progress/summary returns correct overall progress
- [ ] GET /topics returns hierarchical structure
- [ ] GET /topics/:id/progress returns detailed mastery data
- [ ] GET /progress/topics?status=LEARNING filters correctly
- [ ] POST /topics/:id/complete updates status to MASTERED

### Chat Integration
- [ ] Asking question triggers topic mapping
- [ ] TopicInteraction record created after answer
- [ ] Multiple topics recorded if query is broad
- [ ] Progress updates asynchronously (doesn't block response)
- [ ] Errors in progress tracking don't crash chat endpoint

## Frontend Tests

### Dashboard Page
- [ ] Overall progress percentage matches backend calculation
- [ ] Stats cards show correct totals (questions, time, mastered count)
- [ ] Mastery distribution bars show correct topic counts
- [ ] Weekly activity chart displays last 7 days
- [ ] Top active topics table sorts by lastInteraction DESC
- [ ] Loading state shows while fetching data
- [ ] Error state displays if API fails
- [ ] Fallback to empty state if no progress data

### Topic Detail Modal
- [ ] Clicking topic name opens modal
- [ ] Mastery breakdown shows 5 scores with percentages
- [ ] Recent interactions list displays correctly
- [ ] Subtopics section shows for chapter-level topics only
- [ ] "Mark as Complete" button works and updates dashboard
- [ ] Close button and backdrop click close modal

### Chat Widget Progress Indicator
- [ ] "Currently Learning" widget appears after questions
- [ ] Shows top 3 LEARNING topics with percentages
- [ ] Updates dynamically as topics progress
- [ ] Doesn't appear if no learning topics yet

### Responsive Design
- [ ] Dashboard layout adapts to mobile (<768px)
- [ ] Charts remain readable on small screens
- [ ] Topic table scrolls horizontally if needed
- [ ] Modal scales properly on all devices

## Performance Tests
- [ ] Chat response time: <2s (progress tracking shouldn't add latency)
- [ ] Dashboard load time: <1s for 100 topics
- [ ] Topic detail modal: <500ms to fetch and render
- [ ] Embedding calculation: <300ms per query (cached in memory)

## Data Consistency Tests
- [ ] After 50 questions: overall progress = expected weighted average
- [ ] Deleting TopicInteraction cascades to update TopicMastery
- [ ] User 1's progress isolated from User 2's progress
- [ ] System topics vs user-uploaded docs handled separately

## Error Handling
- [ ] Invalid topicId returns 404 with clear message
- [ ] Missing auth token returns 401
- [ ] Database connection failure returns 500 with generic message
- [ ] Embedding API failure logs error but doesn't crash
- [ ] Malformed query doesn't break topic mapping

Run through this checklist manually, checking off items as you test.
Report any failures in GitHub Issues with reproduction steps.


