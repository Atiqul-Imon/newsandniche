import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Category from '@/app/models/Category';

// GET: List all categories (optionally filter by language)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const query: any = {};
    if (language) query.language = language;
    const categories = await Category.find(query).sort({ name: 1 }).lean();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json({ message: 'ক্যাটাগরি লোড করতে সমস্যা হয়েছে' }, { status: 500 });
  }
}

// POST: Create a new category
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { name, description = '', language = 'bn' } = await request.json();
    
    if (!name || !language) {
      return NextResponse.json({ message: 'নাম এবং ভাষা প্রয়োজন' }, { status: 400 });
    }
    
    // Generate slug from name
    let slug = name
      .toLowerCase()
      .replace(/[^\u0980-\u09FFa-z0-9\s-]/g, '') // keep Bengali, English, numbers, spaces, dashes
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .trim();
    
    if (!slug) {
      slug = 'category-' + Date.now();
    }
    
    // Ensure slug uniqueness
    let uniqueSlug = slug;
    let suffix = 1;
    while (await Category.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${suffix}`;
      suffix++;
    }
    
    // Check for duplicate name
    const exists = await Category.findOne({ name, language });
    if (exists) {
      return NextResponse.json({ message: 'এই নামের ক্যাটাগরি ইতিমধ্যে আছে' }, { status: 409 });
    }
    
    const category = new Category({ 
      name, 
      description, 
      language,
      slug: uniqueSlug 
    });
    await category.save();
    
    return NextResponse.json({ message: 'ক্যাটাগরি তৈরি হয়েছে', category }, { status: 201 });
  } catch (error) {
    console.error('POST /api/categories error:', error);
    return NextResponse.json({ message: 'ক্যাটাগরি তৈরি করতে সমস্যা হয়েছে' }, { status: 500 });
  }
} 