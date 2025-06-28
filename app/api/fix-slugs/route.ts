import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Post from "@/app/models/Post";

// POST - Fix slugs for existing posts
export async function POST() {
  try {
    await connectDB();

    // Find posts with invalid slugs
    const postsToFix = await Post.find({
      $or: [
        { slug: { $exists: false } },
        { slug: "" },
        { slug: "-" },
        { slug: null }
      ]
    });

    let fixedCount = 0;
    const results = [];

    for (const post of postsToFix) {
      if (post.title) {
        // Generate new slug
        let newSlug = post.title
          .toLowerCase()
          .replace(/[^\u0980-\u09FFa-z0-9\s-]/g, "") // Allow Bengali + English + numbers + spaces + hyphens
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
          .trim();

        // If slug is still empty, use a fallback
        if (!newSlug) {
          newSlug = `post-${post._id.toString().slice(-6)}`;
        }

        // Check if slug already exists
        const existingPost = await Post.findOne({ 
          slug: newSlug, 
          _id: { $ne: post._id } 
        });

        if (existingPost) {
          // Add timestamp to make it unique
          newSlug = `${newSlug}-${Date.now().toString().slice(-6)}`;
        }

        // Update the post
        post.slug = newSlug;
        await post.save();
        
        fixedCount++;
        results.push({
          id: post._id,
          title: post.title,
          oldSlug: post.slug,
          newSlug: newSlug
        });
      }
    }

    return NextResponse.json({
      message: `${fixedCount} পোস্টের স্লাগ ঠিক করা হয়েছে`,
      fixedCount,
      results
    });

  } catch (error) {
    console.error("Error fixing slugs:", error);
    return NextResponse.json(
      { message: "স্লাগ ঠিক করতে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
} 