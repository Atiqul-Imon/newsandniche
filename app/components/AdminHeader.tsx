'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Home,
  Article,
  ShoppingCart,
  Info,
  ContactSupport,
  Person,
  Logout,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useLocalAuth } from '@/app/hooks/useLocalAuth';

export default function AdminHeader() {
  const { user, logout } = useLocalAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    router.push('/auth/signin');
  };

  const navigationItems = [
    { label: 'Home', href: '/', icon: <Home /> },
    { label: 'Blog', href: '/blog', icon: <Article /> },
    { label: 'Products', href: '/products', icon: <ShoppingCart /> },
    { label: 'About', href: '/about', icon: <Info /> },
    { label: 'Contact', href: '/contact', icon: <ContactSupport /> },
  ];

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: 'white', 
        color: 'text.primary',
        boxShadow: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        {/* Logo */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 0, 
            fontWeight: 'bold',
            color: 'primary.main',
            cursor: 'pointer',
          }}
          onClick={() => router.push('/')}
        >
          News&Niche
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ flexGrow: 1, display: 'flex', ml: 4, gap: 1 }}>
          {navigationItems.map((item) => (
            <Button
              key={item.label}
              startIcon={item.icon}
              onClick={() => router.push(item.href)}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'action.hover',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Admin Panel
          </Typography>
          
          <IconButton
            onClick={handleMenuOpen}
            sx={{ ml: 1 }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              {user?.name?.charAt(0) || 'A'}
            </Avatar>
          </IconButton>
        </Box>

        {/* User Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => { router.push('/admin'); handleMenuClose(); }}>
            <Person sx={{ mr: 1 }} />
            Dashboard
          </MenuItem>
          <MenuItem onClick={() => { router.push('/admin/profile'); handleMenuClose(); }}>
            <Person sx={{ mr: 1 }} />
            Profile
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <Logout sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
} 