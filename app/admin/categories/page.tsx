'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Category,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/app/components/AdminLayout';
import { useLocalAuth } from '@/app/hooks/useLocalAuth';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const { user, isLoading } = useLocalAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Add/Edit Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#1976d2',
  });

  useEffect(() => {
    if (isLoading) return;
    
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    fetchCategories();
  }, [user, isLoading, router]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (response.ok) {
        setCategories(data.categories || []);
      } else {
        setError('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await fetch(`/api/categories/${categoryToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setCategories(categories.filter(cat => cat._id !== categoryToDelete._id));
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
        setSuccess('Category deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category');
    }
  };

  const openDeleteDialog = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color || '#1976d2',
    });
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      color: '#1976d2',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const url = editingCategory 
        ? `/api/categories/${editingCategory._id}`
        : '/api/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (editingCategory) {
          setCategories(categories.map(cat => 
            cat._id === editingCategory._id ? data.category : cat
          ));
        } else {
          setCategories([...categories, data.category]);
        }
        setDialogOpen(false);
        setSuccess(editingCategory ? 'Category updated successfully' : 'Category created successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      setError('Failed to save category');
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading || loading) {
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Categories Management
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Organize your content with categories
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openAddDialog}
          >
            Add Category
          </Button>
        </Box>

        {/* Search */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <TextField
              fullWidth
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </CardContent>
        </Card>

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

        {/* Categories Table */}
        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Slug</TableCell>
                    <TableCell>Posts</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              backgroundColor: category.color || '#1976d2',
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {category.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {category.description || 'No description'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={category.slug} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={category.postCount || 0} 
                          size="small" 
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(category.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => openEditDialog(category)}
                            title="Edit Category"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => openDeleteDialog(category)}
                            title="Delete Category"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {filteredCategories.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Category sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="textSecondary">
                  {searchTerm ? 'No categories found matching your search.' : 'No categories found.'}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Category Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Category Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                label="Color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                type="color"
                fullWidth
                InputProps={{
                  style: { height: 56 }
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              disabled={!formData.name.trim()}
            >
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{categoryToDelete?.name}"? 
              {categoryToDelete && categoryToDelete.postCount > 0 && (
                <Typography component="span" color="error" sx={{ fontWeight: 'bold' }}>
                  {' '}This category has {categoryToDelete.postCount} posts and deleting it may affect those posts.
                </Typography>
              )}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
} 