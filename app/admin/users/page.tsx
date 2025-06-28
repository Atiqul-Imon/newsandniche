'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
} from '@mui/material';
import { Person } from '@mui/icons-material';
import AdminLayout from '@/app/components/AdminLayout';
import { useLocalAuth } from '@/app/hooks/useLocalAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UsersPage() {
  const { user, isLoading } = useLocalAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    
    if (!user) {
      router.push('/auth/signin');
      return;
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <AdminLayout>
        <Box sx={{ width: '100%' }}>
          <Typography>Loading...</Typography>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Users Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage user accounts and permissions
          </Typography>
        </Box>

        {/* Coming Soon Card */}
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 3 }} />
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Coming Soon
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
              User management features are currently under development.
            </Typography>
            <Alert severity="info" sx={{ maxWidth: 400, mx: 'auto' }}>
              This page will include user registration, role management, and account settings.
            </Alert>
          </CardContent>
        </Card>
      </Box>
    </AdminLayout>
  );
} 