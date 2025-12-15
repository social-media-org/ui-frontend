# YouTube Integration - Frontend Implementation

## 📋 Overview

This document describes the YouTube integration feature added to the AI Studio frontend application. The integration allows users to:
- Connect their YouTube account via OAuth
- Upload generated videos to YouTube
- Update video metadata (title, description, tags)
- Update video thumbnails
- View upload status and YouTube video links

## 🏗️ Architecture

### Design Principles
- **BFF-First Architecture**: All YouTube API calls go through the backend (youtube-service)
- **Isolated Components**: YouTube code is separate for potential microfrontend extraction
- **No Direct API Calls**: Frontend never communicates directly with YouTube/Google APIs
- **OAuth Delegation**: Authentication flow handled entirely by backend

### Backend Integration
- **Backend URL**: `http://localhost:8005/api/youtube` (configurable via env)
- **Backend Service**: youtube-service (FastAPI)
- **Communication**: REST API calls via Axios

## 📁 File Structure

```
/app/frontend/
├── .env                                          [MODIFIED - Added YOUTUBE_API_BASE_URL]
├── .env.example                                  [NEW - Environment variables template]
├── src/
│   ├── components/
│   │   └── YouTube/                              [NEW - YouTube components directory]
│   │       ├── YouTubeChannelInfo.jsx           [NEW - Display channel details]
│   │       ├── YouTubeConnectionCard.jsx        [NEW - Connection management]
│   │       ├── YouTubeMetadataForm.jsx          [NEW - Edit video metadata]
│   │       ├── YouTubeUploadPanel.jsx           [NEW - Main upload interface]
│   │       └── YouTubeUploadStatus.jsx          [NEW - Display upload info]
│   ├── services/
│   │   └── youtube.api.js                       [NEW - YouTube API service layer]
│   └── pages/
│       ├── SettingsPage.jsx                     [MODIFIED - Added YouTube connection]
│       └── ProjectEditorPage.jsx                [MODIFIED - Added YouTube tab]
```

## 🔌 API Integration

### Environment Configuration

