import Image from "next/image";
import Link from "next/link";
import Navigation from "./components/Navigation";
import { Suspense } from "react";

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

// Fetch featured posts from API
async function getFeaturedPosts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/posts?status=published&limit=3`, {
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

function LoadingFeaturedPosts() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
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

async function FeaturedPosts(props: { limit: number }) {
  const { posts } = await getFeaturedPosts();

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2 bengali-heading">কোন পোস্ট পাওয়া যায়নি</h3>
        <p className="text-gray-600 bengali-text">এখনও কোন ব্লগ পোস্ট প্রকাশ করা হয়নি।</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.slice(0, props.limit).map((post: any) => (
        <article key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
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
          </div>
          <div className="p-6">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span>{getCategoryName(post.category)}</span>
              <span className="mx-2">•</span>
              <span>{post.readTime || 5} মিনিট পড়া</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 bengali-heading line-clamp-2">
              {post.title}
            </h3>
            <p className="text-gray-600 mb-4 bengali-text line-clamp-3">
              {post.excerpt}
            </p>
            <Link href={`/blog/${post.slug}`} className="text-gray-900 font-semibold underline underline-offset-2 hover:text-gray-700 transition-colors bengali-text">
              আরও পড়ুন →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

async function getLatestPosts(limit = 6) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/posts?status=published&limit=${limit}`, {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to fetch posts');
    return await response.json();
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    return { posts: [] };
  }
}

function LoadingLatestPosts() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
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

async function LatestPosts({ limit = 6 }) {
  const { posts } = await getLatestPosts(limit);
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2 bengali-heading">কোন পোস্ট পাওয়া যায়নি</h3>
        <p className="text-gray-600 bengali-text">এখনও কোন ব্লগ পোস্ট প্রকাশ করা হয়নি।</p>
      </div>
    );
  }
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post: any) => (
        <article key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
          <div className="h-48 bg-gray-200 relative">
            {post.featuredImage ? (
              <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <span className="text-4xl">📷</span>
              </div>
            )}
          </div>
          <div className="p-6">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span>{getCategoryName(post.category)}</span>
              <span className="mx-2">•</span>
              <span>{post.readTime || 5} মিনিট পড়া</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 bengali-heading line-clamp-2">{post.title}</h3>
            <p className="text-gray-600 mb-4 bengali-text line-clamp-3">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="text-gray-900 font-semibold underline underline-offset-2 hover:text-gray-700 transition-colors bengali-text">
              আরও পড়ুন →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

// Simple search bar without client-side state
function BlogSearchBar() {
  return (
    <form
      className="max-w-xl mx-auto mt-6"
      action="/search"
      method="GET"
    >
      <input
        type="text"
        name="q"
        placeholder="Search blog articles..."
        className="w-full px-6 py-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent text-lg"
        required
        minLength={2}
      />
    </form>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 style={{ color: '#111827', fontWeight: 800, fontSize: '2.5rem', marginBottom: '1rem' }}>
              Welcome to News&Niche
            </h1>
            <p style={{ color: '#374151', fontWeight: 500, fontSize: '1.25rem', marginBottom: '2rem', maxWidth: '40rem', marginLeft: 'auto', marginRight: 'auto' }}>
              The best place to read and discover the latest news, stories, and in-depth blog posts in both English and Bangla.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/blog" className="bg-white text-gray-900 border-2 border-gray-900 font-semibold flex items-center justify-center min-h-[48px] px-8 py-3 rounded-lg text-lg hover:bg-gray-900 hover:text-white transition-colors">
                Explore Blog
              </Link>
            </div>
            {/* Blog Search Bar */}
            <BlogSearchBar />
          </div>
        </div>
      </section>

      {/* Featured Posts - expanded */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Featured Blog Posts
          </h2>
          <Suspense fallback={<LoadingFeaturedPosts />}> 
            <FeaturedPosts limit={6} />
          </Suspense>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Latest Posts</h2>
          <Suspense fallback={<LoadingLatestPosts />}>
            <LatestPosts limit={6} />
          </Suspense>
        </div>
      </section>

      {/* Trending Tags */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Trending Tags</h2>
          <div className="flex flex-wrap gap-3">
            {["টেকনোলজি", "লাইফস্টাইল", "ফ্যাশন", "হেলথ", "SEO", "ওয়ার্ডপ্রেস"].map(tag => (
              <Link key={tag} href={`/blog/tag/${tag}`} className="px-4 py-2 rounded-full bg-white border border-gray-300 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-colors text-sm">
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.25rem', marginBottom: '1rem' }}>
                News&Niche
              </h3>
              <p style={{ color: '#d1d5db', fontWeight: 500, lineHeight: '1.6' }}>
                Your trusted source for quality content in both English and Bangla.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.125rem', marginBottom: '1rem' }}>
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" style={{ color: '#d1d5db', fontWeight: 500, textDecoration: 'none' }} className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/about" style={{ color: '#d1d5db', fontWeight: 500, textDecoration: 'none' }} className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" style={{ color: '#d1d5db', fontWeight: 500, textDecoration: 'none' }} className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.125rem', marginBottom: '1rem' }}>
                Categories
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog/category/technology" style={{ color: '#d1d5db', fontWeight: 500, textDecoration: 'none' }} className="hover:text-white transition-colors">
                    Technology
                  </Link>
                </li>
                <li>
                  <Link href="/blog/category/lifestyle" style={{ color: '#d1d5db', fontWeight: 500, textDecoration: 'none' }} className="hover:text-white transition-colors">
                    Lifestyle
                  </Link>
                </li>
                <li>
                  <Link href="/blog/category/health" style={{ color: '#d1d5db', fontWeight: 500, textDecoration: 'none' }} className="hover:text-white transition-colors">
                    Health
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.125rem', marginBottom: '1rem' }}>
                Connect
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/auth/signin" style={{ color: '#d1d5db', fontWeight: 500, textDecoration: 'none' }} className="hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup" style={{ color: '#d1d5db', fontWeight: 500, textDecoration: 'none' }} className="hover:text-white transition-colors">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/admin" style={{ color: '#d1d5db', fontWeight: 500, textDecoration: 'none' }} className="hover:text-white transition-colors">
                    Admin
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p style={{ color: '#9ca3af', fontWeight: 500 }}>
              © 2024 News&Niche. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
