import Link from "next/link";
import Navigation from "../components/Navigation";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bengali-heading">
            Products
          </h1>
          <p className="text-xl text-gray-600 bengali-text">
            Top products and affiliate links
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search for a product..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bengali-text"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bengali-text">
                <option>All Categories</option>
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Home & Life</option>
                <option>Books</option>
              </select>
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bengali-text">
                <option>All Platforms</option>
                <option>Daraaj</option>
                <option>Amajan</option>
                <option>Flipkart</option>
              </select>
              <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 bengali-heading">
            Categories
          </h2>
          <div className="flex flex-wrap gap-4">
            {[
              { name: 'All', count: '50', active: true },
              { name: 'Electronics', count: '20' },
              { name: 'Fashion', count: '15' },
              { name: 'Home & Life', count: '10' },
              { name: 'Books', count: '5' },
            ].map((category) => (
              <button
                key={category.name}
                className={`px-4 py-2 rounded-lg text-sm font-medium bengali-text ${
                  category.active
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {[1, 2, 3, 4, 5, 6].map((product) => (
            <div key={product} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <span className="text-4xl">📦</span>
                </div>
                <div className="absolute top-2 right-2 bg-gray-900 text-white px-2 py-1 rounded text-sm">
                  20% off
                </div>
                <div className="absolute bottom-2 left-2 bg-gray-700 text-white px-2 py-1 rounded text-xs">
                  Daraaj
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  Sample Product Name {product}
                </h3>
                <div className="flex items-center mb-3">
                  <span className="text-2xl font-bold text-red-600">৳১,৫০০</span>
                  <span className="text-gray-500 line-through ml-2">৳১,৮০০</span>
                  <span className="text-green-600 text-sm ml-2">20% off</span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  Short description and features of this product...
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    <span className="text-sm text-gray-600">4.5 (125 reviews)</span>
                  </div>
                  <span className="text-sm text-green-600">In stock</span>
                </div>
                <Link 
                  href={`/products/product-${product}`}
                  className="block w-full bg-black text-white text-center py-2 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 bengali-text">
              Previous
            </button>
            <button className="px-3 py-2 bg-gray-900 text-white rounded-lg bengali-text">1</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 bengali-text">2</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 bengali-text">3</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 bengali-text">
              Next
            </button>
          </nav>
        </div>
      </div>

      <footer className="bg-black text-white py-12 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">News&Niche</h3>
              <p className="text-gray-300">Your trusted source for quality products and affiliate links.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:underline text-gray-100">Home</Link></li>
                <li><Link href="/blog" className="hover:underline text-gray-100">Blog</Link></li>
                <li><Link href="/products" className="hover:underline text-gray-100">Products</Link></li>
                <li><Link href="/about" className="hover:underline text-gray-100">About</Link></li>
                <li><Link href="/contact" className="hover:underline text-gray-100">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><Link href="/auth/signin" className="hover:underline text-gray-100">Sign In</Link></li>
                <li><Link href="/auth/signup" className="hover:underline text-gray-100">Sign Up</Link></li>
                <li><Link href="/admin" className="hover:underline text-gray-100">Admin</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-500">© 2024 News&Niche. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 