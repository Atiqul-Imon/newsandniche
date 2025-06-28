import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Navigation from "@/app/components/Navigation";
import TableOfContents from "@/app/components/TableOfContents";
import { generateMetadata as generateSEOMetadata, generateStructuredData, generateBreadcrumbStructuredData, extractExcerpt, calculateReadingTime as calculateReadingTimeUtil } from "@/app/lib/seo";
import FeaturedImageWithFallback from "@/app/components/FeaturedImageWithFallback";

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

// Fetch single post from API with robust error handling
async function getBlogPost(slug: string) {
  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    console.error('Invalid slug provided:', slug);
    return { post: null, error: 'Invalid slug' };
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/posts/slug/${slug}`, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return { post: null, error: 'Post not found' };
      }
      if (response.status >= 500) {
        console.error('Server error fetching post:', response.status);
        return { post: null, error: 'Server error occurred' };
      }
      const errorData = await response.json().catch(() => ({}));
      console.error('API error fetching post:', errorData);
      return { post: null, error: errorData.message || 'Failed to fetch post' };
    }
    
    const data = await response.json();
    
    // Validate post data structure
    if (!data.post || typeof data.post !== 'object') {
      console.error('Invalid post data structure:', data);
      return { post: null, error: 'Invalid post data' };
    }

    // Ensure required fields exist
    const requiredFields = ['title', 'content', 'slug', 'author', 'category'];
    const missingFields = requiredFields.filter(field => !data.post[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required post fields:', missingFields);
      return { post: null, error: 'Post data incomplete' };
    }

    return { post: data.post, error: null };
  } catch (error) {
    console.error('Network error fetching post:', error);
    return { post: null, error: 'Network error occurred' };
  }
}

// Generate metadata for the page with error handling
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const { post, error } = await getBlogPost(slug);

    if (error || !post) {
      return {
        title: 'Post Not Found | News&Niche',
        description: 'The requested blog post could not be found.',
        robots: 'noindex, nofollow',
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://newsandniche.com';
    const postUrl = `${baseUrl}/blog/${slug}`;
    const excerpt = extractExcerpt(post.content || post.excerpt || '', 160);
    const readingTime = calculateReadingTimeUtil(post.content || '');
    const wordCount = post.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;

    return generateSEOMetadata({
      title: post.title,
      description: post.seoDescription || excerpt,
      keywords: post.seoKeywords || post.tags || [],
      image: post.featuredImage,
      url: postUrl,
      type: 'article',
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt,
      author: post.author?.name,
      section: getCategoryName(post.category),
      tags: post.tags,
      readingTime,
      wordCount,
    });
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error | News&Niche',
      description: 'An error occurred while loading the page.',
      robots: 'noindex, nofollow',
    };
  }
}

// Fetch related posts with robust error handling
async function getRelatedPosts(category: any, currentSlug: string) {
  if (!category || !currentSlug) {
    console.error('Missing category or currentSlug for related posts');
    return [];
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const categoryId = typeof category === 'object' && category._id ? category._id : category;
    const response = await fetch(`${apiUrl}/api/posts?status=published&category=${categoryId}&limit=3`, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch related posts:', response.status);
      return [];
    }
    
    const data = await response.json();
    
    if (!data.posts || !Array.isArray(data.posts)) {
      console.error('Invalid related posts data:', data);
      return [];
    }

    return data.posts
      .filter((post: any) => post.slug !== currentSlug && post.title && post.slug)
      .slice(0, 3);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

// Calculate reading time with validation
function calculateReadingTime(content: string): number {
  if (!content || typeof content !== 'string') {
    return 1;
  }
  const wordsPerMinute = 200;
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

// Extract headings from content with validation
function extractHeadingsFromContent(content: string) {
  if (!content || typeof content !== 'string') return [];
  
  try {
    const headingRegex = /<(h[1-3])[^>]*>(.*?)<\/\1>/gi;
    const headings: { id: string; text: string; level: number }[] = [];
    let match;
    
    while ((match = headingRegex.exec(content))) {
      const tag = match[1];
      const text = match[2].replace(/<[^>]+>/g, '').trim();
      
      if (text && tag) {
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        headings.push({ id, text, level: Number(tag[1]) });
      }
    }
    
    return headings;
  } catch (error) {
    console.error('Error extracting headings:', error);
    return [];
  }
}

// Helper to inject IDs into headings in HTML string with validation
function addHeadingIdsToContent(content: string, headings: { id: string; text: string; level: number }[]) {
  if (!content || typeof content !== 'string') return content;
  if (!headings || !Array.isArray(headings)) return content;

  try {
    let newContent = content;
    headings.forEach(({ id, text, level }) => {
      if (id && text && level) {
        const regex = new RegExp(`<h${level}([^>]*)>${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</h${level}>`);
        newContent = newContent.replace(
          regex,
          `<h${level}$1 id="${id}">${text}</h${level}>`
        );
      }
    });
    return newContent;
  } catch (error) {
    console.error('Error adding heading IDs:', error);
    return content;
  }
}

// Error boundary component for the main content
function ErrorFallback({ error }: { error: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-6">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link 
          href="/blog" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Blog
        </Link>
      </div>
    </div>
  );
}

// Loading component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">লোড হচ্ছে...</p>
      </div>
    </div>
  );
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return <ErrorFallback error="Invalid post URL" />;
    }

    const { post, error } = await getBlogPost(slug);

    if (error || !post) {
      if (error === 'Post not found') {
        notFound();
      }
      return <ErrorFallback error={error || 'Post not found'} />;
    }

    // Fetch related posts
    const relatedPosts = await getRelatedPosts(post.category, slug);
    const readingTime = calculateReadingTimeUtil(post.content || '');

    // Extract headings for ToC
    const headings = extractHeadingsFromContent(post.content);
    // Inject IDs into headings in the HTML
    const contentWithIds = addHeadingIdsToContent(post.content, headings);

    // Generate structured data
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://newsandniche.com';
    const postUrl = `${baseUrl}/blog/${slug}`;
    const excerpt = extractExcerpt(post.content || post.excerpt || '', 160);
    const wordCount = post.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;

    const articleStructuredData = generateStructuredData({
      title: post.title,
      description: post.seoDescription || excerpt,
      image: post.featuredImage,
      url: postUrl,
      type: 'article',
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt,
      author: post.author?.name,
      section: getCategoryName(post.category),
      tags: post.tags,
      readingTime,
      wordCount,
    });

    const breadcrumbStructuredData = generateBreadcrumbStructuredData([
      { name: 'Home', url: baseUrl },
      { name: 'Blog', url: `${baseUrl}/blog` },
      { name: getCategoryName(post.category), url: `${baseUrl}/blog/category/${getCategorySlug(post.category)}` },
      { name: post.title, url: postUrl },
    ]);

    return (
      <div className="min-h-screen bg-white">
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbStructuredData),
          }}
        />

        <Navigation />
        
        {/* Reading Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
          <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: '0%' }} id="reading-progress"></div>
        </div>

        {/* Hero Section */}
        <FeaturedImageWithFallback
          src={post.featuredImage}
          alt={post.title}
          title={post.title}
          heightClass="h-96 md:h-[70vh]"
        />

        {/* Content Images Gallery */}
        {post.contentImages && Array.isArray(post.contentImages) && post.contentImages.length > 0 && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 bengali-heading">ছবির গ্যালারি</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {post.contentImages.map((imgUrl: string, idx: number) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`Content Image ${idx + 1}`}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Article Content */}
            <div className="lg:col-span-3">
              {/* Social Share */}
              <div className="flex items-center justify-between mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-600">Share:</span>
                  <button className="text-gray-700 hover:text-black transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </button>
                  <button className="text-gray-700 hover:text-black transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </button>
                  <button className="text-gray-700 hover:text-black transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </button>
                </div>
                <button className="text-gray-600 hover:text-gray-800 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
              </div>

              {/* Article Content */}
              {typeof post.content === 'string' && post.content.trim() ? (
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg prose-a:text-gray-900 prose-a:underline hover:prose-a:text-black prose-blockquote:border-l-4 prose-blockquote:border-gray-400 prose-blockquote:bg-gray-100 prose-blockquote:py-2 prose-blockquote:px-4 prose-img:rounded-lg prose-img:shadow-lg"
                  dangerouslySetInnerHTML={{ __html: contentWithIds }}
                />
              ) : (
                <div className="text-red-600 font-semibold text-center py-12">
                  Post content not available
                </div>
              )}

              {/* Tags */}
              {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <Link
                        key={tag}
                        href={`/blog/tag/${tag}`}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Bio */}
              <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mr-4 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {post.author?.name || 'Unknown Author'}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {post.author?.bio || 'A passionate writer sharing insights and stories.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Table of Contents */}
              {headings.length > 0 && (
                <div className="sticky top-8">
                  <TableOfContents headings={headings} />
                </div>
              )}

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Posts</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost: any) => (
                      <Link
                        key={relatedPost.slug}
                        href={`/blog/${relatedPost.slug}`}
                        className="block group"
                      >
                        <div className="h-24 bg-gray-200 rounded-lg mb-2 group-hover:bg-gray-300 transition-colors"></div>
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(relatedPost.createdAt).toLocaleDateString()}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter Signup */}
              <div className="mt-8 p-6 bg-blue-600 rounded-lg text-white">
                <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
                <p className="text-sm text-blue-100 mb-4">
                  Get the latest posts and updates delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-3 py-2 rounded text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <button className="w-full bg-white text-blue-600 px-4 py-2 rounded text-sm font-semibold hover:bg-gray-100 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reading Progress Script */}
        <script dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('scroll', () => {
              const scrollTop = window.pageYOffset;
              const docHeight = document.body.offsetHeight - window.innerHeight;
              const scrollPercent = (scrollTop / docHeight) * 100;
              const progressBar = document.getElementById('reading-progress');
              if (progressBar) {
                progressBar.style.width = scrollPercent + '%';
              }
            });
          `
        }} />
      </div>
    );
  } catch (error) {
    console.error('Unexpected error in BlogDetailPage:', error);
    return <ErrorFallback error="An unexpected error occurred" />;
  }
} 