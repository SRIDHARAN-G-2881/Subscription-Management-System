Google Admin configuration for local dev

Overview
- The backend supports automatically assigning the `admin` role to Google OAuth users whose email is listed in the `ADMIN_EMAILS` environment variable (comma-separated).

How it works
- `ADMIN_EMAILS` is read at startup and normalized to lowercase.
- When a Google OAuth user signs in or is linked to an existing user, the backend checks the user's email against `ADMIN_EMAILS` and assigns `role: 'admin'` if there's a match.

Set ADMIN_EMAILS
- Edit `backend/.env` and set:
  ADMIN_EMAILS=alice@example.com,bob@example.com

Promote an existing user manually (MongoDB)
- Connect to your MongoDB (e.g., using `mongosh` or MongoDB Compass).
- Run:
  db.users.updateOne({ email: 'alice@example.com' }, { $set: { role: 'admin' } })

Promote an existing user manually (Node script)
- Example Node snippet (run in project root):
  ```js
  import mongoose from 'mongoose';
  import User from './models/User.js';
  
  await mongoose.connect(process.env.MONGO_URI);
  await User.updateOne({ email: 'alice@example.com' }, { $set: { role: 'admin' } });
  console.log('Promoted alice@example.com to admin');
  process.exit(0);
  ```

Notes
- Make sure to restart the backend after changing `.env` so the updated `ADMIN_EMAILS` value is used.
- This mechanism is intended for convenience in development. For production, consider a secure admin management UI and stricter checks.
