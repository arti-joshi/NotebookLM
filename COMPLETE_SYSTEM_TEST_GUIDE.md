# Complete System Test Guide

## 🚀 **SYSTEM STATUS CHECK**

### Backend Server Status
- ✅ **Backend Running:** Port 4001 (Confirmed)
- ✅ **Database Connected:** PostgreSQL + pgvector
- ✅ **Progress Tracking:** All APIs functional
- ✅ **Authentication:** demo-token working

### Frontend Server Status  
- ⚠️ **Frontend Starting:** Port 5173 (Starting up)
- ✅ **Code Updated:** All progress sync features implemented
- ✅ **Visual Indicator:** Refresh notification ready

## 📋 **STEP-BY-STEP TESTING PROCEDURE**

### **STEP 1: Test Dashboard Auto-Refresh**

#### Setup:
1. **Open Browser:** Navigate to `http://localhost:5173`
2. **Open DevTools:** Press F12, go to Console tab
3. **Login:** Use demo credentials if needed
4. **Navigate to Dashboard:** Click Dashboard in navigation

#### Test Execution:
1. **Note Current State:** Record "Questions Asked" count
2. **Open ChatWidget:** Click the chat bubble (bottom-right)
3. **Ask Question:** Type "Explain B-tree indexes" and send
4. **Wait for Response:** Let the AI respond completely

#### Expected Console Logs (in order):
```
[ChatWidget] Progress update event emitted from chat
[Dashboard] ✓ Progress update event received: {...}
[Dashboard] ⏰ Scheduling refresh in 1 second...
[Dashboard] 🔄 Executing auto-refresh...
[Dashboard] Starting data load...
[Dashboard] Data fetched in XXXms
[Dashboard] State updated successfully
```

#### Expected Visual Results:
- ✅ **Green Notification:** "Progress Updated" appears top-right
- ✅ **Count Increase:** "Questions Asked" increases by 1
- ✅ **Data Refresh:** Recent activity table updates

---

### **STEP 2: Test Chat Persistence**

#### Setup:
1. **Ensure ChatWidget is Open:** From previous test
2. **Have Conversation:** Ask 2-3 more questions
3. **Verify Messages:** Confirm 3+ messages in chat

#### Test Execution:
1. **Navigate Away:** Click "Upload" in navigation
2. **Wait 2 seconds:** Let state save
3. **Navigate Back:** Click "Dashboard" in navigation
4. **Open ChatWidget:** Click chat bubble again

#### Expected Results:
- ✅ **Messages Preserved:** All 3+ messages still visible
- ✅ **State Restored:** Chat opens in same state
- ✅ **Console Log:** "Chat state saved to localStorage"

---

### **STEP 3: Test Cache Busting**

#### Setup:
1. **Open Network Tab:** In DevTools
2. **Clear Network Log:** Click clear button
3. **Navigate to Dashboard:** Fresh page load

#### Test Execution:
1. **Find API Request:** Look for `/progress/summary` request
2. **Check URL:** Verify it has `?_t=timestamp` parameter
3. **Check Headers:** Click on request, go to Headers tab
4. **Verify Response:** Look for cache control headers

#### Expected Results:
- ✅ **URL Parameter:** `?_t=1234567890` (timestamp)
- ✅ **Request Headers:** `Cache-Control: no-cache`
- ✅ **Response Headers:** `Cache-Control: no-store, no-cache, must-revalidate`

---

### **STEP 4: Test Tab Switch Refresh**

#### Setup:
1. **Dashboard Open:** Ensure you're on Dashboard page
2. **Note Network Activity:** Check Network tab for baseline

#### Test Execution:
1. **Switch Tab:** Open another tab (Gmail, Google, etc.)
2. **Wait 5 seconds:** Let background processes settle
3. **Switch Back:** Return to Dashboard tab
4. **Watch Console:** Look for refresh logs
5. **Check Network:** Verify new API requests

#### Expected Results:
- ✅ **Console Log:** "Dashboard tab visible - refreshing data..."
- ✅ **Network Requests:** New API calls to progress endpoints
- ✅ **Data Update:** Fresh data loaded (if any changes)

---

## 🔍 **TROUBLESHOOTING GUIDE**

### **If Tests Fail:**

#### 1. Check Console Errors
```javascript
// Look for these error patterns:
- "Failed to fetch"
- "Unauthorized" 
- "Module not found"
- "Cannot read property"
```

#### 2. Verify File Modifications
```bash
# Check these files exist and have correct content:
- frontend/src/pages/DashboardPage.jsx (refresh notification)
- frontend/src/lib/progressEvents.js (event system)
- frontend/src/lib/chatStorage.js (persistence)
- frontend/src/index.css (animations)
```

#### 3. Restart Services
```bash
# Stop all processes
Ctrl+C in all terminal windows

# Restart backend
cd backend
npm run dev

# Restart frontend  
cd frontend
npm run dev
```

#### 4. Clear Browser Data
```javascript
// In browser console:
localStorage.clear()
sessionStorage.clear()
// Then refresh page
```

#### 5. Try Incognito Mode
- Open incognito/private window
- Navigate to localhost:5173
- Run tests again

---

## ✅ **SUCCESS CRITERIA**

### All Tests Must Pass:
1. ✅ **Auto-Refresh:** Chat → Dashboard notification appears
2. ✅ **Persistence:** Chat messages survive navigation
3. ✅ **Cache Busting:** Timestamps and headers present
4. ✅ **Tab Switch:** Console logs and network requests

### Visual Indicators:
- ✅ **Green Notification:** Appears and disappears smoothly
- ✅ **Console Logs:** All expected messages present
- ✅ **Network Activity:** Fresh requests on each refresh
- ✅ **Data Updates:** Progress counts increase correctly

---

## 🎯 **EXPECTED BEHAVIOR SUMMARY**

### **Dashboard Auto-Refresh Flow:**
1. User asks question in chat
2. Chat emits progress event
3. Dashboard receives event after 1s delay
4. Dashboard shows green notification
5. Data refreshes automatically
6. Notification disappears after 2s

### **Chat Persistence Flow:**
1. User has conversation
2. State auto-saves every 500ms
3. User navigates away
4. User returns to dashboard
5. Chat state restored from localStorage

### **Cache Busting Flow:**
1. User navigates to dashboard
2. API calls include timestamp parameter
3. Backend sends no-cache headers
4. Browser doesn't cache responses
5. Fresh data always loaded

---

## 🚨 **EMERGENCY DEBUGGING**

### If Nothing Works:
1. **Check Server Logs:** Look at terminal output
2. **Verify Ports:** Ensure 4001 and 5173 are listening
3. **Check Database:** Verify PostgreSQL is running
4. **Test API Directly:** Use curl/Postman to test endpoints
5. **Check Browser Console:** Look for JavaScript errors

### Quick API Test:
```bash
# Test backend health
curl http://localhost:4001/health

# Test progress endpoint
curl -H "Authorization: Bearer demo-token" http://localhost:4001/progress/summary
```

---

## 🎉 **SUCCESS CONFIRMATION**

When all tests pass, you should see:
- ✅ Smooth auto-refresh notifications
- ✅ Persistent chat conversations  
- ✅ Fresh data on every request
- ✅ Responsive tab switch behavior
- ✅ Clean console logs with no errors

**The progress sync system is working perfectly!** 🚀
