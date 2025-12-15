# YouTube Integration - Testing Guide

## 🎯 Quick Start Testing

### Prerequisites
1. ✅ Frontend running on port 3000 (already started)
2. ⚠️ YouTube backend service must be running on port 8005
3. ⚠️ Google OAuth credentials configured in backend
4. ⚠️ MongoDB connection for backend

### Backend Service Check
```bash
# Check if YouTube service is running
curl http://localhost:8005/health

# Check auth status endpoint
curl http://localhost:8005/api/youtube/auth/status
```

---

## 📋 Test Scenarios

### ✅ Test 1: Settings Page - YouTube Connection

**Steps:**
1. Open browser: `http://localhost:3000/settings`
2. Scroll down to "YouTube Integration" card
3. Should see:
   - Red YouTube icon
   - "YouTube Integration" title
   - "Connect your YouTube account" text
   - Red X icon (not connected)
   - "Connect YouTube" button

**Expected Behavior:**
- ❌ Initially shows disconnected state
- 🔵 Click "Connect YouTube" → Redirects to Google OAuth
- ✅ After authorization → Redirects back to settings with channel info
- ✅ Shows green checkmark, channel thumbnail, name, stats

**Test URL:**
```
http://localhost:3000/settings
```

---

### ✅ Test 2: OAuth Flow

**Steps:**
1. Click "Connect YouTube" button in Settings
2. Should redirect to Google OAuth consent screen
3. Select Google account
4. Grant permissions
5. Google redirects back to: `http://localhost:3000/settings?auth=success`

**Expected Behavior:**
- ✅ Redirects to Google OAuth
- ✅ After success: Returns to settings with `?auth=success`
- ✅ Channel info automatically loads and displays
- ✅ URL query params removed after detection

**Error Case:**
- If OAuth fails: `http://localhost:3000/settings?auth=error`
- Error message displayed in red

---

### ✅ Test 3: Project Editor - YouTube Tab

**Steps:**
1. Open any project: `http://localhost:3000/projects/{project_id}`
2. Click "YouTube" tab (5th tab after Script, Audio, Images, Video)
3. Should see YouTube upload panel

**Expected Behavior:**

**Case A: Not Authenticated**
- ⚠️ Yellow warning: "You need to connect your YouTube account"
- 🔗 Link to Settings page

**Case B: Authenticated but Video Not Ready**
- ⚠️ Blue info message: "Your video must be generated before uploading"
- Shows current status

**Case C: Authenticated and Video Ready**
- ✅ "Ready to Upload" interface
- 📹 Video preview player
- 🔴 "Upload to YouTube" button

---

### ✅ Test 4: Upload Video to YouTube

**Prerequisites:**
- YouTube account connected
- Project with status = "video_ready"
- Project has video_url

**Steps:**
1. Open video-ready project
2. Go to YouTube tab
3. Click "Upload to YouTube" button
4. Wait for upload (shows loading spinner)

**Expected Behavior:**
- 🔄 Button shows "Uploading to YouTube..." with spinner
- ⏱️ Upload takes 10-60 seconds depending on video size
- ✅ Success: Green banner with "Uploaded to YouTube"
- 🔗 Clickable YouTube link
- 📅 Upload timestamp displayed
- 🔒 Upload button becomes disabled
- 🎬 "Edit Metadata" and "Update Thumbnail" buttons appear

**Error Cases:**
- Network error → Red error message
- Backend error → Shows error detail
- Not authenticated → 401 error with warning

---

### ✅ Test 5: Edit Video Metadata

**Prerequisites:**
- Video already uploaded to YouTube

**Steps:**
1. Click "Edit Metadata" button
2. Form expands with 3 fields:
   - Title (pre-filled with project title)
   - Description (pre-filled with project description)
   - Tags (empty or pre-filled)
3. Edit any field
4. Click "Update Metadata"

**Expected Behavior:**
- ✅ Form expands smoothly
- ✏️ Fields are editable
- 📊 Character counters update in real-time
- 🔄 Submit button shows "Updating..." with spinner
- ✅ Success: Green message "Metadata updated successfully!"
- ⏱️ Success message disappears after 3 seconds
- 📝 Form stays open for more edits

**Validation:**
- Title required (shows error if empty)
- Title max 100 characters
- Description max 5000 characters
- Tags comma-separated, automatically parsed

---

### ✅ Test 6: Update Thumbnail

**Prerequisites:**
- Video already uploaded to YouTube
- Project has thumbnail

**Steps:**
1. Click "Update Thumbnail" button
2. Wait for update

**Expected Behavior:**
- 🔄 Button shows "Updating..." with spinner
- ✅ Success: Alert "Thumbnail updated successfully!"
- ⏱️ May take minutes to reflect on YouTube

---

### ✅ Test 7: Disconnect YouTube

**Steps:**
1. Go to Settings page
2. Scroll to YouTube Integration card
3. Click "Disconnect YouTube" button
4. Confirm in dialog

**Expected Behavior:**
- ❓ Confirmation dialog appears
- ✅ After confirm: Connection removed
- ❌ Shows "Not Connected" state
- 🔴 Channel info hidden
- 🔵 "Connect YouTube" button appears

---

## 🐛 Common Issues & Solutions

### Issue 1: "Failed to check connection status"
**Cause**: Backend not running or wrong URL  
**Solution**:
```bash
# Check backend URL in .env
cat /app/frontend/.env | grep YOUTUBE

# Should show: VITE_YOUTUBE_API_BASE_URL=http://localhost:8005

# Test backend connection
curl http://localhost:8005/health
```

---

