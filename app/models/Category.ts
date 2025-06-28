import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  language: 'bn' | 'en';
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 120
  },
  description: {
    type: String,
    maxlength: 300
  },
  language: {
    type: String,
    enum: ['bn', 'en'],
    required: true,
    default: 'bn'
  }
}, {
  timestamps: true
});

// Pre-save: generate slug from name
CategorySchema.pre('save', function(next) {
  if (this.isNew || this.isModified('name')) {
    console.log('Generating slug for category:', this.name);
    let slug = this.name
      .toLowerCase()
      .replace(/[^\u0980-\u09FFa-z0-9\s-]/g, '') // keep Bengali, English, numbers, spaces, dashes
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .trim();
    if (!slug) {
      slug = 'category-' + Date.now();
    }
    this.slug = slug;
  }
  next();
});

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema); 