**.env**
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_YOUTUBE_API_BASE_URL=http://localhost:8005
```

### API Endpoints Used

#### Authentication
- `GET /api/youtube/auth/url` - Get OAuth authorization URL
- `GET /api/youtube/auth/status` - Check authentication status
- `POST /api/youtube/auth/disconnect` - Disconnect YouTube account
- `GET /api/youtube/auth/callback` - OAuth callback (backend handles redirect)

#### Channel Info
- `GET /api/youtube/channel/info` - Get connected channel information

#### Video Management
- `POST /api/youtube/videos/upload/{project_id}` - Upload video to YouTube
- `PATCH /api/youtube/videos/{youtube_video_id}` - Update video metadata
- `GET /api/youtube/videos/{youtube_video_id}` - Get video information

#### Thumbnail Management
- `POST /api/youtube/thumbnail/update/{youtube_video_id}` - Update thumbnail
- `POST /api/youtube/thumbnail/update-by-project/{project_id}` - Update via project ID
- `GET /api/youtube/thumbnail/info/{youtube_video_id}` - Get thumbnail URLs

## 🎨 Component Details

### 1. YouTubeConnectionCard
**Location**: Settings Page  
**Purpose**: Manage YouTube account connection

**Features**:
- Display connection status (Connected/Disconnected)
- Show connected channel info (name, subscribers, video count, views)
- Connect button → Redirects to Google OAuth
- Disconnect button → Removes stored credentials
- OAuth callback handling (auth=success/error query params)

**Props**: None (self-contained)

**Test IDs**:
- `youtube-connection-card`
- `connect-youtube-button`
- `disconnect-youtube-button`
- `connection-status-badge`
- `error-message`

---

### 2. YouTubeChannelInfo
**Location**: Used within YouTubeConnectionCard  
**Purpose**: Display connected YouTube channel details

**Features**:
- Channel thumbnail image
- Channel name
- Subscriber count
- Video count
- Total view count

**Props**:
```javascript
channelInfo: {
  channel_title: string,
  thumbnail_url: string,
  subscriber_count: string,
  video_count: number,
  view_count: string
}
```

**Test IDs**:
- `youtube-channel-info`
- `channel-thumbnail`
- `channel-title`
- `subscriber-count`
- `video-count`
- `view-count`

---

### 3. YouTubeUploadPanel
**Location**: Project Editor Page (YouTube Tab)  
**Purpose**: Main interface for uploading and managing videos on YouTube

**Features**:
- Authentication status check
- Video readiness validation (status must be 'video_ready')
- Upload video button with loading state
- Display upload status for already-uploaded videos
- Edit metadata (collapsible form)
- Update thumbnail button
- Video preview player
- Warning messages for not authenticated / video not ready

**Props**:
```javascript
project: {
  id: string,
  status: string,
  video_url: string,
  title: string,
  description: string,
  thumbnail: string,
  youtube_video_id?: string,
  youtube_url?: string,
  youtube_uploaded_at?: string
}
```

**States**:
- Once uploaded, upload button is disabled (no re-uploads)
- Metadata form is collapsible
- Thumbnail update available for uploaded videos

**Test IDs**:
- `youtube-upload-panel`
- `not-authenticated-warning`
- `video-not-ready-warning`
- `upload-to-youtube-button`
- `toggle-metadata-form-button`
- `update-thumbnail-button`
- `video-preview`

---

### 4. YouTubeUploadStatus
**Location**: Within YouTubeUploadPanel  
**Purpose**: Display information about uploaded video

**Features**:
- Success indicator (green badge)
- YouTube video URL (clickable link)
- Upload timestamp
- YouTube video ID

**Props**:
```javascript
uploadInfo: {
  youtube_video_id: string,
  youtube_url: string,
  uploaded_at: string
}
```

**Test IDs**:
- `youtube-upload-status`
- `youtube-video-link`
- `upload-date`
- `youtube-video-id`

---

### 5. YouTubeMetadataForm
**Location**: Within YouTubeUploadPanel (collapsible)  
**Purpose**: Edit video metadata on YouTube

**Features**:
- Title input (max 100 chars, required)
- Description textarea (max 5000 chars)
- Tags input (comma-separated)
- Character counters
- Submit button with loading state
- Success/error messages

**Props**:
```javascript
youtubeVideoId: string,
initialData: {
  title: string,
  description: string,
  tags: string[]
},
onUpdate: (updatedData) => void
```

**Validation**:
- Title is required
- Character limits enforced
- Tags parsed from comma-separated string

**Test IDs**:
- `youtube-metadata-form`
- `metadata-title-input`
- `metadata-description-input`
- `metadata-tags-input`
- `update-metadata-button`
- `success-message`
- `error-message`

---

## 🔄 User Flows

### Flow 1: Connect YouTube Account

1. User navigates to Settings page
2. Sees "YouTube Integration" card with "Not Connected" status
3. Clicks "Connect YouTube" button
4. Frontend calls `GET /api/youtube/auth/url`
5. Backend returns Google OAuth URL
6. Browser redirects to Google OAuth page
7. User authorizes application
8. Google redirects back to frontend with authorization code
9. Backend at `/api/youtube/auth/callback` exchanges code for tokens
10. Backend stores tokens and redirects to `/settings?auth=success`
11. Frontend detects `auth=success` query param
12. Refreshes authentication status
13. Fetches and displays channel info

**Error Handling**: If OAuth fails, redirects to `/settings?auth=error`

---

### Flow 2: Upload Video to YouTube

**Prerequisites**:
- YouTube account connected
- Project status = "video_ready"
- Project has video_url

**Steps**:
1. User opens project in editor
2. Navigates to "YouTube" tab
3. Sees "Ready to Upload" interface with video preview
4. Clicks "Upload to YouTube" button
5. Frontend calls `POST /api/youtube/videos/upload/{project_id}`
6. Backend uploads video to YouTube via Google API
7. Backend automatically updates thumbnail (best effort)
8. Frontend receives response with youtube_video_id and youtube_url
9. Upload status is displayed with link to YouTube video
10. Upload button becomes disabled (no re-uploads)
11. "Edit Metadata" and "Update Thumbnail" buttons appear

**Error Handling**:
- Not authenticated → Shows warning with link to Settings
- Video not ready → Shows info message with current status
- Upload failed → Displays error message

---

### Flow 3: Update Video Metadata

**Prerequisites**:
- Video already uploaded to YouTube

**Steps**:
1. User clicks "Edit Metadata" button
2. Form appears with pre-filled data (title, description, tags)
3. User edits fields
4. Clicks "Update Metadata" button
5. Frontend calls `PATCH /api/youtube/videos/{youtube_video_id}`
6. Backend updates video via YouTube API
7. Success message displayed for 3 seconds
8. Form remains open for further edits

**Validation**:
- Title required (max 100 chars)
- Description optional (max 5000 chars)
- Tags comma-separated, trimmed and filtered

---

### Flow 4: Update Thumbnail

**Prerequisites**:
- Video already uploaded to YouTube
- Project has thumbnail

**Steps**:
1. User clicks "Update Thumbnail" button
2. Frontend calls `POST /api/youtube/thumbnail/update-by-project/{project_id}`
3. Backend fetches project thumbnail and uploads to YouTube
4. Success alert displayed

**Note**: Uses project's existing thumbnail, no file upload in frontend

---

### Flow 5: Disconnect YouTube

1. User navigates to Settings page
2. Sees "Connected" status with channel info
3. Clicks "Disconnect YouTube" button
4. Confirmation dialog appears
5. User confirms
6. Frontend calls `POST /api/youtube/auth/disconnect`
7. Backend removes stored credentials
8. Frontend updates to "Not Connected" state
9. Channel info hidden

---

## 🎯 Business Rules

### Upload Rules
- ✅ Can only upload if authenticated
- ✅ Can only upload if project status = "video_ready"
- ✅ Can only upload if project has video_url
- ❌ Cannot re-upload same project (upload button disabled after first upload)
- ✅ Thumbnail automatically updated on upload (best effort)

### Metadata Rules
- ✅ Can edit metadata multiple times
- ✅ Title is required (1-100 characters)
- ✅ Description optional (0-5000 characters)
- ✅ Tags optional, comma-separated

### Authentication Rules
- ✅ OAuth handled entirely by backend
- ✅ Frontend only redirects to auth URL
- ✅ Token storage managed by backend
- ✅ Token refresh handled by backend

---

## 🧪 Testing

### Test Scenarios

#### 1. YouTube Connection
- [ ] Connect button redirects to Google OAuth
- [ ] OAuth success redirects to /settings?auth=success
- [ ] OAuth error redirects to /settings?auth=error
- [ ] Channel info displays correctly after connection
- [ ] Disconnect removes connection and hides channel info
- [ ] Reconnect works after disconnect

#### 2. Video Upload
- [ ] Upload button disabled when not authenticated
- [ ] Upload button disabled when video not ready
- [ ] Upload button works when authenticated and video ready
- [ ] Upload progress shows loading state
- [ ] Upload success shows YouTube link
- [ ] Upload button disabled after successful upload
- [ ] Error message displays on upload failure

#### 3. Metadata Updates
- [ ] Form pre-fills with project data
- [ ] Title validation works (required, max 100 chars)
- [ ] Description validation works (max 5000 chars)
- [ ] Tags parsed correctly from comma-separated input
- [ ] Update success message appears
- [ ] Form stays open after update
- [ ] Character counters update in real-time

#### 4. Thumbnail Updates
- [ ] Update button appears for uploaded videos
- [ ] Update shows loading state
- [ ] Success message displays
- [ ] Error handling works

#### 5. UI/UX
- [ ] YouTube tab appears in Project Editor
- [ ] Full-width layout for YouTube tab
- [ ] Loading states show spinners
- [ ] Error messages styled correctly
- [ ] Warning messages display when appropriate
- [ ] Links open in new tab
- [ ] Buttons disabled during operations

---

## 🐛 Error Handling

### Frontend Error Handling

**Authentication Errors** (401):
- Message: "Not authenticated" warning
- Action: Link to Settings page to connect

**Not Found Errors** (404):
- Project not found
- Video not found
- Display error message in red banner

**Bad Request Errors** (400):
- Invalid data submitted
- Display validation error message

**Server Errors** (500):
- Display generic error message
- Log to console for debugging

**Network Errors**:
- Axios catches network failures
- Display "Failed to connect to server" message

### User-Facing Messages

```javascript
// Connection
"You need to connect your YouTube account before uploading videos."
"Failed to connect YouTube account. Please try again."

