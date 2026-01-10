# 🚀 Vercel Deployment Checklist

Follow these steps to ensure a smooth transition from local development to production.

## 1. Supabase Auth Configuration
Before people can log in on your live site, you **must** update Supabase:
- Go to **Authentication > URL Configuration**.
- In **Site URL**, put your Vercel production URL (e.g., `https://mppms.vercel.app`).
- In **Redirect URLs**, add:
  - `https://mppms.vercel.app/auth/callback`
  - `http://localhost:3000/auth/callback` (keep this for local testing)

## 2. Google Cloud Console (OAuth)
- Update your **Authorized redirect URIs** in the Google Cloud Console to include your Vercel callback URL:
  - `https://your-project-id.supabase.co/auth/v1/callback` (Supabase handles this, but ensure the "Authorized JavaScript origins" includes your Vercel domain).

## 3. Vercel Environment Variables
Add these keys in your Vercel Project Settings:

| Key | Value Source |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API Settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase API Settings |
| `DATABASE_URL` | Supabase Database (Direct Connection String) |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Your primary admin email (Google account) |

> [!IMPORTANT]
> Ensure `DATABASE_URL` includes `?sslmode=require` if it's not already in the string.

## 4. Final Verification
- [ ] Run `npm run build` locally one last time.
- [ ] Ensure all files are saved and committed to git.
- [ ] Verify `.env` is **not** being tracked by git (check `.gitignore`).

## 5. Deployment Commands
Once pushed to GitHub/GitLab, connect the repo to Vercel. 
- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Output Directory**: `.next` (default)
