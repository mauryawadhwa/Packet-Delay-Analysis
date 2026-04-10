import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Paper,
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const UploadArea = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isDragging'
})(({ theme, isDragging }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  border: `2px dashed ${isDragging ? theme.palette.primary.main : theme.palette.grey[300]}`,
  backgroundColor: isDragging ? theme.palette.grey[50] : theme.palette.background.paper,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.grey[50],
    borderColor: theme.palette.primary.main,
  },
}));

const FileUpload = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    const allowedFormats = ['.pcap', '.pcapng', '.cap', '.etl', '.erf'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedFormats.includes(fileExtension)) {
      setError(`Please upload a supported packet capture file (${allowedFormats.join(', ')})`);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await axios.post('http://localhost:5001/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSummary(response.data);
      navigate('/dashboard', { state: { analysisData: response.data } });
    } catch (error) {
      setError(error.response?.data?.error || 'Error uploading file');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Upload Network Capture
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <UploadArea
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            isDragging={isDragging}
          >
            <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Drag and Drop Packet Capture File
            </Typography>
            <Typography color="textSecondary">
              Supported formats: .pcap, .pcapng, .cap, .etl, .erf
            </Typography>
            {isUploading && (
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CircularProgress variant="determinate" value={uploadProgress} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Uploading... {uploadProgress}%
                </Typography>
              </Box>
            )}
          </UploadArea>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        {summary && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  File Analysis Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2">Total Packets</Typography>
                    <Typography>{summary.totalPackets}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2">Average Latency</Typography>
                    <Typography>{summary.averageLatency?.toFixed(2)} ms</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2">Packet Loss</Typography>
                    <Typography>{summary.packetLoss?.toFixed(2)}%</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default FileUpload;
