# Google OAuth Setup Instructions

## Backend Environment Variables

Add the following environment variables to your `.env` file in the backend directory:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

## Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback` (for development)
     - `https://yourdomain.com/api/auth/google/callback` (for production)
5. Copy the Client ID and Client Secret to your `.env` file

## Frontend Environment Variables

Add the following to your frontend `.env` file (optional, defaults are set):

```env
VITE_API_URL=http://localhost:5000
```

## Testing Google OAuth

1. Start your backend server: `npm run dev` (in backend directory)
2. Start your frontend server: `npm run dev` (in frontend directory)
3. Navigate to your app and try the "Continue with Google" button
4. You should be redirected to Google's OAuth consent screen
5. After authorization, you'll be redirected back to your app and logged in

## Features Added

- Google OAuth integration for both login and registration
- Automatic user creation for Google OAuth users
- Existing users can link their Google accounts
- Proper error handling for OAuth failures
- Clean UI with Google-styled buttons
- Automatic role assignment (defaults to 'staff')

## User Flow

1. **New Google Users**: Automatically created with 'staff' role
2. **Existing Email Users**: Google account gets linked to existing account
3. **Existing Google Users**: Direct login without password
4. **Mixed Authentication**: Users can have both local and Google authentication