// Upload
"Your video must be generated before uploading to YouTube."
"Failed to upload video to YouTube"
"Video uploaded successfully!"

// Metadata
"Title is required"
"Metadata updated successfully!"
"Failed to update video metadata"

// Thumbnail
"Thumbnail updated successfully!"
"Failed to update thumbnail"
```

---

## 🚀 Deployment

### Environment Variables

**Development (.env)**:
```env
VITE_YOUTUBE_API_BASE_URL=http://localhost:8005
```

**Docker Compose (.env)**:
```env
VITE_YOUTUBE_API_BASE_URL=http://youtube-service:8005
```

**Production (.env)**:
```env
VITE_YOUTUBE_API_BASE_URL=https://api.yourdomain.com
```

### Docker Compose Configuration

```yaml
services:
  frontend:
    build: ./frontend
    environment:
      - VITE_YOUTUBE_API_BASE_URL=http://youtube-service:8005
    depends_on:
      - youtube-service

  youtube-service:
    build: ./youtube-service
    ports:
      - "8005:8005"
    environment:
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
```

### Backend Requirements

The YouTube backend service must implement these endpoints:
- All authentication endpoints
- All channel endpoints
- All video endpoints
- All thumbnail endpoints

See backend routes documentation for request/response formats.

---

## ✅ Implementation Checklist

### Phase 1: API Service Layer ✅
- [x] Created youtube.api.js
- [x] Configured environment variables
- [x] Implemented all API calls
- [x] Added error handling

### Phase 2: Components ✅
- [x] YouTubeChannelInfo component
- [x] YouTubeConnectionCard component
- [x] YouTubeUploadStatus component
- [x] YouTubeMetadataForm component
- [x] YouTubeUploadPanel component

### Phase 3: Integration ✅
- [x] Modified SettingsPage
- [x] Modified ProjectEditorPage
- [x] Added YouTube tab
- [x] Implemented OAuth callback handling
- [x] Full-width layout for YouTube tab

### Phase 4: Testing ⏳
- [ ] Manual testing with backend
- [ ] OAuth flow testing
- [ ] Upload flow testing
- [ ] Metadata updates testing
- [ ] Error scenarios testing

---

## 📚 Next Steps

### For User
1. **Start YouTube Backend Service**: Ensure youtube-service is running on port 8005
2. **Configure Google OAuth**: Set up Google Cloud Console credentials
3. **Test Connection Flow**: Connect YouTube account in Settings
4. **Test Upload Flow**: Generate a video and upload to YouTube
5. **Test Metadata Updates**: Edit video title, description, tags
6. **Test Thumbnail Updates**: Update video thumbnail

### Future Enhancements
- [ ] Batch upload multiple projects
- [ ] Schedule uploads
- [ ] View YouTube analytics in app
- [ ] Custom thumbnail upload from frontend
- [ ] Video privacy settings per upload
- [ ] Tags auto-suggestions based on project
- [ ] Upload progress tracking (long videos)
- [ ] YouTube playlist management

---

## 🔗 Related Documentation

- **Backend Routes**: See attached backend files
- **Google OAuth Setup**: [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- **Frontend Components**: See component files for detailed props and usage

---

## 📝 Notes

- OAuth tokens stored and managed by backend (never exposed to frontend)
- All YouTube API calls rate-limited by Google (quotas apply)
- Video processing may take time on YouTube side
- Thumbnail updates may take minutes to reflect on YouTube
- Upload button disabled after first upload (design decision to prevent duplicates)

---

**Implementation Date**: December 2024  
**Version**: 1.0.0  
**Status**: ✅ Complete - Ready for Testing
