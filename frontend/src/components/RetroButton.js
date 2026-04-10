import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { retroColors } from '../styles/retroTheme';

const StyledButton = styled(Button)(({ theme, active }) => ({
  backgroundColor: retroColors.background,
  color: retroColors.text,
  border: `2px solid ${retroColors.borderDark}`,
  borderTop: active ? `2px solid ${retroColors.borderDark}` : `2px solid ${retroColors.borderLight}`,
  borderLeft: active ? `2px solid ${retroColors.borderDark}` : `2px solid ${retroColors.borderLight}`,
  borderRight: active ? `2px solid ${retroColors.borderLight}` : `2px solid ${retroColors.borderDark}`,
  borderBottom: active ? `2px solid ${retroColors.borderLight}` : `2px solid ${retroColors.borderDark}`,
  borderRadius: 0,
  padding: theme.spacing(0.5, 2),
  textTransform: 'none',
  fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif',
  fontSize: '14px',
  boxShadow: 'none',
  minWidth: '80px',
  '&:hover': {
    backgroundColor: retroColors.hover,
    boxShadow: 'none',
  },
  '&:active': {
    backgroundColor: retroColors.hover,
    borderTop: `2px solid ${retroColors.borderDark}`,
    borderLeft: `2px solid ${retroColors.borderDark}`,
    borderRight: `2px solid ${retroColors.borderLight}`,
    borderBottom: `2px solid ${retroColors.borderLight}`,
    boxShadow: 'none',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '16px',
    marginRight: theme.spacing(1),
  },
}));

const RetroButton = ({ children, active, startIcon, ...props }) => {
  return (
    <StyledButton
      active={active}
      startIcon={startIcon}
      disableRipple
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default RetroButton;
