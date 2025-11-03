import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import TableOfContents from '../components/TableOfContents';
import MobileCTA from '../components/MobileCTA';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasHeadings, setHasHeadings] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [slug]);

  // Add IDs to H2 elements after content is rendered
  useEffect(() => {
    if (post && contentRef.current) {
      const h2Elements = contentRef.current.querySelectorAll('h2');
      h2Elements.forEach((h2, index) => {
        if (!h2.id) {
          h2.id = `heading-${index}`;
        }
        h2.classList.add('scroll-fade-in');
      });
    }
  }, [post]);

  useEffect(() => {
    if (!post?.content || typeof DOMParser === 'undefined') {
      setHasHeadings(false);
      return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(post.content, 'text/html');
    const h2Elements = doc.querySelectorAll('h2');

    setHasHeadings(h2Elements.length > 0);
  }, [post]);


  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;

      if (data) {
        setPost(data);
        // Increment view count
        await supabase
          .from('blog_posts')
          .update({ views_count: (data.views_count || 0) + 1 })
          .eq('id', data.id);
      } else {
        setError('Article not found');
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setError('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const computedReadTime = useMemo(() => {
    if (!post) return null;
    if (post.read_time_minutes) return post.read_time_minutes;

    if (!post.content || typeof DOMParser === 'undefined') {
      return null;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(post.content, 'text/html');
    const textContent = doc.body?.textContent || '';
    const words = textContent.trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) return null;

    return Math.max(1, Math.round(words.length / 200));
  }, [post]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-4 md:mb-6 leading-tight">Article Not Found</h1>
        <p className="text-gray-600 mb-8">{error || 'The article you\'re looking for doesn\'t exist.'}</p>
        <Link to="/" className="primary-cta text-lg px-8 py-4">
          <span className="btn-text inline-block">Back to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{post.meta_title || post.title || 'Blog Post'}</title>
        <meta name="description" content={post.meta_description || post.excerpt || ''} />
      </Helmet>
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-[30px] bg-gray-50">
        <div className="max-w-[900px] mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6 animate-fade-in">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">
              Blog
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{post.title}</span>
          </nav>

          {/* Category Badge */}
          {post.category && (
            <div className="mb-4 animate-fade-in animation-delay-100">
              <span className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold">
                {post.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl text-gray-900 mb-4 md:mb-6 leading-tight animate-fade-in animation-delay-200">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8 animate-fade-in animation-delay-300">
            <span>{formatDate(post.published_at)}</span>
            {computedReadTime && (
              <>
                <span>•</span>
                <span>{computedReadTime} min read</span>
              </>
            )}
            {post.views_count > 0 && (
              <>
                <span>•</span>
                <span>{post.views_count} views</span>
              </>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 animate-fade-in animation-delay-400">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cover Image */}
      {post.cover_image_url && (
        <section className="px-[30px] -mt-8 mb-12 animate-fade-in animation-delay-500">
          <div className="max-w-[780px] mx-auto">
            <img
              src={post.cover_image_url}
              alt={post.cover_image_alt || post.title}
              className="w-full h-auto rounded-3xl shadow-2xl"
            />
          </div>
        </section>
      )}

      {/* Content with Table of Contents */}
      <article className="px-[30px] pb-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-8">
              <div
                ref={contentRef}
                className="blog-content animate-fade-in animation-delay-600"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Table of Contents */}
            <div className="lg:col-span-4">
              {hasHeadings && post.content && <TableOfContents content={post.content} />}
            </div>
          </div>
        </div>
      </article>

      {/* CTA Section */}
      <section className="px-[30px] pb-20">
        <div className="max-w-[780px] mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12 text-center border border-gray-200 shadow-lg">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Notarize your documents online in just a few minutes. Secure, legally valid, and recognized internationally.
            </p>
            <a
              href="#"
              className="primary-cta text-lg px-8 py-4 inline-flex items-center gap-3 transform hover:scale-105 transition-transform duration-300"
            >
              <span className="btn-text inline-block">Book an appointment</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>


      {/* Back to Blog */}
      <section className="px-[30px] pb-20">
        <div className="max-w-[780px] mx-auto text-center">
          <Link to="/blog" className="primary-cta text-lg px-8 py-4 inline-flex items-center gap-3">
            <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="btn-text inline-block">Back to Blog</span>
          </Link>
        </div>
      </section>
      <MobileCTA />
    </div>
  );
};

export default BlogPost;
