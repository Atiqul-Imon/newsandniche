import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Post from "@/app/models/Post";

// GET - Fetch single post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    if (!slug || typeof slug !== 'string' || slug.length < 2) {
      return NextResponse.json(
        { message: "Invalid slug" },
        { status: 400 }
      );
    }
    const post = await Post.findOne({ slug })
      .populate("author", "name email")
      .populate("category", "name slug language")
      .lean() as any;
    if (!post) {
      return NextResponse.json(
        { message: "পোস্ট পাওয়া যায়নি" },
        { status: 404 }
      );
    }
    // Increment view count safely
    if (post && post._id) {
      await Post.updateOne({ _id: post._id }, { $inc: { viewCount: 1 } });
    }
    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { message: "পোস্ট লোড করতে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
} 