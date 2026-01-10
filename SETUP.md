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

MPPMS uses an automated script to set up your tables, security policies, and initial data.

1.  Ensure `DATABASE_URL` is set in your `.env`.
2.  Run the initialization script:
    ```bash
    node scripts/init-db.mjs
    ```
    *This script creates the schema, sets up RBAC triggers, and seeds an admin user if `ADMIN_EMAIL` and `ADMIN_PASSWORD` are provided in your `.env`.*

## Step 4: Admin Account Access

If you provided admin credentials in your `.env`, you can now log in at `/auth` to access the Admin Dashboard. 

For Google OAuth users:
- Ensure `NEXT_PUBLIC_ADMIN_EMAIL` in `.env` matches your Google email to receive admin privileges automatically upon first login.

## Step 5: Start Development

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Important Notes

-   **Storage**: Ensure you have a storage bucket named `papers` in Supabase with public access if you want to upload PDFs.
-   **RBAC**: Only users with the `admin` role in the `profiles` table can access the Admin Dashboard. All authenticated users can add or edit papers.
