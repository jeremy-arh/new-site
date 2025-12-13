import { useState, useEffect, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useTranslation } from '../hooks/useTranslation';

const Footer = memo(() => {
  const { t } = useTranslation();
  // Retarder l'affichage du footer pour éviter le CLS
  const [isVisible, setIsVisible] = useState(false);
  const [recentPosts, setRecentPosts] = useState([
    { slug: '', title: 'Loading...' },
    { slug: '', title: 'Loading...' },
    { slug: '', title: 'Loading...' }
  ]);

  const fetchRecentPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('slug, title')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      if (data && data.length > 0) {
        setRecentPosts(data);
      }
    } catch (error) {
      console.error('Error fetching recent posts:', error);
    }
  }, []);

  useEffect(() => {
    fetchRecentPosts();
    // Attendre que le contenu principal soit rendu avant d'afficher le footer
    // Cela évite le CLS car le footer ne pousse plus le contenu
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [fetchRecentPosts]);

  // Ne pas rendre le footer tant que le contenu n'est pas prêt
  if (!isVisible) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-[1300px] mx-auto px-[30px] py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo */}
          <div className="md:col-span-1">
            <a href="/" className="inline-block">
              <img
                src="https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/b9d9d28f-0618-4a93-9210-8d9d18c3d200/public"
                alt="Logo"
                width="120"
                height="32"
                className="h-8 w-auto"
                style={{ aspectRatio: '120/32' }}
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

        {/* Disclaimer */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 leading-relaxed max-w-4xl mx-auto text-center">
            {t('footer.disclaimer')}
          </p>
        </div>

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
