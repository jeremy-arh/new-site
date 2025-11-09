import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate that environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = `
⚠️ MISSING SUPABASE ENVIRONMENT VARIABLES ⚠️

Please configure the following environment variables in Cloudflare Pages:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

Steps:
1. Go to your Cloudflare Pages project
2. Settings > Environment variables
3. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
4. Redeploy your project

Current status:
- VITE_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}
- VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Set' : '❌ Missing'}
  `;
  console.error(errorMsg);
  throw new Error('Supabase environment variables are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Cloudflare Pages.');
}

// Create Supabase client with valid credentials
let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('✅ Supabase client initialized successfully');
} catch (error) {
  console.error('❌ Error creating Supabase client:', error);
  throw error;
}

export { supabase };