### Issue 2: OAuth redirect doesn't work
**Cause**: Backend callback URL misconfigured  
**Solution**:
- Check Google Cloud Console OAuth settings
- Authorized redirect URIs must include backend callback URL
- Backend must redirect to: `http://localhost:3000/settings?auth=success`

---

### Issue 3: "Not authenticated" after connecting
**Cause**: Token storage issue in backend  
**Solution**:
- Check backend logs
- Verify MongoDB connection
- Token should be stored after OAuth callback

---

### Issue 4: Upload button disabled
**Possible Causes**:
1. **Already uploaded**: Design decision, no re-uploads
2. **Video not ready**: Check project.status !== "video_ready"
3. **No video URL**: Check project.video_url exists
4. **Not authenticated**: Check connection in Settings

**Solution**: Generate video first, ensure status is correct

---

### Issue 5: Metadata form doesn't submit
**Cause**: Validation error  
**Solution**:
- Title is required (cannot be empty)
- Check character limits
- Check browser console for errors

---

## 🔍 Debugging Tools

### Browser DevTools

**Network Tab:**
- Filter: `youtube`
- Check API calls to `http://localhost:8005/api/youtube/*`
- Verify status codes (200, 401, 404, 500)
- Inspect request/response payloads

**Console Tab:**
- Check for JavaScript errors
- Look for "Error" log messages
- Check axios error details

**React DevTools:**
- Inspect component state
- Check props passed to YouTube components
- Verify re-renders on state changes

---

### API Testing with cURL

**Check Auth Status:**
```bash
curl http://localhost:8005/api/youtube/auth/status
```

**Get Auth URL:**
```bash
curl http://localhost:8005/api/youtube/auth/url
```

**Get Channel Info** (requires authentication):
```bash
curl http://localhost:8005/api/youtube/channel/info
```

**Upload Video:**
```bash
curl -X POST "http://localhost:8005/api/youtube/videos/upload/PROJECT_ID?privacy_status=public"
```

---

### Frontend Logs

```bash
# Watch frontend logs in real-time
tail -f /var/log/supervisor/frontend.out.log

# Check for errors
tail -f /var/log/supervisor/frontend.err.log
```

---

## ✅ Test Checklist

### Connection Flow
- [ ] Settings page loads YouTube card
- [ ] Disconnected state shows correctly
- [ ] Connect button works
- [ ] OAuth redirect works
- [ ] Callback handling works (auth=success)
- [ ] Channel info displays
- [ ] Disconnect works

### Upload Flow
- [ ] YouTube tab visible in editor
- [ ] Not authenticated warning shows
- [ ] Video not ready warning shows
- [ ] Upload button enabled when ready
- [ ] Upload shows loading state
- [ ] Upload success shows status
- [ ] YouTube link works
- [ ] Upload button disabled after upload

### Metadata Flow
- [ ] Edit Metadata button appears
- [ ] Form expands/collapses
- [ ] Form pre-filled with data
- [ ] Character counters work
- [ ] Validation works
- [ ] Update shows loading state
- [ ] Success message displays
- [ ] Multiple updates work

### Thumbnail Flow
- [ ] Update Thumbnail button appears
- [ ] Update shows loading state
- [ ] Success alert displays

### Error Handling
- [ ] Network errors show messages
- [ ] Auth errors show warnings
- [ ] Validation errors show messages
- [ ] Backend errors display details

### UI/UX
- [ ] Loading spinners appear
- [ ] Buttons disable during operations
- [ ] Error messages styled (red)
- [ ] Success messages styled (green)
- [ ] Warning messages styled (yellow/blue)
- [ ] Links open in new tab
- [ ] Responsive design works

---

## 📊 Test Data

### Sample Project (Video Ready)
```json
{
  "id": "test-123",
  "title": "Test Video for YouTube",
  "description": "This is a test video",
  "status": "video_ready",
  "video_url": "https://example.com/video.mp4",
  "thumbnail": "https://example.com/thumb.jpg",
  "language": "en"
}
```

### Sample Channel Info Response
```json
{
  "channel_id": "UCxxxxxx",
  "channel_title": "My YouTube Channel",
  "thumbnail_url": "https://yt3.ggpht.com/...",
  "subscriber_count": "1.2K",
  "video_count": 42,
  "view_count": "10K"
}
```

### Sample Upload Response
```json
{
  "success": true,
  "project_id": "test-123",
  "youtube_video_id": "dQw4w9WgXcQ",
  "youtube_url": "https://youtube.com/watch?v=dQw4w9WgXcQ",
  "uploaded_at": "2024-12-15T16:30:00Z"
}
```

---

## 🚀 Production Testing Checklist

Before deploying to production:

- [ ] Test with real Google OAuth credentials
- [ ] Test with multiple YouTube accounts
- [ ] Test video upload with various sizes (small, medium, large)
- [ ] Test metadata with special characters
- [ ] Test with slow network (throttle in DevTools)
- [ ] Test error recovery (kill backend mid-upload)
- [ ] Test concurrent uploads (multiple users)
- [ ] Test OAuth token refresh
- [ ] Test session expiration
- [ ] Verify HTTPS in production (OAuth requires it)
- [ ] Test on mobile devices
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Load testing with multiple users
- [ ] Security testing (XSS, CSRF)

---

## 📞 Support

If you encounter issues:

1. Check this testing guide first
2. Review `/app/YOUTUBE_INTEGRATION.md` for implementation details
3. Check backend logs and frontend console
4. Verify environment variables
5. Test backend endpoints directly with cURL
6. Check Google Cloud Console for OAuth issues

---

**Last Updated**: December 2024  
**Frontend Version**: 1.0.0  
**Status**: ✅ Ready for Testing
