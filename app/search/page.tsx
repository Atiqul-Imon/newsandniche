import { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/app/components/Navigation';
import { generateMetadata as generateSEOMetadata } from '@/app/lib/seo';
import type { IPost } from '../models/Post';
import type { ICategory } from '../models/Category';
import Image from 'next/image';

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string; category?: string }>;
}

function getCategoryName(category: ICategory | string): string {
  if (typeof category === 'object' && category !== null && 'name' in category) {
    return category.name;
  }
  if (typeof category === 'string') {
    return category;
  }
  return 'Uncategorized';
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || '';
  
  if (!query) {
    return {
      title: 'Search | News&Niche',
      description: 'Search through our collection of articles and blog posts.',
    };
  }

  return generateSEOMetadata({
    title: `Search Results for "${query}"`,
    description: `Search results for "${query}" - Find relevant articles and blog posts on News&Niche.`,
    keywords: ['search', query, 'articles', 'blog posts'],
    type: 'website',
  });
}

async function getSearchResults(query: string, page: number = 1, category?: string) {
  if (!query || query.trim().length < 2) {
    return { posts: [], total: 0, page: 1, totalPages: 0 };
  }

  try {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: '12',
    });
    
    if (category) {
      params.append('category', category);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/posts/search?${params}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }

    return await response.json();
  } catch (error) {
    console.error('Search error:', error);
    return { posts: [], total: 0, page: 1, totalPages: 0 };
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const page = parseInt(params.page || '1');
  const category = params.category;

  const { posts, total, totalPages, hasNextPage, hasPrevPage } = await getSearchResults(query, page, category);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-gray-600">
              {total} results found for &quot;{query}&quot;
            </p>
          )}
        </div>

        {!query ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Start Your Search
            </h2>
            <p className="text-gray-600 mb-8">
              Enter a search term to find articles and blog posts.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Posts
            </Link>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No Results Found
            </h2>
            <p className="text-gray-600 mb-8">
              We couldn&apos;t find any articles matching &quot;{query}&quot;. Try different keywords or browse our categories.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/blog"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse All Posts
              </Link>
              <Link
                href="/blog/category/technology"
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Technology
              </Link>
              <Link
                href="/blog/category/lifestyle"
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Lifestyle
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Search Results */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {posts.map((post: IPost & { category: ICategory | string }) => (
                <article key={String(post._id)} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gray-200 relative">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        width={300}
                        height={200}
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
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime || 5} min read</span>
                      <span className="mx-2">•</span>
                      <span>{post.viewCount || 0} views</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      <Link href={`/blog/${post.slug}`} className="hover:text-black">
                        <span dangerouslySetInnerHTML={{ __html: post.title }} />
                      </Link>
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      <span dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        By {typeof post.author === 'object' && post.author && 'name' in post.author ? (post.author as { name: string }).name : 'Unknown Author'}
                      </span>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-1">
                          {post.tags.slice(0, 2).map((tag: string) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                {hasPrevPage && (
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}${category ? `&category=${category}` : ''}`}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </Link>
                )}
                
                <span className="px-4 py-2 text-gray-600">
                  Page {page} of {totalPages}
                </span>
                
                {hasNextPage && (
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}${category ? `&category=${category}` : ''}`}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 