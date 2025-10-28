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

The application uses two main tables: `blog_posts` and `services`. To create them in your Supabase project:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL scripts below to create both tables

### Services Table

```sql
CREATE TABLE public.services (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  service_id character varying(100) NOT NULL,
  name character varying(255) NOT NULL,
  description text NULL,
  icon character varying(100) NULL,
  color character varying(50) NULL,
  base_price numeric(10, 2) NULL,
  is_active boolean NULL DEFAULT true,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT services_pkey PRIMARY KEY (id),
  CONSTRAINT services_service_id_key UNIQUE (service_id)
) TABLESPACE pg_default;

-- Create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for services table
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### Blog Posts Table

The `blog_posts` table script is provided in the project requirements.

## Table Structures

### Services Table

The `services` table includes:
- `id`: UUID primary key
- `service_id`: Unique identifier for URL routing (e.g., 'apostille', 'power-of-attorney')
- `name`: Service name (e.g., 'Apostille', 'Power of Attorney')
- `description`: Service description
- `icon`: Iconify icon name (e.g., 'iconoir:badge-check', 'carbon:document')
- `color`: Optional color code for theming
- `base_price`: Starting price in USD
- `is_active`: Boolean to show/hide service
- `created_at`, `updated_at`: Timestamps

### Blog Posts Table

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

### Services Table RLS

```sql
-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active services
CREATE POLICY "Allow public read access to active services"
ON services FOR SELECT
USING (is_active = true);

-- For authenticated users (admin) to manage services
CREATE POLICY "Allow authenticated users to insert services"
ON services FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update services"
ON services FOR UPDATE
USING (auth.role() = 'authenticated');
```

### Blog Posts Table RLS

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

### Sample Services

Add services via the Supabase dashboard or SQL:

```sql
INSERT INTO services (service_id, name, description, icon, base_price, is_active) VALUES
('apostille', 'Apostille', 'Get your documents apostilled for international use. Valid in over 120 countries under the Hague Convention.', 'iconoir:badge-check', 119.00, true),
('power-of-attorney', 'Power of Attorney', 'Create a legally binding power of attorney document that allows someone to act on your behalf.', 'carbon:document', 119.00, true),
('affidavit', 'Affidavit', 'Notarize sworn written statements for use in legal proceedings or official matters.', 'carbon:document-signed', 89.00, true),
('identity-verification', 'Verification of Identity', 'Official verification of identity for visa applications, banking, and legal purposes.', 'carbon:id-management', 119.00, true),
('certified-copy', 'Certified Copy', 'Get certified true copies of your important documents such as diplomas, IDs, and certificates.', 'carbon:copy-file', 79.00, true);
```

### Sample Blog Posts

Add blog posts via the Supabase dashboard or SQL:

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
  '<h2>What is Online Notarization?</h2><p>Online notarization has revolutionized the way we handle legal documents...</p><h2>How Does It Work?</h2><p>The process is simple and secure...</p>',
  'published',
  'John Doe',
  'Guides',
  NOW(),
  5
);
```

## Usage

Once setup is complete:
- Visit `/` for the homepage with services and featured blog articles
- Visit `/services/:serviceId` for individual service details
- Visit `/blog` for all blog articles
- Visit `/blog/:slug` for individual blog posts

## Features

### Services
- ✅ Dynamic service loading from Supabase
- ✅ Custom icons with Iconify
- ✅ Service detail pages
- ✅ Pricing display
- ✅ Active/inactive filtering
- ✅ Responsive service cards

### Blog
- ✅ Automatic view counting
- ✅ Category filtering
- ✅ Reading time display
- ✅ Author information
- ✅ SEO-friendly metadata
- ✅ Tag system
- ✅ Featured posts support
- ✅ Table of contents sidebar
- ✅ Article CTA sections

### General
- ✅ Responsive design
- ✅ Scroll animations
- ✅ Mobile sticky CTA
- ✅ Smooth navigation
