import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getBlogPosts, BlogPostListItem } from "../services/api";

const BACKEND_BASE_URL = "http://127.0.0.1:8000";

const BlogPostCard: React.FC<{ post: BlogPostListItem }> = ({ post }) => (
  <Link
    to={`/blog/${post.slug}`}
    className="group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-white flex flex-col h-full"
  >
    {/* Image Section */}
    <div className="relative h-48 w-full overflow-hidden">
      <img
        src={
          post.featured_image
            ? `${BACKEND_BASE_URL}${post.featured_image}`
            : "https://via.placeholder.com/400x300?text=OpenEire"
        }
        alt={post.title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>

    {/* Content Section */}
    <div className="p-6 flex flex-col flex-grow">
      {/* Date & Author */}
      <div className="text-xs text-gray-500 mb-2 flex justify-between">
        <span>By {post.author}</span>
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">
        {post.title}
      </h2>
      
      <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
        {post.excerpt}
      </p>

      {/* Footer: Tags & Likes */}
      <div className="mt-auto border-t pt-4 flex items-center justify-between">
        {/* Tags (Show first 2 only to keep card clean) */}
        <div className="flex gap-2 flex-wrap">
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
               #{tag}
            </span>
          ))}
          {post.tags.length > 2 && <span className="text-xs text-gray-400">+{post.tags.length - 2}</span>}
        </div>

        {/* Like Count Icon */}
        <div className="flex items-center text-gray-400 text-sm">
           <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
             <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
           </svg>
           {post.likes_count}
        </div>
      </div>
    </div>
  </Link>
);

const BlogListPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get the 'tag' from URL ?tag=travel
  const currentTag = searchParams.get('tag');

  useEffect(() => {
    setLoading(true);
    // Pass the tag to the API call
    getBlogPosts(currentTag || undefined)
      .then((response) => setPosts(response.results))
      .catch((error) => console.error("Failed to fetch blog posts:", error))
      .finally(() => setLoading(false));
  }, [currentTag]); // Re-run when tag changes

  return (
    <div className="container mx-auto p-4 lg:p-8 min-h-[60vh]">
      <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">The OpenEire Blog</h1>
          <p className="text-gray-500">Stories, tips, and updates from the field.</p>
          
          {/* Active Filter Display */}
          {currentTag && (
              <div className="mt-4 inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
                  <span>Showing results for: <strong>#{currentTag}</strong></span>
                  <Link 
                    to="/blog" 
                    className="ml-3 text-green-600 hover:text-green-900 font-bold"
                    onClick={() => setSearchParams({})}
                  >
                      ✕ Clear
                  </Link>
              </div>
          )}
      </div>

      {loading ? (
        <div className="text-center p-8 text-gray-500">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900">No posts found.</h3>
            <p className="text-gray-500">Try clearing your filters or come back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogListPage;