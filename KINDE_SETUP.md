# Kinde Authentication Setup

## ✅ What's Already Done

1. **State Parameter Fixed**: Added proper state parameter generation using `crypto.randomUUID()` (8+ characters)
2. **OAuth Flow Implemented**: Complete OAuth 2.0 flow with code exchange
3. **User Info Retrieval**: Fetches user information from Kinde
4. **UI Integration**: Login/logout buttons in navbar

## 🔧 What You Need to Do

### 1. Get Your Kinde Client Secret

1. Go to your Kinde dashboard: https://regisrodrigues.kinde.com/admin
2. Navigate to your application settings
3. Copy the **Client Secret**
4. Update the file `web/src/lib/kinde-config.ts`:
   ```typescript
   export const kindeConfig = {
     clientId: 'af05f3705470488ba8be4fafff5c2607',
     clientSecret: 'YOUR_ACTUAL_CLIENT_SECRET_HERE', // Replace this
     issuerUrl: 'https://regisrodrigues.kinde.com',
     siteUrl: 'http://localhost:5731',
     postLogoutRedirectUrl: 'http://localhost:5731',
     postLoginRedirectUrl: 'http://localhost:5731',
   };
   ```

### 2. Configure Kinde Application Settings

In your Kinde dashboard, make sure these settings are configured:

- **Allowed Callback URLs**: `http://localhost:5731`
- **Allowed Logout Redirect URLs**: `http://localhost:5731`
- **Allowed Web Origins**: `http://localhost:5731`

### 3. Test the Authentication

1. Start your API server:
   ```bash
   cd api && bun run dev
   ```

2. Start your web server:
   ```bash
   cd web && bun run dev
   ```

3. Visit `http://localhost:5731`
4. Click the "Login" button
5. You should be redirected to Kinde for authentication
6. After successful login, you'll be redirected back to your app

## 🚀 How It Works

1. **Login**: Generates a secure state parameter and redirects to Kinde
2. **Callback**: Handles the OAuth callback, exchanges code for token
3. **User Info**: Fetches user information from Kinde's userinfo endpoint
4. **Logout**: Clears local storage and redirects to Kinde logout

## 🔒 Security Features

- ✅ Secure state parameter (8+ characters)
- ✅ State validation on callback
- ✅ Token storage in localStorage
- ✅ Automatic token cleanup on logout
- ✅ URL cleanup after successful authentication

The authentication should now work without the "invalid_state" error!
