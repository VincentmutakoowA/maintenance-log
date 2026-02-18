## Setup

Create supabase account. Login to dashboard

## Setup database 
Create project.
Add types
Add tables, add storage.
Add function to create profile
Configure Row Level Security

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

## Getting Started
First, run the development server:
```bash
npm run dev
# 
```
Build production ready:
```bash
npm run build
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build
Add app to production. e.g Vercel
Add admin accounts