import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { retroColors } from '../styles/retroTheme';
import MinimizeIcon from '@mui/icons-material/MinimizeRounded';
import CloseIcon from '@mui/icons-material/CloseRounded';

const PanelContainer = styled(Box)(({ theme }) => ({
  backgroundColor: retroColors.background,
  border: `2px solid ${retroColors.borderDark}`,
  borderTop: `2px solid ${retroColors.borderLight}`,
  borderLeft: `2px solid ${retroColors.borderLight}`,
  margin: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
}));

const TitleBar = styled(Box)(({ theme }) => ({
  backgroundColor: retroColors.primary,
  color: '#fff',
  padding: theme.spacing(0.5, 1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `2px solid ${retroColors.borderDark}`,
}));

const WindowControls = styled(Box)({
  display: 'flex',
  gap: '4px',
  '& .MuiSvgIcon-root': {
    fontSize: '14px',
    padding: '2px',
    backgroundColor: retroColors.background,
    border: `1px solid ${retroColors.borderDark}`,
    borderTop: `1px solid ${retroColors.borderLight}`,
    borderLeft: `1px solid ${retroColors.borderLight}`,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: retroColors.hover,
    },
  },
});

const Content = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: retroColors.background,
}));

const RetroPanel = ({ title, children, onClose, onMinimize }) => {
  return (
    <PanelContainer>
      <TitleBar>
        <Typography variant="subtitle2" sx={{ fontFamily: '"Consolas", monospace' }}>
          {title}
        </Typography>
        <WindowControls>
          {onMinimize && (
            <MinimizeIcon onClick={onMinimize} />
          )}
          {onClose && (
            <CloseIcon onClick={onClose} />
          )}
        </WindowControls>
      </TitleBar>
      <Content>
        {children}
      </Content>
    </PanelContainer>
  );
};

export default RetroPanel;
