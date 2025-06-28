# সুপারব্লগ (SuperBlog) - বাংলা ব্লগিং প্ল্যাটফর্ম

A modern, responsive blogging platform built with Next.js 15, featuring Bengali language support, affiliate marketing integration, and comprehensive content management.

## 🌟 Features

### Core Features
- **Bengali Language Support**: Full Bengali typography and localization
- **Modern UI/UX**: Responsive design with Tailwind CSS
- **SEO Optimized**: Built-in SEO features for better search engine visibility
- **Performance Optimized**: Next.js 15 with App Router for optimal performance

### Blog System
- **Rich Content Management**: Create, edit, and manage blog posts
- **Category & Tag System**: Organize content with categories and tags
- **Featured Posts**: Highlight important content
- **Search & Filter**: Advanced search and filtering capabilities
- **Reading Time**: Automatic reading time calculation
- **View Count**: Track post popularity

### Affiliate Marketing
- **Multi-Platform Support**: Daraz, Amazon, Flipkart integration
- **Product Management**: Comprehensive product catalog
- **Affiliate Links**: Secure and trackable affiliate links
- **Price Tracking**: Monitor price changes and discounts
- **Call-to-Action**: Optimized CTA buttons for conversions

### Admin Panel
- **User Management**: Admin, editor, and user roles
- **Content Dashboard**: Overview of posts, products, and analytics
- **Media Management**: Cloudinary integration for image handling
- **SEO Tools**: Built-in SEO optimization tools

### Technical Features
- **MongoDB Database**: Scalable NoSQL database
- **Cloudinary Integration**: Optimized image upload and delivery
- **Authentication**: Secure user authentication system
- **API Routes**: RESTful API for CRUD operations
- **TypeScript**: Full TypeScript support for better development experience

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Cloudinary account
- NextAuth.js setup

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/superblog.git
   cd superblog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/superblog
   
   # NextAuth Configuration
   NEXTAUTH_SECRET=your-nextauth-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # Admin Credentials (for initial setup)
   ADMIN_EMAIL=admin@superblog.com
   ADMIN_PASSWORD=admin123
   
   # Daraz Affiliate Configuration
   DARAZ_AFFILIATE_ID=your-daraz-affiliate-id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
superblog/
├── app/
│   ├── admin/           # Admin dashboard pages
│   ├── api/             # API routes
│   │   ├── auth/        # Authentication endpoints
│   │   ├── posts/       # Blog post endpoints
│   │   └── products/    # Product endpoints
│   ├── blog/            # Blog pages
│   ├── components/      # Reusable components
│   ├── lib/             # Utility functions
│   ├── models/          # Database models
│   ├── products/        # Product pages
│   ├── types/           # TypeScript type definitions
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Homepage
├── public/              # Static assets
├── .env.local           # Environment variables
├── package.json         # Dependencies
└── README.md           # Project documentation
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Image Management**: Cloudinary
- **Deployment**: Vercel (recommended)

## 📝 Database Models

### User Model
- User authentication and role management
- Profile information and preferences
- Activity tracking

### Post Model
- Blog post content and metadata
- SEO optimization fields
- Affiliate link integration
- Category and tag management

### Product Model
- Product information and pricing
- Affiliate link management
- Platform integration (Daraz, Amazon, etc.)
- Inventory and availability tracking

## 🎨 Customization

### Bengali Font Configuration
The project uses Noto Sans Bengali for optimal Bengali text rendering. Font configuration is in `app/globals.css`.

### Styling
- Tailwind CSS classes with Bengali-specific utilities
- Custom CSS variables for consistent theming
- Responsive design patterns

### Content Management
- Admin panel for easy content management
- Rich text editor for blog posts
- Image upload and optimization
- SEO tools and meta tag management

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/logout` - User logout

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/[id]` - Get specific post
- `PUT /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/products/[id]` - Get specific product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Configure build settings for Next.js
- **Railway**: Deploy with MongoDB integration
- **DigitalOcean**: App Platform deployment

## 📊 Performance Optimization

- **Image Optimization**: Cloudinary CDN with automatic optimization
- **Code Splitting**: Next.js automatic code splitting
- **Caching**: Strategic caching for better performance
- **Lazy Loading**: Images and components lazy loading
- **SEO**: Optimized meta tags and structured data

## 🔒 Security Features

- **Authentication**: Secure user authentication
- **Input Validation**: Comprehensive input validation
- **CSRF Protection**: Built-in CSRF protection
- **XSS Prevention**: Content Security Policy
- **Rate Limiting**: API rate limiting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Email: support@superblog.com
- Documentation: [docs.superblog.com](https://docs.superblog.com)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the database solution
- Cloudinary for image management
- Bengali typography community

---

**সুপারব্লগ** - আপনার ডিজিটাল গল্পের জগৎ 🚀

## 🚀 Actionable SEO & Deployment Recommendations

1. **Set Environment Variables on Vercel:**
   - `NEXT_PUBLIC_SITE_URL` (e.g., https://yourdomain.com)
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `GOOGLE_SITE_VERIFICATION` (for Google Search Console)
   - Any other secrets (MongoDB, etc.)

2. **Check/Update HTML Language:**
   - If your main content is now English, change `<html lang="bn" ...>` to `<html lang="en" ...>` in `app/layout.tsx`.

3. **Add/Verify Favicon and Social Images:**
   - Ensure you have a favicon and a default Open Graph image in `/public`.

4. **Test with Google Search Console & Lighthouse:**
   - After deployment, submit your sitemap and test with Lighthouse for SEO, accessibility, and performance.

5. **Monitor Indexing:**
   - Use Google Search Console to monitor crawl/index status and fix any issues.

6. **Content Quality:**
   - Ensure every post/page has a unique, descriptive title and meta description.
   - Use headings (`<h1>`, `<h2>`, etc.) properly in your content.
