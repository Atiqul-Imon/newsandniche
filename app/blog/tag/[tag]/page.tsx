import Link from "next/link";

// Helper function to safely get category name
function getCategoryName(category: { name?: string } | string | null | undefined): string {
  if (typeof category === 'object' && category?.name) {
    return category.name;
  }
  if (typeof category === 'string') {
    return category;
  }
  return 'Uncategorized';
}

// This would be replaced with actual data fetching
const getTagPosts = async (tag: string) => {
  // Simulated tag posts data
  return {
    tag: tag,
    description: `${tag} ট্যাগের সাথে সম্পর্কিত সব ব্লগ পোস্ট`,
    posts: [
      {
        title: "নতুন প্রযুক্তির যুগে বাংলা ব্লগিং: একটি সম্পূর্ণ গাইড",
        slug: "technology-blogging-guide",
        excerpt: "বাংলা ভাষায় ব্লগিং করার গুরুত্ব এবং সুবিধাসমূহ নিয়ে বিস্তারিত আলোচনা।",
        featuredImage: "/api/placeholder/400/250",
        author: "আহমেদ হাসান",
        category: "টেকনোলজি",
        publishedAt: "২০২৪-০১-১৫",
        readTime: 8,
        viewCount: 1250,
        tags: ["ব্লগিং", "টেকনোলজি", "SEO"]
      },
      {
        title: "বাংলা ব্লগে SEO অপটিমাইজেশন",
        slug: "bangla-blog-seo-optimization",
        excerpt: "বাংলা ব্লগের জন্য SEO টিপস এবং ট্রিকস",
        featuredImage: "/api/placeholder/400/250",
        author: "সাবরিনা আক্তার",
        category: "টেকনোলজি",
        publishedAt: "২০২৪-০১-১০",
        readTime: 6,
        viewCount: 890,
        tags: ["SEO", "টেকনোলজি", "ব্লগিং"]
      },
      {
        title: "ওয়ার্ডপ্রেস ব্লগ সেটআপ গাইড",
        slug: "wordpress-blog-setup-guide",
        excerpt: "ওয়ার্ডপ্রেস দিয়ে বাংলা ব্লগ তৈরি করার সম্পূর্ণ গাইড",
        featuredImage: "/api/placeholder/400/250",
        author: "রহমান আলী",
        category: "টেকনোলজি",
        publishedAt: "২০২৪-০১-০৫",
        readTime: 12,
        viewCount: 1560,
        tags: ["ওয়ার্ডপ্রেস", "ব্লগিং", "টেকনোলজি"]
      }
    ],
    totalPosts: 12,
    currentPage: 1,
    totalPages: 2
  };
};

// Generate static params for common tags
export async function generateStaticParams() {
  const tags = [
    'ব্লগিং',
    'টেকনোলজি',
    'SEO',
    'অ্যাফিলিয়েট',
    'মার্কেটিং',
    'সোশ্যাল মিডিয়া',
    'আয়',
    'কনটেন্ট'
  ];

  return tags.map((tag) => ({
    tag: tag,
  }));
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const tagData = await getTagPosts(tag);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900 bengali-heading">
                সুপারব্লগ
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 bengali-text">
                হোম
              </Link>
              <Link href="/blog" className="text-blue-600 font-semibold bengali-text">
                ব্লগ
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-blue-600 bengali-text">
                প্রোডাক্ট
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 bengali-text">
                সম্পর্কে
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 bengali-text">
                যোগাযোগ
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-700 hover:text-blue-600 bengali-text">
                হোম
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link href="/blog" className="text-gray-700 hover:text-blue-600 bengali-text">
                  ব্লগ
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500 bengali-text">ট্যাগ</span>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500 bengali-text">#{tagData.tag}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <span className="text-2xl">🏷️</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 bengali-heading">
              #{tagData.tag}
            </h1>
            <p className="text-lg text-gray-600 mb-6 bengali-text">
              {tagData.description}
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 bengali-text">
              <span>{tagData.totalPosts} টি পোস্ট</span>
              <span>•</span>
              <span>সর্বশেষ আপডেট: {tagData.posts[0]?.publishedAt}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="পোস্ট খুঁজুন..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bengali-text"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bengali-text">
                <option>সব পোস্ট</option>
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {tagData.posts.map((post) => (
            <article key={post.slug} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <span className="text-4xl">📷</span>
                </div>
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                  {getCategoryName(post.category)}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3 bengali-text">
                  <span>{post.publishedAt}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime} মিনিট পড়া</span>
                  <span className="mx-2">•</span>
                  <span>{post.viewCount} ভিউ</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3 bengali-heading line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4 bengali-text line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500 bengali-text">লেখক: {post.author}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${tag}`}
                      className={`px-2 py-1 rounded text-xs bengali-text ${
                        tag === tagData.tag 
                          ? 'bg-gray-900 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-block bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black bengali-text font-semibold"
                >
                  পড়ুন →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 bengali-text">
              আগের
            </button>
            <button className="px-3 py-2 bg-gray-900 text-white rounded-lg bengali-text">১</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 bengali-text">২</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 bengali-text">
              পরের
            </button>
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 bengali-heading">সম্পর্কিত ট্যাগসমূহ</h2>
          <div className="flex flex-wrap gap-2">
            {["ব্লগিং", "টেকনোলজি", "SEO", "ওয়ার্ডপ্রেস", "মার্কেটিং", "সোশ্যাল মিডিয়া"].map((relatedTag) => (
              <Link
                key={relatedTag}
                href={`/blog/tag/${relatedTag}`}
                className={`px-3 py-2 rounded-lg text-sm font-medium bengali-text ${
                  relatedTag === tagData.tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                #{relatedTag}
              </Link>
            ))}
          </div>
        </div>

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