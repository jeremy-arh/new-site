import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const BlogSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="py-20 px-[30px] bg-white overflow-hidden">
      <div className="max-w-[1300px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4 scroll-fade-in">
            Our Blog
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 scroll-slide-up">
            Latest Articles &amp; Insights
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto scroll-slide-up">
            Stay informed about notarization, legal documents, and industry news
          </p>
        </div>

        {/* Blog Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No articles available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 scroll-slide-up"
              >
                {/* Cover Image */}
                {post.cover_image_url ? (
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={post.cover_image_url}
                      alt={post.cover_image_alt || post.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    {post.category && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-black text-white text-xs font-semibold rounded-full">
                        {post.category}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    {post.category && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-black text-white text-xs font-semibold rounded-full">
                        {post.category}
                      </span>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Meta Info */}
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      {post.author_avatar_url ? (
                        <img
                          src={post.author_avatar_url}
                          alt={post.author_name}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-xs font-semibold text-gray-600">
                            {post.author_name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span className="font-medium text-gray-700">{post.author_name}</span>
                    </div>
                    {post.read_time_minutes && (
                      <>
                        <span>•</span>
                        <span>{post.read_time_minutes} min read</span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      {formatDate(post.published_at)}
                    </span>
                    <div className="flex items-center gap-2 text-black font-medium text-sm group-hover:gap-3 transition-all">
                      Read more
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View All Button */}
        {posts.length > 0 && (
          <div className="text-center mt-12 scroll-fade-in">
            <Link to="/blog" className="primary-cta text-lg px-8 py-4 inline-flex items-center gap-3 transform hover:scale-105 transition-transform duration-300">
              <span className="btn-text inline-block">View All Articles</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
