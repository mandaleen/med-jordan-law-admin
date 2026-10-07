# Avatars Directory

Place your profile and account avatar images here.

### Example:
1. Save your photo here, e.g. `public/avatars/tariq-qudah.jpg` (or `.png`, `.webp`).
2. Reference it in `lib/mock-data.ts`:
   ```ts
   export const CURRENT_USER: UserProfile = {
     name: "Tariq Qudah",
     email: "t.qudah@medjordanlaw.com",
     role: "Senior Partner",
     avatar: "/avatars/tariq-qudah.jpg",
   };
   ```
3. Alternatively, you can upload your image directly through the web UI by:
   - Hovering over the account avatar in the sidebar and clicking the camera icon.
   - Clicking the account card at the bottom of the sidebar -> "Upload New Photo".
   - Navigating to **Settings** -> **Account Profile & Photo** -> "Upload New Photo".
