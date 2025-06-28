"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Visibility,
  Edit,
  Delete,
  Add,
  Article,
  Person,
  Category,
  ShoppingCart,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/app/components/AdminLayout';
import { useLocalAuth } from '@/app/hooks/useLocalAuth';

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, change, icon, color }: StatCardProps) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
            {value}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {change >= 0 ? (
              <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
            ) : (
              <TrendingDown sx={{ color: 'error.main', fontSize: 16, mr: 0.5 }} />
            )}
            <Typography
              variant="body2"
              color={change >= 0 ? 'success.main' : 'error.main'}
            >
              {Math.abs(change)}% from last month
            </Typography>
          </Box>
        </Box>
        <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

interface RecentPost {
  id: string;
  title: string;
  author: string;
  status: 'published' | 'draft';
  views: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const { user, isLoading } = useLocalAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalProducts: 0,
  });
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Fetch posts for stats
        const postsResponse = await fetch('/api/posts?status=all&limit=100');
        const postsData = await postsResponse.json();
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        
        // Fetch users (you'll need to create this endpoint)
        const usersResponse = await fetch('/api/users');
        const usersData = await usersResponse.json().catch(() => ({ users: [] }));
        
        setStats({
          totalPosts: postsData.posts?.length || 0,
          totalUsers: usersData.users?.length || 0,
          totalCategories: categoriesData.categories?.length || 0,
          totalProducts: 0, // You can add products later
        });

        // Set recent posts
        const recent = postsData.posts?.slice(0, 5).map((post: { _id: string; title: string; author?: { name: string }; status: string; viewCount?: number; createdAt: string }) => ({
          id: post._id,
          title: post.title,
          author: post.author?.name || 'Unknown',
          status: post.status as 'published' | 'draft',
          views: post.viewCount || 0,
          createdAt: new Date(post.createdAt).toLocaleDateString(),
        })) as RecentPost[] || [];

        setRecentPosts(recent);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, isLoading, router]);

  if (isLoading || loading) {
    return (
      <AdminLayout>
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'Total Posts',
      value: stats.totalPosts,
      change: 12,
      icon: <Article />,
      color: '#1976d2',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      change: 8,
      icon: <Person />,
      color: '#388e3c',
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      change: -3,
      icon: <Category />,
      color: '#f57c00',
    },
    {
      title: 'Products',
      value: stats.totalProducts,
      change: 25,
      icon: <ShoppingCart />,
      color: '#7b1fa2',
    },
  ];

  const getStatusColor = (status: string): 'success' | 'warning' | 'default' => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Welcome back, {user?.name}! Here&apos;s what&apos;s happening with your blog.
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3, 
          mb: 4 
        }}>
          {statCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </Box>

        {/* Recent Posts and Quick Actions */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 3 
        }}>
          {/* Recent Posts */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                  Recent Posts
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => router.push('/admin/posts/create')}
                >
                  New Post
                </Button>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Author</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Views</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {post.title}
                          </Typography>
                        </TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell>
                          <Chip
                            label={post.status}
                            color={getStatusColor(post.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Visibility sx={{ fontSize: 16, mr: 0.5 }} />
                            {post.views}
                          </Box>
                        </TableCell>
                        <TableCell>{post.createdAt}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => router.push(`/admin/posts/edit/${post.id}`)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Quick Actions
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => router.push('/admin/posts/create')}
                    fullWidth
                  >
                    Create New Post
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Category />}
                    onClick={() => router.push('/admin/categories')}
                    fullWidth
                  >
                    Manage Categories
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Person />}
                    onClick={() => router.push('/admin/users')}
                    fullWidth
                  >
                    View Users
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<ShoppingCart />}
                    onClick={() => router.push('/admin/products')}
                    fullWidth
                  >
                    Manage Products
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                  System Status
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Database</Typography>
                      <Chip label="Online" color="success" size="small" />
                    </Box>
                    <LinearProgress variant="determinate" value={100} />
                  </Box>
                  
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Storage</Typography>
                      <Typography variant="body2">75%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={75} />
                  </Box>
                  
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Performance</Typography>
                      <Typography variant="body2">92%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={92} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </AdminLayout>
  );
} 