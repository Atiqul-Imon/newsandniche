import "@/app/models/User";
import "@/app/models/Category";
import "@/app/models/Post";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Post from "@/app/models/Post";
import User from "@/app/models/User";
import Category from "@/app/models/Category";
import mongoose from "mongoose";

// GET - Fetch all posts with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const status = searchParams.get("status") || "published";

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = new mongoose.Types.ObjectId(category);
      } else {
        return NextResponse.json({ message: "Invalid category ID" }, { status: 400 });
      }
    }
    if (tag) {
      query.tags = { $in: [tag] };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } }
      ];
    }
    if (status !== "all") {
      query.status = status;
    }

    // Get posts with pagination, populate author and category
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name email")
      .populate("category", "name slug language")
      .lean();

    // Get total count for pagination
    const total = await Post.countDocuments(query);

    return NextResponse.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { message: "পোস্ট লোড করতে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const {
      title,
      content,
      excerpt,
      category,
      tags,
      featuredImage,
      status = "draft",
      seoTitle,
      seoDescription,
      seoKeywords,
      contentImages,
      authorId // Get author ID from request body
    } = body;

    // Validation
    if (!title || !content || !excerpt || !category || !featuredImage || !authorId) {
      return NextResponse.json(
        { message: "শিরোনাম, বিষয়বস্তু, সংক্ষিপ্ত বিবরণ, ক্যাটাগরি, প্রধান ছবি এবং লেখক প্রয়োজন" },
        { status: 400 }
      );
    }
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return NextResponse.json({ message: "Invalid category ID" }, { status: 400 });
    }
    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      return NextResponse.json({ message: "Invalid author ID" }, { status: 400 });
    }
    if (content.length < 100) {
      return NextResponse.json({ message: "কনটেন্ট কমপক্ষে ১০০ অক্ষরের হতে হবে" }, { status: 400 });
    }
    if (excerpt.length > 300) {
      return NextResponse.json({ message: "সংক্ষিপ্ত বিবরণ ৩০০ অক্ষরের বেশি হতে পারবে না" }, { status: 400 });
    }
    // Generate slug from title (Bengali/English supported)
    let slug = title
      .toLowerCase()
      .replace(/[^\u0980-\u09FFa-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .trim();
    // Fallback if slug is empty
    if (!slug) {
      slug = `post-temp-${Date.now()}`;
    }
    // Ensure slug uniqueness
    let uniqueSlug = slug;
    let suffix = 1;
    while (await Post.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${suffix}`;
      suffix++;
    }
    slug = uniqueSlug;
    // Create new post
    const post = new Post({
      title,
      slug,
      content,
      excerpt,
      category: new mongoose.Types.ObjectId(category),
      tags: tags || [],
      featuredImage,
      status,
      author: new mongoose.Types.ObjectId(authorId),
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt || content.substring(0, 160),
      seoKeywords: seoKeywords || tags?.join(", ") || "",
      contentImages: contentImages || [],
      publishedAt: status === "published" ? new Date() : null
    });
    await post.save();
    return NextResponse.json({
      message: "পোস্ট সফলভাবে তৈরি হয়েছে",
      post: {
        id: post._id,
        title: post.title,
        slug: post.slug,
        status: post.status
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { message: "পোস্ট তৈরি করতে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
} 