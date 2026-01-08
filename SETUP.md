# MPPMS Project Setup Guide

Welcome to the Meritorious Past Paper Management System (MPPMS). Follow these steps to get your local development environment running.

## Prerequisites

-   **Node.js**: v18.x or higher
-   **npm** or **yarn**
-   **Supabase Account**: A project created on [Supabase](https://supabase.com)

## Step 1: Clone and Install

```bash
git clone <repository-url>
cd MPPMS
npm install
```

## Step 2: Environment Configuration

1.  Copy the environment template:
    ```bash
    cp .env.example .env
    ```
2.  Open `.env` and fill in your Supabase credentials:
    -   `NEXT_PUBLIC_SUPABASE_URL`: Your project URL.
    -   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your project's anon/public key.
    -   `DATABASE_URL`: The direct connection string for your database (available in Supabase Project Settings > Database).

## Step 3: Database Initialization

You have two options to initialize the database:

### Option A: Manual via Supabase Dashboard (Recommended)
1.  Go to the **SQL Editor** in your Supabase dashboard.
2.  Open [seed.sql](file:///d:/Projects/MPPMS/seed.sql) and copy its contents.
3.  Paste into the SQL Editor and run it. This creates the tables, policies, and triggers.

### Option B: Using the automated script
1.  Ensure `DATABASE_URL` is set in your `.env`.
2.  Run the initialization script:
    ```bash
    node scripts/init-db.mjs
    ```
    *Note: This script also seeds initial mock data and creates the admin user specified in your `.env`.*

## Step 4: Admin Account Setup

If you used **Option A**, you'll need to create an admin user:
1.  Go to **Authentication > Users** in Supabase and create a new user.
2.  Once created, go to the **SQL Editor** and run:
    ```sql
    UPDATE profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';
    ```

If you used **Option B**, the admin user is automatically created based on `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your `.env`.

## Step 5: Start Development

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Important Notes

-   **Storage**: Ensure you have a storage bucket named `papers` in Supabase with public access if you want to upload PDFs.
-   **RBAC**: Only users with the `admin` role in the `profiles` table can access the Admin Dashboard. All authenticated users can add or edit papers.
