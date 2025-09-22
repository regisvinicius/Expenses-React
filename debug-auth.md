# Debug Authentication Issues

## Check if user is logged in

1. Open your browser's Developer Tools (F12)
2. Go to the Application/Storage tab
3. Check Local Storage for:
   - `kinde_token` - Should contain a JWT token
   - `kinde_id_token` - Should contain an ID token

## Test the authentication flow

1. **Check if user is logged in:**
   ```javascript
   // In browser console
   console.log('Token:', localStorage.getItem('kinde_token'));
   console.log('ID Token:', localStorage.getItem('kinde_id_token'));
   ```

2. **Test API call manually:**
   ```javascript
   // In browser console
   const token = localStorage.getItem('kinde_token');
   fetch('http://localhost:3000/api/expenses', {
     headers: {
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     }
   })
   .then(r => r.json())
   .then(console.log)
   .catch(console.error);
   ```

## Common Issues

### 1. User not logged in
- **Solution:** Click the "Login" button to authenticate with Kinde
- **Check:** Make sure you're redirected to Kinde and back successfully

### 2. Token expired
- **Solution:** Log out and log back in
- **Check:** Tokens have expiration times

### 3. Wrong token type
- **Check:** Make sure you're using `kinde_token` (access token) not `kinde_id_token`
- **The API expects:** `Authorization: Bearer <access_token>`

### 4. CORS issues
- **Check:** Make sure the API server is running on port 3000
- **Check:** Make sure CORS is configured to allow your frontend origin

## Quick Fix Steps

1. **Make sure you're logged in:**
   - Go to your app
   - Click "Login" if not already logged in
   - Complete the Kinde authentication flow

2. **Restart both servers:**
   ```bash
   # Terminal 1 - API server
   cd api
   bun run dev

   # Terminal 2 - Web server  
   cd web
   bun run dev
   ```

3. **Clear browser storage and try again:**
   - Clear localStorage in browser dev tools
   - Log in again
   - Try the API call

## Test the API directly

You can also test the API directly using curl:

```bash
# Get your token from browser localStorage first
TOKEN="your_token_here"

# Test the API
curl -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     http://localhost:3000/api/expenses
```
