# 🧪 Testing Guide: Authentication Fix for 422 Error

## 🎯 **What We Fixed**

The issue was that the JWT token stored in cookies wasn't being loaded into the `podiumApi` instance when the app started up. This caused all API requests (including `/api/v1/outposts/online-data`) to be sent without the required `Authorization: Bearer <token>` header, resulting in 422 errors.

## 🔧 **Changes Made**

1. **Added token initialization** in `PodiumApi` constructor to load JWT from cookies on startup
2. **Enhanced error handling** in `getLatestLiveData` method with better error messages
3. **Added debugging information** to help identify authentication issues

## 🧪 **Testing Steps**

### **Step 1: Verify Token Loading**

1. **Open browser console** (F12 → Console tab)
2. **Run the test script**:
   ```javascript
   // Copy and paste the contents of test-auth-fix.js into console
   ```
3. **Check the output** - you should see:
   - ✅ Token found in cookies
   - ✅ API has token: true
   - 📅 Token expiration date
   - 👤 User ID from token

### **Step 2: Monitor Network Requests**

1. **Open Network tab** (F12 → Network tab)
2. **Filter by "online-data"** to see only relevant requests
3. **Trigger an outpost action** that calls `getLatestLiveData()`
4. **Check the request headers** - you should see:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### **Step 3: Test Error Scenarios**

#### **Test 3a: Valid Token, Valid Session**
- **Expected**: Request succeeds, returns live data
- **Look for**: No 422 errors in console

#### **Test 3b: Valid Token, Invalid Session**
- **Expected**: 422 error with message "outpost is not live" or "user is not in the session"
- **Look for**: Improved error messages in console:
  ```
  Outpost session is not active
  User is not connected to the outpost session
  ```

#### **Test 3c: Invalid/Expired Token**
- **Expected**: 401 error
- **Look for**: 
  ```
  Authentication failed - token may be invalid or expired
  Token present: true
  ```

### **Step 4: Test App Startup**

1. **Clear browser cache** and reload the page
2. **Check console** for any authentication errors
3. **Verify** that the app loads without 422 errors on initial API calls

## 🔍 **Debugging Commands**

Run these in the browser console to debug issues:

```javascript
// Check if token exists in cookies
document.cookie.split('; ').find(row => row.startsWith('token='))

// Check if podiumApi has token (if accessible)
window.podiumApi?.token

// Decode JWT token to check expiration
const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Token expires:', new Date(payload.exp * 1000));
  console.log('Token expired:', Date.now() / 1000 > payload.exp);
}

// Monitor all API requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('API Request:', args[0]);
  return originalFetch.apply(this, args);
};
```

## ✅ **Success Criteria**

The fix is working if:

1. **✅ No 422 errors** on initial app load
2. **✅ Authorization header** is present in `/api/v1/outposts/online-data` requests
3. **✅ Improved error messages** appear for different error scenarios
4. **✅ Token is loaded** from cookies on app startup

## 🚨 **Common Issues & Solutions**

| Issue | Cause | Solution |
|-------|-------|----------|
| Still getting 422 errors | Token not loaded | Check if token exists in cookies |
| 401 errors | Token expired | User needs to re-login |
| No Authorization header | Token not set in API | Check browser console for errors |
| App crashes on startup | Import error | Check if `getClientCookie` is imported correctly |

## 📊 **Expected Network Request**

**Before Fix:**
```
GET /api/v1/outposts/online-data?uuid=123
Headers: Content-Type: application/json
Response: 422 Unprocessable Content
```

**After Fix:**
```
GET /api/v1/outposts/online-data?uuid=123
Headers: 
  Content-Type: application/json
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Response: 200 OK (or appropriate error with better message)
```

## 🎉 **Verification Checklist**

- [ ] Token is loaded from cookies on app startup
- [ ] Authorization header is present in API requests
- [ ] No 422 errors on initial app load
- [ ] Better error messages for different scenarios
- [ ] App works correctly for logged-in users
- [ ] App handles authentication errors gracefully

## 🆘 **If Issues Persist**

1. **Check browser console** for any JavaScript errors
2. **Verify token exists** in cookies (Application tab → Cookies)
3. **Check network requests** to see if Authorization header is present
4. **Test with a fresh login** to ensure token is properly set
5. **Clear browser cache** and test again

---

**Note**: This fix should resolve the 422 error by ensuring JWT authentication is properly included in all API requests. The token is now automatically loaded from cookies when the app starts up.
