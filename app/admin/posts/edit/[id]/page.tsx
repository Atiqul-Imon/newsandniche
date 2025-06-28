"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import RichTextEditor from "@/app/components/RichTextEditor";
import { useLocalAuth } from "@/app/hooks/useLocalAuth";
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: authLoading } = useLocalAuth();
  const [formData, setFormData] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Post not found');
        }
        const data = await res.json();
        setFormData({
          ...data.post,
          tags: data.post.tags?.join(", ") || "",
          seoKeywords: data.post.seoKeywords?.join(", ") || "",
          category: data.post.category?._id || data.post.category || ""
        });
      } catch (err: any) {
        setError(err.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/categories`);
        const data = await res.json();
        setCategories(data.categories || []);
      } catch {}
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content: string) => {
    setFormData((prev: any) => ({ ...prev, content }));
  };

  const validateForm = () => {
    if (!formData.title?.trim()) {
      setError("Title is required");
      return false;
    }
    if (!formData.content?.trim() || formData.content.length < 100) {
      setError("Content must be at least 100 characters");
      return false;
    }
    if (!formData.excerpt?.trim()) {
      setError("Excerpt is required");
      return false;
    }
    if (!formData.category) {
      setError("Please select a category");
      return false;
    }
    if (!formData.featuredImage?.trim()) {
      setError("Featured image is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    if (authLoading) {
      setError("Please wait, authentication is loading...");
      setIsSubmitting(false);
      return;
    }
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    if (!user?._id) {
      setError("You must be logged in to update a post");
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user._id,
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map((tag: string) => tag.trim()).filter((tag: string) => tag),
          seoKeywords: formData.seoKeywords.split(",").map((k: string) => k.trim()).filter((k: string) => k),
        }),
      });
      if (!response.ok) {
        const text = await response.text();
        setError(text || "Failed to update post");
      } else {
        const data = await response.json();
        setSuccess("Post updated successfully!");
        setTimeout(() => {
          router.push("/admin/posts");
        }, 2000);
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  // Only author or admin can edit
  if (formData && user && formData.author && formData.author._id && user._id !== formData.author._id && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">You are not authorized to edit this post.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Post</h1>
            <p className="text-gray-600">Update your blog post</p>
          </div>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800">{success}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                placeholder="Enter post title"
              />
            </div>
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt *
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                required
                maxLength={300}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                placeholder="Enter post excerpt (max 300 characters)"
              />
              <p className="text-sm text-gray-500 mt-1">{formData.excerpt?.length || 0}/300</p>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formData.status || 'draft'}
                  label="Status"
                  onChange={handleInputChange}
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (separate with commas)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                placeholder="technology, programming, web development"
              />
            </div>
            <div>
              <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-2">
                SEO Title
              </label>
              <input
                type="text"
                id="seoTitle"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleInputChange}
                maxLength={60}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                placeholder="SEO meta title (max 60 chars)"
              />
            </div>
            <div>
              <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 mb-2">
                SEO Description
              </label>
              <textarea
                id="seoDescription"
                name="seoDescription"
                value={formData.seoDescription}
                onChange={handleInputChange}
                maxLength={160}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                placeholder="SEO meta description (max 160 chars)"
              />
            </div>
            <div>
              <label htmlFor="seoKeywords" className="block text-sm font-medium text-gray-700 mb-2">
                SEO Keywords (comma separated)
              </label>
              <input
                type="text"
                id="seoKeywords"
                name="seoKeywords"
                value={formData.seoKeywords}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                placeholder="keyword1, keyword2, ..."
              />
            </div>
            <div>
              <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image *
              </label>
              <input
                type="text"
                id="featuredImage"
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                placeholder="Paste image URL or upload"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content * (minimum 100 characters)
              </label>
              <RichTextEditor
                content={formData.content}
                onChange={handleContentChange}
              />
              <p className="text-sm text-gray-500 mt-1">
                Character count: {formData.content.replace(/<[^>]*>/g, '').length}
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/admin/posts')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Updating...' : 'Update Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 