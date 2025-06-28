import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  platform: 'daraz' | 'amazon' | 'flipkart' | 'other';
  productUrl: string;
  affiliateUrl: string;
  originalPrice: number;
  currentPrice: number;
  discountPercentage?: number;
  currency: string;
  category: string;
  subcategory?: string;
  brand?: string;
  images: string[];
  rating?: number;
  reviewCount?: number;
  availability: 'in_stock' | 'out_of_stock' | 'limited';
  features: string[];
  specifications: Record<string, unknown>;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'প্রোডাক্টের নাম প্রয়োজন'],
    trim: true,
    maxlength: [200, 'নাম ২০০ অক্ষরের বেশি হতে পারবে না']
  },
  description: {
    type: String,
    required: [true, 'প্রোডাক্টের বিবরণ প্রয়োজন'],
    maxlength: [1000, 'বিবরণ ১০০০ অক্ষরের বেশি হতে পারবে না']
  },
  platform: {
    type: String,
    required: [true, 'প্ল্যাটফর্ম প্রয়োজন'],
    enum: ['daraz', 'amazon', 'flipkart', 'other']
  },
  productUrl: {
    type: String,
    required: [true, 'প্রোডাক্ট URL প্রয়োজন'],
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'সঠিক URL দিন'
    }
  },
  affiliateUrl: {
    type: String,
    required: [true, 'অ্যাফিলিয়েট URL প্রয়োজন'],
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'সঠিক অ্যাফিলিয়েট URL দিন'
    }
  },
  originalPrice: {
    type: Number,
    required: [true, 'মূল মূল্য প্রয়োজন'],
    min: [0, 'মূল্য ০ এর কম হতে পারবে না']
  },
  currentPrice: {
    type: Number,
    required: [true, 'বর্তমান মূল্য প্রয়োজন'],
    min: [0, 'মূল্য ০ এর কম হতে পারবে না']
  },
  discountPercentage: {
    type: Number,
    min: [0, 'ছাড় ০ এর কম হতে পারবে না'],
    max: [100, 'ছাড় ১০০% এর বেশি হতে পারবে না']
  },
  currency: {
    type: String,
    default: 'BDT',
    enum: ['BDT', 'USD', 'INR', 'EUR']
  },
  category: {
    type: String,
    required: [true, 'বিভাগ প্রয়োজন'],
    enum: ['ইলেকট্রনিক্স', 'ফ্যাশন', 'হোম', 'বই', 'স্পোর্টস', 'বিউটি', 'টয়স', 'অন্যান্য']
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    required: [true, 'কমপক্ষে একটি ছবি প্রয়োজন']
  }],
  rating: {
    type: Number,
    min: [0, 'রেটিং ০ এর কম হতে পারবে না'],
    max: [5, 'রেটিং ৫ এর বেশি হতে পারবে না']
  },
  reviewCount: {
    type: Number,
    min: [0, 'রিভিউ সংখ্যা ০ এর কম হতে পারবে না']
  },
  availability: {
    type: String,
    enum: ['in_stock', 'out_of_stock', 'limited'],
    default: 'in_stock'
  },
  features: [{
    type: String,
    trim: true
  }],
  specifications: {
    type: Schema.Types.Mixed,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Calculate discount percentage
ProductSchema.pre('save', function(next) {
  if (this.originalPrice && this.currentPrice) {
    this.discountPercentage = Math.round(
      ((this.originalPrice - this.currentPrice) / this.originalPrice) * 100
    );
  }
  next();
});

// Index for better search performance
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ platform: 1, category: 1 });
ProductSchema.index({ isActive: 1, isFeatured: 1 });
ProductSchema.index({ currentPrice: 1 });
ProductSchema.index({ discountPercentage: -1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema); 