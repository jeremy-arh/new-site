# Supabase Setup Guide

## Prerequisites
1. Create a Supabase account at https://supabase.com
2. Create a new project

## Environment Variables Setup

1. Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

2. Fill in your Supabase credentials in the `.env` file:
   - `VITE_SUPABASE_URL`: Your Supabase project URL (found in Project Settings > API)
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon/public key (found in Project Settings > API)

## Database Setup

The blog posts table is already defined in the codebase. To create it in your Supabase project:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL script that creates the `blog_posts` table (provided in the project requirements)

## Table Structure

The `blog_posts` table includes:
- Basic fields: id, title, slug, excerpt, content
- Media: cover_image_url, cover_image_alt
- SEO: meta_title, meta_description, meta_keywords, canonical_url
- Organization: category, tags
- Author info: author_name, author_email, author_avatar_url, author_bio
- Publishing: status (draft/published/archived), published_at
- Metrics: views_count, read_time_minutes
- Featured posts: is_featured, featured_order
- Timestamps: created_at, updated_at

## Row Level Security (RLS)

For public access to published posts, create these policies in Supabase:

```sql
-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published posts
CREATE POLICY "Allow public read access to published posts"
ON blog_posts FOR SELECT
USING (status = 'published');

-- For authenticated users (admin/authors) to manage posts
CREATE POLICY "Allow authenticated users to insert posts"
ON blog_posts FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update posts"
ON blog_posts FOR UPDATE
USING (auth.role() = 'authenticated');
```

## Adding Sample Data

You can add sample blog posts via the Supabase dashboard or SQL:

```sql
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  status,
  author_name,
  category,
  published_at,
  read_time_minutes
) VALUES (
  'Getting Started with Online Notarization',
  'getting-started-with-online-notarization',
  'Learn how to notarize your documents online in just a few simple steps.',
  '<p>Online notarization has revolutionized the way we handle legal documents...</p>',
  'published',
  'John Doe',
  'Guides',
  NOW(),
  5
);
```

## Usage

Once setup is complete:
- Visit `/` for the homepage with featured blog articles
- Visit `/blog` for all blog articles
- Visit `/blog/:slug` for individual blog posts

## Features

- ✅ Automatic view counting
- ✅ Category filtering
- ✅ Reading time display
- ✅ Author information
- ✅ SEO-friendly metadata
- ✅ Tag system
- ✅ Featured posts support
- ✅ Responsive design
- ✅ Scroll animations
