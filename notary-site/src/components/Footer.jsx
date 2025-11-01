import { useState, useEffect, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import logoBlanc from '../assets/logo-blanc.svg';

const Footer = memo(() => {
  const [recentPosts, setRecentPosts] = useState([]);

  const fetchRecentPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('slug, title')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setRecentPosts(data || []);
    } catch (error) {
      console.error('Error fetching recent posts:', error);
    }
  }, []);

  useEffect(() => {
    fetchRecentPosts();
  }, [fetchRecentPosts]);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-[1300px] mx-auto px-[30px] py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo */}
          <div className="md:col-span-1">
            <a href="/" className="inline-block">
              <img
                src={logoBlanc}
                alt="Logo"
                width="120"
                className="h-8 w-auto"
              />
            </a>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="/#services" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Our services
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  How it work
                </a>
              </li>
              <li>
                <a href="/#faq" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              {recentPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm line-clamp-1"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/blog"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  See all resources &gt;
                </Link>
              </li>
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms-conditions" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Privacy policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-gray-400">Copyright © 2025 my notary</p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
