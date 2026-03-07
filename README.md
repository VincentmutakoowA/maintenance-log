## Start
Create supabase account. Login to dashboard
Create a project

## Setup database 
Create project.
1. Add types
2. Add tables.
Clone Database🧪
 👉 Dashboard → Database → Copy as SQL 
 Apply schema to new project
Open new project → SQL Editor
Paste → Run
## Note
1. When creating arrays use; images_paths text[],
That recreates: tables, indexes, triggers, functions, RLS policies, permissions
Basically your database skeleton.
3. Add function to create profile
4. Configure Row Level Security

## Storage
Storage → Create same bucket name

## Policies
1. 🔐 Copy ALL Policies
SELECT
  'CREATE POLICY "' || policyname || '" ON ' ||
  schemaname || '.' || tablename ||
  ' FOR ' || cmd ||
  CASE
    WHEN roles IS NULL THEN ''
    ELSE ' TO ' || array_to_string(roles, ', ')
  END ||
  COALESCE(' USING (' || qual || ')','') ||
  COALESCE(' WITH CHECK (' || with_check || ')','') || ';'
FROM pg_policies
WHERE schemaname NOT IN ('pg_catalog','information_schema')
ORDER BY tablename, policyname;

Copy Policies from old table
SELECT
  'CREATE POLICY "' || policyname || '" ON new_table_name FOR ' || cmd ||
  ' TO ' || array_to_string(roles, ', ') ||
  COALESCE(' USING (' || qual || ')','') ||
  COALESCE(' WITH CHECK (' || with_check || ')','') || ';'
FROM pg_policies
WHERE tablename = 'old_table_name'
AND schemaname = 'public';

2. Copy storage policies
SELECT
 'CREATE POLICY "' || policyname || '" ON storage.objects FOR ' || cmd ||
 ' TO ' || array_to_string(roles, ', ') ||
 COALESCE(' USING (' || qual || ')','') ||
 COALESCE(' WITH CHECK (' || with_check || ')','') || ';'
FROM pg_policies
WHERE schemaname='storage'
AND tablename='objects'
AND (
 qual ILIKE '%product_images%'
 OR with_check ILIKE '%product-images%'
);

2. Paste into new project SQL Editor.

# MORE
1. Copying Table 
CREATE TABLE new_table_name (LIKE old_table_name INCLUDING ALL);

## Set up env variables
Supabase public api url
NEXT_PUBLIC_SUPABASE_URL=xxxxxxx
Supabase API url source: Supabase Dashboard > integrations > API URLS

Supabase Publishable Key: 
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=xxxxxxxxx
Add admin role in profile source: Supabase Dashboard > Project settings > API Keys

## 
Set up /lib/config.ts
Add logo.png in /public and favicon.ico

## 🧠 Quick “did I copy everything?” checklist
✔ Tables exist
 ✔ RLS enabled
 ✔ Policies exist
 ✔ Buckets exist
 ✔ Files uploaded
 ✔ Env vars set
 ✔ Auth providers configured

## Getting Started
Development server, production build, production serve:
```bash
npm run dev
npm run build
npm run serve
# 
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build
Add app to production. e.g Vercel
Add admin accounts