import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Post from '@/app/models/Post';
import User from '@/app/models/User';
import mongoose from 'mongoose';

// Helper: get user from header
async function getUserFromRequest(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) return null;
  await connectDB();
  const user = await User.findById(userId).lean() as any;
  return user;
}

// GET - Fetch a post by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid post ID' }, { status: 400 });
    }
    const post = await Post.findById(id)
      .populate('author', 'name email')
      .populate('category', 'name slug language')
      .lean();
    if (!post) {
      return NextResponse.json({ message: 'পোস্ট পাওয়া যায়নি' }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ message: 'পোস্ট লোড করতে সমস্যা হয়েছে' }, { status: 500 });
  }
}

// PATCH - Update a post by ID
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid post ID' }, { status: 400 });
    }
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    // Only author or admin can update
    if (post.author.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }
    const body = await request.json();
    // Only allow updating certain fields
    const allowedFields = [
      'title', 'content', 'excerpt', 'category', 'tags', 'featuredImage', 'status',
      'seoTitle', 'seoDescription', 'seoKeywords', 'contentImages', 'isFeatured', 'affiliateLinks', 'publishedAt'
    ];
    const update: any = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) update[key] = body[key];
    }
    // Validate category if present
    if (update.category && !mongoose.Types.ObjectId.isValid(update.category)) {
      return NextResponse.json({ message: 'Invalid category ID' }, { status: 400 });
    }
    // Validate content length
    if (update.content && update.content.length < 100) {
      return NextResponse.json({ message: 'কনটেন্ট কমপক্ষে ১০০ অক্ষরের হতে হবে' }, { status: 400 });
    }
    // Validate excerpt length
    if (update.excerpt && update.excerpt.length > 300) {
      return NextResponse.json({ message: 'সংক্ষিপ্ত বিবরণ ৩০০ অক্ষরের বেশি হতে পারবে না' }, { status: 400 });
    }
    // If title is updated, regenerate slug and ensure uniqueness
    if (update.title) {
      let slug = update.title
        .toLowerCase()
        .replace(/[^\u0080-\u00FFa-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .trim();
      if (!slug) slug = 'post-' + Date.now();
      let uniqueSlug = slug;
      let suffix = 1;
      while (await Post.findOne({ slug: uniqueSlug, _id: { $ne: id } })) {
        uniqueSlug = `${slug}-${suffix}`;
        suffix++;
      }
      update.slug = uniqueSlug;
    }
    // Update the post
    const updated = await Post.findByIdAndUpdate(id, update, { new: true })
      .populate('author', 'name email')
      .populate('category', 'name slug language')
      .lean();
    return NextResponse.json({ message: 'Post updated', post: updated });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ message: 'পোস্ট আপডেট করতে সমস্যা হয়েছে' }, { status: 500 });
  }
}

// DELETE - Delete a post by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid post ID' }, { status: 400 });
    }
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    // Only author or admin can delete
    if (post.author.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }
    const deleted = await Post.findByIdAndDelete(id)
      .populate('author', 'name email')
      .populate('category', 'name slug language')
      .lean();
    return NextResponse.json({ message: 'Post deleted', post: deleted });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ message: 'পোস্ট ডিলিট করতে সমস্যা হয়েছে' }, { status: 500 });
  }
} 