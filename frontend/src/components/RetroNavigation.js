import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { retroColors } from '../styles/retroTheme';

const RetroAppBar = styled(AppBar)({
  backgroundColor: retroColors.background,
  color: retroColors.text,
  boxShadow: 'none',
  borderBottom: `2px solid ${retroColors.borderDark}`,
});

const MenuButton = styled(Box)(({ active }) => ({
  padding: '4px 12px',
  cursor: 'pointer',
  backgroundColor: active ? retroColors.hover : 'transparent',
  border: active ? `1px solid ${retroColors.borderDark}` : '1px solid transparent',
  borderTop: active ? `1px solid ${retroColors.borderDark}` : '1px solid transparent',
  borderLeft: active ? `1px solid ${retroColors.borderDark}` : '1px solid transparent',
  borderRight: active ? `1px solid ${retroColors.borderLight}` : '1px solid transparent',
  borderBottom: active ? `1px solid ${retroColors.borderLight}` : '1px solid transparent',
  '&:hover': {
    backgroundColor: retroColors.hover,
  },
}));

const RetroMenu = styled(Menu)({
  '& .MuiPaper-root': {
    backgroundColor: retroColors.background,
    borderRadius: 0,
    border: `2px solid ${retroColors.borderDark}`,
    borderTop: `2px solid ${retroColors.borderLight}`,
    borderLeft: `2px solid ${retroColors.borderLight}`,
    marginTop: '2px',
    boxShadow: `2px 2px 0 ${retroColors.borderDark}`,
  },
  '& .MuiMenuItem-root': {
    fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif',
    fontSize: '14px',
    padding: '4px 16px',
    minWidth: '180px',
    '&:hover': {
      backgroundColor: retroColors.primary,
      color: '#fff',
    },
  },
});

const Logo = styled(Typography)({
  fontFamily: '"Press Start 2P", "Consolas", monospace',
  fontSize: '16px',
  marginRight: '24px',
  color: retroColors.primary,
});

const menuItems = [
  {
    label: 'File',
    items: [
      { label: 'Upload File', path: '/' },
      { label: 'Exit', action: () => window.close() },
    ],
  },
  {
    label: 'View',
    items: [
      { label: 'Delay Dashboard', path: '/dashboard' },
      { label: 'Delay Categories', path: '/categories' },
      { label: 'Timeline', path: '/timeline' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { label: 'Advanced Search', path: '/search' },
      { label: 'Settings', path: '/settings' },
    ],
  },
  {
    label: 'Help',
    items: [
      { label: 'Documentation', action: () => window.open('/docs', '_blank') },
      { label: 'About', action: () => alert('Network Analysis Tool v1.0') },
    ],
  },
];

const RetroNavigation = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMenuClick = (event, menuIndex) => {
    setAnchorEl(event.currentTarget);
    setActiveMenu(menuIndex);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveMenu(null);
  };

  const handleMenuItemClick = (item) => {
    handleMenuClose();
    if (item.path) {
      navigate(item.path);
    } else if (item.action) {
      item.action();
    }
  };

  return (
    <RetroAppBar position="fixed">
      <Toolbar variant="dense" sx={{ minHeight: '32px' }}>
        <Logo>Network Analysis</Logo>
        <Box sx={{ display: 'flex' }}>
          {menuItems.map((menu, index) => (
            <React.Fragment key={menu.label}>
              <MenuButton
                active={activeMenu === index}
                onClick={(e) => handleMenuClick(e, index)}
              >
                <Typography variant="body2">
                  {menu.label}
                </Typography>
              </MenuButton>
              <RetroMenu
                anchorEl={anchorEl}
                open={activeMenu === index}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                {menu.items.map((item) => (
                  <MenuItem
                    key={item.label}
                    onClick={() => handleMenuItemClick(item)}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </RetroMenu>
            </React.Fragment>
          ))}
        </Box>
      </Toolbar>
    </RetroAppBar>
  );
};

export default RetroNavigation;
