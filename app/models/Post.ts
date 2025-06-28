import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  author: Types.ObjectId;
  category: Types.ObjectId;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  affiliateLinks: {
    title: string;
    url: string;
    platform: string;
    productName: string;
    price?: number;
    discount?: number;
    position: number;
  }[];
  readTime: number;
  viewCount: number;
  likeCount: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  contentImages?: string[];
}

const PostSchema = new Schema<IPost>({
  title: {
    type: String,
    required: [true, 'শিরোনাম প্রয়োজন'],
    trim: true,
    maxlength: [200, 'শিরোনাম ২০০ অক্ষরের বেশি হতে পারবে না']
  },
  slug: {
    type: String,
    required: [true, 'স্লাগ প্রয়োজন'],
    unique: true,
    lowercase: true,
    trim: true
  },
  content: {
    type: String,
    required: [true, 'কনটেন্ট প্রয়োজন'],
    minlength: [100, 'কনটেন্ট কমপক্ষে ১০০ অক্ষরের হতে হবে']
  },
  excerpt: {
    type: String,
    required: [true, 'সংক্ষিপ্ত বিবরণ প্রয়োজন'],
    maxlength: [300, 'সংক্ষিপ্ত বিবরণ ৩০০ অক্ষরের বেশি হতে পারবে না']
  },
  featuredImage: {
    type: String,
    required: [true, 'প্রধান ছবি প্রয়োজন']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'লেখক প্রয়োজন']
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'বিভাগ প্রয়োজন']
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  seoTitle: {
    type: String,
    maxlength: [60, 'SEO শিরোনাম ৬০ অক্ষরের বেশি হতে পারবে না']
  },
  seoDescription: {
    type: String,
    maxlength: [160, 'SEO বিবরণ ১৬০ অক্ষরের বেশি হতে পারবে না']
  },
  seoKeywords: [{
    type: String,
    trim: true
  }],
  affiliateLinks: [{
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    platform: {
      type: String,
      required: true,
      enum: ['daraz', 'amazon', 'flipkart', 'other']
    },
    productName: {
      type: String,
      required: true
    },
    price: {
      type: Number
    },
    discount: {
      type: Number
    },
    position: {
      type: Number,
      default: 0
    }
  }],
  readTime: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  publishedAt: {
    type: Date
  },
  contentImages: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Pre-save: generate slug and calculate read time
PostSchema.pre('save', async function(next) {
  // Slug generation
  if (this.isModified('title')) {
    let baseSlug = this.title
      .toLowerCase()
      .replace(/[^\u0980-\u09FFa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .trim();
    if (!baseSlug) baseSlug = 'post-' + Date.now();
    // Ensure slug uniqueness
    let uniqueSlug = baseSlug;
    let suffix = 1;
    const Post = mongoose.models.Post || mongoose.model('Post');
    while (await Post.findOne({ slug: uniqueSlug, _id: { $ne: this._id } })) {
      uniqueSlug = `${baseSlug}-${suffix}`;
      suffix++;
    }
    this.slug = uniqueSlug;
  }
  // Read time calculation
  if (this.content) {
    const wordCount = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }
  next();
});

// Indexes for performance
PostSchema.index({ title: 'text', content: 'text', tags: 'text' });
PostSchema.index({ slug: 1 });
PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ category: 1, status: 1 });

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema); 