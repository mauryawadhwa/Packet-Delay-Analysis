import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Slider,
  IconButton,
  ButtonGroup,
  useTheme,
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Brush,
} from 'recharts';

const Timeline = () => {
  const theme = useTheme();
  const location = useLocation();
  const analysisData = location.state?.analysisData || {};
  
  const [timeRange, setTimeRange] = useState([0, 100]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [anomalies, setAnomalies] = useState([]);
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    // Transform packet data into timeline format
    const transformedData = (analysisData.packets || []).map((packet, index) => ({
      id: index,
      timestamp: packet.timestamp,
      delay: packet.delay,
      protocol: packet.protocol,
      isAnomaly: packet.delay > (analysisData.averageDelay || 0) * 2,
    }));

    setTimelineData(transformedData);

    // Identify anomalies
    const detectedAnomalies = transformedData
      .filter(packet => packet.isAnomaly)
      .map(packet => packet.timestamp);
    setAnomalies(detectedAnomalies);
  }, [analysisData]);

  const handleTimeRangeChange = (event, newValue) => {
    setTimeRange(newValue);
  };

  const handleZoom = (direction) => {
    setZoomLevel(prev => Math.max(0.5, Math.min(4, prev + direction * 0.5)));
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Card sx={{ p: 1 }}>
          <Typography variant="subtitle2">
            Timestamp: {new Date(payload[0].payload.timestamp).toLocaleTimeString()}
          </Typography>
          <Typography variant="body2">
            Delay: {payload[0].value.toFixed(2)} ms
          </Typography>
          <Typography variant="body2">
            Protocol: {payload[0].payload.protocol}
          </Typography>
        </Card>
      );
    }
    return null;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Interactive Timeline
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  Packet Delay Timeline
                </Typography>
                <Box>
                  <ButtonGroup size="small">
                    <IconButton onClick={() => handleZoom(-1)}>
                      <ZoomOutIcon />
                    </IconButton>
                    <IconButton onClick={() => handleZoom(1)}>
                      <ZoomInIcon />
                    </IconButton>
                    <IconButton onClick={togglePlayback}>
                      {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </IconButton>
                  </ButtonGroup>
                </Box>
              </Box>

              <Box sx={{ height: 400 }}>
                <ResponsiveContainer>
                  <LineChart
                    data={timelineData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis
                      dataKey="timestamp"
                      domain={['dataMin', 'dataMax']}
                      type="number"
                      tickFormatter={(timestamp) => 
                        new Date(timestamp).toLocaleTimeString()
                      }
                      scale="time"
                    />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="delay"
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                      dot={false}
                    />
                    {anomalies.map((timestamp, index) => (
                      <ReferenceLine
                        key={index}
                        x={timestamp}
                        stroke={theme.palette.error.main}
                        strokeDasharray="3 3"
                      />
                    ))}
                    <Brush
                      dataKey="timestamp"
                      height={30}
                      stroke={theme.palette.primary.main}
                      tickFormatter={(timestamp) => 
                        new Date(timestamp).toLocaleTimeString()
                      }
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Time Range
                </Typography>
                <Slider
                  value={timeRange}
                  onChange={handleTimeRangeChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => 
                    `${Math.round(value)}%`
                  }
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Anomaly Detection
              </Typography>
              <Grid container spacing={2}>
                {anomalies.map((timestamp, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="error" gutterBottom>
                          Anomaly Detected
                        </Typography>
                        <Typography variant="body2">
                          Time: {new Date(timestamp).toLocaleString()}
                        </Typography>
                        <Typography variant="body2">
                          Severity: High
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Timeline;
