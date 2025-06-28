'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent,
} from '@mui/material';
import {
  Save,
  CloudUpload,
  Add,
  Delete,
  ArrowBack,
} from '@mui/icons-material';
import RichTextEditor from '@/app/components/RichTextEditor';
import { useLocalAuth } from '@/app/hooks/useLocalAuth';
import AdminLayout from '@/app/components/AdminLayout';

export default function CreatePost() {
  const router = useRouter();
  const { user, isLoading } = useLocalAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    featuredImage: '',
    status: 'draft',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    contentImages: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [contentImageUploading, setContentImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentImagesInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<{_id: string, name: string, slug: string, language: string}[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', language: 'bn' });
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState('');

  // Get Cloudinary config from env
  const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  // Handle featured image upload
  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      setError('Cloudinary config missing in environment variables.');
      return;
    }
    setUploading(true);
    const formDataCloud = new FormData();
    formDataCloud.append('file', file);
    formDataCloud.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formDataCloud,
      });
      const data = await res.json();
      setFormData(prev => ({ ...prev, featuredImage: data.secure_url }));
    } catch {
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Handle multiple content images upload
  const handleContentImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      setError('Cloudinary config missing in environment variables.');
      return;
    }
    setContentImageUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const formDataCloud = new FormData();
      formDataCloud.append('file', file);
      formDataCloud.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formDataCloud,
        });
        const data = await res.json();
        urls.push(data.secure_url);
      } catch {
        setError('One or more content images failed to upload');
      }
    }
    setFormData(prev => ({ ...prev, contentImages: [...prev.contentImages, ...urls] }));
    setContentImageUploading(false);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.content.trim() || formData.content.length < 100) {
      setError('Content must be at least 100 characters');
      return false;
    }
    if (!formData.excerpt.trim()) {
      setError('Excerpt is required');
      return false;
    }
    if (!formData.category) {
      setError('Please select a category');
      return false;
    }
    if (!formData.featuredImage.trim()) {
      setError('Featured image is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    if (isLoading) {
      setError('Please wait, authentication is loading...');
      setIsSubmitting(false);
      return;
    }
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    if (!user?._id) {
      setError('You must be logged in to create a post');
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          seoKeywords: formData.seoKeywords.split(',').map(k => k.trim()).filter(k => k),
          authorId: user._id,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Failed to create post');
      } else {
        setSuccess('Post created successfully!');
        setTimeout(() => {
          router.push('/admin/posts');
        }, 2000);
      }
    } catch {
      setError('Network error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoryLoading(true);
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data.categories || []);
      } catch {
        setCategoryError('Failed to load categories');
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategories();
  }, [showCategoryModal]);

  // Create new category
  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      setCategoryError('Category name is required');
      return;
    }
    setCategoryLoading(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });
      const data = await res.json();
      if (res.ok) {
        setCategories([...categories, data.category]);
        setFormData(prev => ({ ...prev, category: data.category._id }));
        setShowCategoryModal(false);
        setNewCategory({ name: '', description: '', language: 'bn' });
      } else {
        setCategoryError(data.message || 'Failed to create category');
      }
    } catch {
      setCategoryError('Failed to create category');
    } finally {
      setCategoryLoading(false);
    }
  };

  const removeContentImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contentImages: prev.contentImages.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton onClick={() => router.push('/admin/posts')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Create New Post
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Write and publish your next blog post
            </Typography>
          </Box>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
            gap: 3 
          }}>
            {/* Main Content */}
            <Box>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Post Content
                  </Typography>
                  
                  <TextField
                    fullWidth
                    label="Post Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    sx={{ mb: 3 }}
                  />

                  <TextField
                    fullWidth
                    label="Excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                    required
                    sx={{ mb: 3 }}
                    helperText="A brief summary of your post"
                  />

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Content
                    </Typography>
                    <RichTextEditor
                      content={formData.content}
                      onChange={handleContentChange}
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* SEO Section */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    SEO Settings
                  </Typography>
                  
                  <TextField
                    fullWidth
                    label="SEO Title"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                    helperText="Leave empty to use post title"
                  />

                  <TextField
                    fullWidth
                    label="SEO Description"
                    name="seoDescription"
                    value={formData.seoDescription}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                    sx={{ mb: 2 }}
                    helperText="Leave empty to use post excerpt"
                  />

                  <TextField
                    fullWidth
                    label="SEO Keywords"
                    name="seoKeywords"
                    value={formData.seoKeywords}
                    onChange={handleInputChange}
                    helperText="Comma-separated keywords"
                  />
                </CardContent>
              </Card>
            </Box>

            {/* Sidebar */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Publish Settings */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Publish Settings
                  </Typography>
                  
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      label="Status"
                    >
                      <MenuItem value="draft">Draft</MenuItem>
                      <MenuItem value="published">Published</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      label="Category"
                      required
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => setShowCategoryModal(true)}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    Add New Category
                  </Button>

                  <TextField
                    fullWidth
                    label="Tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    helperText="Comma-separated tags"
                  />
                </CardContent>
              </Card>

              {/* Featured Image */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Featured Image
                  </Typography>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFeaturedImageUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  
                  <Button
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    onClick={() => fileInputRef.current?.click()}
                    fullWidth
                    disabled={uploading}
                    sx={{ mb: 2 }}
                  >
                    {uploading ? 'Uploading...' : 'Upload Featured Image'}
                  </Button>

                  {formData.featuredImage && (
                    <Box sx={{ mt: 2 }}>
                      <img
                        src={formData.featuredImage}
                        alt="Featured"
                        style={{
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                          borderRadius: 8,
                        }}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Content Images */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Content Images
                  </Typography>
                  
                  <input
                    type="file"
                    ref={contentImagesInputRef}
                    onChange={handleContentImagesUpload}
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                  />
                  
                  <Button
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    onClick={() => contentImagesInputRef.current?.click()}
                    fullWidth
                    disabled={contentImageUploading}
                    sx={{ mb: 2 }}
                  >
                    {contentImageUploading ? 'Uploading...' : 'Upload Content Images'}
                  </Button>

                  {formData.contentImages.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Uploaded Images:
                      </Typography>
                      {formData.contentImages.map((url, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <img
                            src={url}
                            alt={`Content ${index + 1}`}
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: 'cover',
                              borderRadius: 4,
                              marginRight: 8,
                            }}
                          />
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeContentImage(index)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                fullWidth
                size="large"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Post'}
              </Button>
            </Box>
          </Box>
        </form>

        {/* Category Modal */}
        <Dialog open={showCategoryModal} onClose={() => setShowCategoryModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Category Name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
              />
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={newCategory.language}
                  onChange={(e) => setNewCategory({ ...newCategory, language: e.target.value as 'bn' | 'en' })}
                  label="Language"
                >
                  <MenuItem value="bn">বাংলা</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </FormControl>
              {categoryError && (
                <Alert severity="error">{categoryError}</Alert>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCategoryModal(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateCategory} 
              variant="contained"
              disabled={categoryLoading || !newCategory.name.trim()}
            >
              {categoryLoading ? 'Creating...' : 'Create Category'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
} 