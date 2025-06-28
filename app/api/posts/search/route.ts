import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Post from '@/app/models/Post';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'published';
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ 
        posts: [], 
        total: 0, 
        page, 
        totalPages: 0,
        message: 'Search query must be at least 2 characters long' 
      });
    }

    // Build search filter
    const filter: any = {
      status,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { excerpt: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    };

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.category = new mongoose.Types.ObjectId(category);
      } else {
        return NextResponse.json({ message: "Invalid category ID" }, { status: 400 });
      }
    }

    // Execute search with pagination
    const skip = (page - 1) * limit;
    
    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('author', 'name email bio')
        .populate('category', 'name slug language')
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('title slug excerpt featuredImage category tags author publishedAt createdAt viewCount readTime')
        .lean(),
      Post.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    // Highlight search terms in results
    const highlightedPosts = posts.map((post: any) => ({
      ...post,
      title: highlightText(post.title, query),
      excerpt: highlightText(post.excerpt, query),
      _id: post._id.toString(),
      author: post.author ? {
        ...post.author,
        _id: post.author._id.toString()
      } : null,
      category: post.category ? {
        ...post.category,
        _id: post.category._id.toString()
      } : null
    }));

    return NextResponse.json({
      posts: highlightedPosts,
      total,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      query
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search posts' },
      { status: 500 }
    );
  }
}

// Helper function to highlight search terms
function highlightText(text: string, query: string): string {
  if (!text || !query) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
} 