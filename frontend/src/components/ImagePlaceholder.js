import React from 'react';
import { Box, useTheme, alpha } from '@mui/material';
import { ImageNotSupported as ImageNotSupportedIcon } from '@mui/icons-material';

/**
 * A reusable placeholder component for images that fail to load
 * 
 * @param {Object} props - Component props
 * @param {string} props.width - Width of the placeholder (default: 100%)
 * @param {string} props.height - Height of the placeholder (default: 200px)
 * @param {string} props.text - Text to show in the placeholder (default: "Image Not Available")
 * @param {string} props.iconSize - Size of the icon (default: large)
 */
const ImagePlaceholder = ({ 
  width = '100%', 
  height = '200px',
  text = 'Image Not Available', 
  iconSize = 'large' 
}) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.2) 
          : alpha(theme.palette.action.hover, 0.1),
        borderRadius: 1,
        border: `1px dashed ${alpha(theme.palette.text.secondary, 0.2)}`,
      }}
    >
      <ImageNotSupportedIcon 
        fontSize={iconSize} 
        sx={{ 
          color: alpha(theme.palette.text.secondary, 0.4),
          mb: 1
        }} 
      />
      <Box 
        sx={{ 
          color: alpha(theme.palette.text.secondary, 0.6),
          fontSize: '0.875rem',
          textAlign: 'center',
          px: 2
        }}
      >
        {text}
      </Box>
    </Box>
  );
};

export default ImagePlaceholder; 