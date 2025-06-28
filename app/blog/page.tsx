import Link from "next/link";
import Navigation from "../components/Navigation";
import { Suspense } from "react";

// Fetch posts from API
async function getPosts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/posts?status=published`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [] };
  }
}

// Get categories with post counts - robust category handling
async function getCategories() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/posts?status=published`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    const data = await response.json();
    const categories = data.posts.reduce((acc: any, post: any) => {
      // Handle category as object or string
      const categoryKey = typeof post.category === 'object' && post.category?.name 
        ? post.category.name 
        : (typeof post.category === 'string' ? post.category : 'Uncategorized');
      
      acc[categoryKey] = (acc[categoryKey] || 0) + 1;
      return acc;
    }, {});
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {};
  }
}

// Helper function to safely get category name
function getCategoryName(category: any): string {
  if (typeof category === 'object' && category?.name) {
    return category.name;
  }
  if (typeof category === 'string') {
    return category;
  }
  return 'Uncategorized';
}

// Helper function to safely get category slug
function getCategorySlug(category: any): string {
  if (typeof category === 'object' && category?.slug) {
    return category.slug;
  }
  if (typeof category === 'string') {
    return category.toLowerCase().replace(/\s+/g, '-');
  }
  return 'uncategorized';
}

function LoadingPosts() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-6">
            <div className="h-4 bg-gray-200 rounded mb-3"></div>
            <div className="h-6 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

async function BlogPosts() {
  const { posts } = await getPosts();
  const categories = await getCategories();

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 bengali-heading">কোন পোস্ট পাওয়া যায়নি</h2>
        <p className="text-gray-600 bengali-text">এখনও কোন ব্লগ পোস্ট প্রকাশ করা হয়নি।</p>
      </div>
    );
  }

  return (
    <>
      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 bengali-heading">বিভাগসমূহ</h2>
        <div className="flex flex-wrap gap-4">
          <button className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white bengali-text">
            সব ({posts.length})
          </button>
          {Object.entries(categories).map(([category, count]) => (
            <button
              key={category}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 bengali-text"
            >
              {category} ({count as number})
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {posts.map((post: any) => (
          <article key={post._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gray-200 relative">
              {post.featuredImage ? (
                <img 
                  src={post.featuredImage} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <span className="text-4xl">📷</span>
                </div>
              )}
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                {getCategoryName(post.category)}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 mb-3 bengali-text">
                <span>{new Date(post.createdAt).toLocaleDateString('bn-BD')}</span>
                <span className="mx-2">•</span>
                <span>{post.readTime || 5} মিনিট পড়া</span>
                <span className="mx-2">•</span>
                <span>{post.viewCount || 0} ভিউ</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 bengali-heading line-clamp-2">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-4 bengali-text line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500 bengali-text">
                  <span className="mr-2">👤</span>
                  <span>{post.author?.name || 'অজানা লেখক'}</span>
                </div>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-semibold bengali-text"
                >
                  পড়ুন →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bengali-heading">
            ব্লগ
          </h1>
          <p className="text-xl text-gray-600 bengali-text">
            বাংলা ভাষায় লিখিত ব্লগ পোস্টসমূহ
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="পোস্ট খুঁজুন..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bengali-text"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bengali-text">
                <option>সব বিভাগ</option>
                <option>টেকনোলজি</option>
                <option>লাইফস্টাইল</option>
                <option>ফ্যাশন</option>
                <option>হেলথ</option>
              </select>
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bengali-text">
                <option>সর্বশেষ</option>
                <option>সবচেয়ে জনপ্রিয়</option>
                <option>সবচেয়ে বেশি পড়া</option>
              </select>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 bengali-text">
                খুঁজুন
              </button>
            </div>
          </div>
        </div>

        {/* Blog Posts */}
        <Suspense fallback={<LoadingPosts />}>
          <BlogPosts />
        </Suspense>

        {/* Newsletter */}
        <div className="bg-gray-900 rounded-lg p-8 mt-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4 bengali-heading">
            নতুন পোস্ট পেতে সাবস্ক্রাইব করুন
          </h2>
          <p className="text-gray-300 mb-6 bengali-text">
            আমাদের নিউজলেটারে যোগ দিন এবং নতুন ব্লগ পোস্ট সম্পর্কে জানুন
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="আপনার ইমেইল ঠিকানা"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white bengali-text"
            />
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 bengali-text">
              সাবস্ক্রাইব
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 