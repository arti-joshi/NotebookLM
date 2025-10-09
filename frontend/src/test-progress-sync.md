# Progress Sync Testing Checklist

## Setup
1. Open browser DevTools (F12) and go to Console tab
2. Make sure you're logged in
3. Clear localStorage: `localStorage.clear()` then refresh page

## Test 1: Dashboard Auto-Refresh on Tab Switch
1. Open dashboard page
2. Note the current "Questions Asked" count
3. Switch to another tab (not browser window)
4. Switch back to dashboard tab
5. **Expected**: Console shows "Dashboard tab visible - refreshing data..."
6. **Expected**: Data reloads (watch Network tab for new requests)

## Test 2: Dashboard Auto-Refresh on Navigation
1. Navigate to Dashboard
2. Note current progress stats
3. Navigate to Upload page
4. Navigate back to Dashboard
5. **Expected**: Console shows "Dashboard route mounted - loading fresh data..."
6. **Expected**: Fresh API calls in Network tab

## Test 3: Real-Time Progress Update from Chat
1. Open Dashboard in one browser tab
2. Open Console and watch for logs
3. Open ChatWidget (bottom-right bubble)
4. Ask a question: "What is a B-tree index?"
5. Wait for response
6. **Expected**: Console shows "Progress update event emitted from chat"
7. **Expected**: Dashboard console shows "Dashboard received progress update"
8. **Expected**: After 1 second, dashboard shows "Auto-refreshing dashboard data..."
9. **Expected**: Progress stats update (Questions Asked +1)
10. **Expected**: "Recent Activity" table updates

## Test 4: Chat State Persistence
1. Open ChatWidget
2. Ask 2-3 questions
3. Navigate to Upload page
4. Navigate back to Dashboard
5. **Expected**: ChatWidget remembers previous state (open/closed)
6. **Expected**: Conversation history is preserved
7. **Expected**: Console shows "Chat state saved to localStorage"

## Test 5: Cache Busting
1. Open Network tab in DevTools
2. Navigate to Dashboard
3. Click any API call to /progress/summary
4. Check Request Headers
5. **Expected**: See "Cache-Control: no-cache" headers
6. **Expected**: URL includes timestamp query param like "?_t=1234567890"
7. Check Response Headers
8. **Expected**: See "Cache-Control: no-store, no-cache..."

## Test 6: Chat Clears on Logout
1. Open ChatWidget and have a conversation
2. Verify messages are stored: `localStorage.getItem('chat_messages')`
3. Click Logout
4. Login again
5. **Expected**: ChatWidget is empty (default welcome message only)
6. **Expected**: localStorage chat keys are cleared

## Debugging Failed Tests

If dashboard doesn't refresh:
- Check Console for "[Dashboard]" logs
- Verify progressEvents.js is imported correctly
- Check if event listener is attached (no errors in console)
- Verify API endpoints return fresh data (check timestamps)

If chat state doesn't persist:
- Check localStorage in DevTools: Application > Local Storage
- Verify keys: chat_messages, chat_is_open, chat_is_minimized
- Check Console for "Chat state saved" logs
- Verify no quota errors in console

If cache isn't busted:
- Check Network tab Response Headers
- Verify backend headers are being set
- Clear browser cache: Ctrl+Shift+Delete
- Try in Incognito mode

Save this file for reference and follow each test step carefully.
