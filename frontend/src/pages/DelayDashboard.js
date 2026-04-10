import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';

const DelayDashboard = () => {
  const theme = useTheme();
  const location = useLocation();
  const analysisData = location.state?.analysisData || {};

  const formatDelayData = (data) => {
    // Check if we have latency data in the expected format
    if (data.latency && typeof data.latency === 'object') {
      return [
        { name: 'Mean', value: data.latency.mean || 0 },
        { name: 'Median', value: data.latency.median || 0 },
        { name: 'Std Dev', value: data.latency.std || 0 }
      ];
    }
    return [];
  };

  const formatProtocolData = (data) => {
    // Transform protocol distribution data from backend format
    if (data.protocols && typeof data.protocols === 'object') {
      return Object.entries(data.protocols).map(([name, count]) => ({
        name,
        value: count,
      }));
    }
    return [];
  };

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Delay Analysis Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Average Latency
              </Typography>
              <Typography variant="h3">
                {analysisData.latency?.mean ? analysisData.latency.mean.toFixed(4) : 0} s
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Average Jitter
              </Typography>
              <Typography variant="h3">
                {analysisData.jitter?.mean ? analysisData.jitter.mean.toFixed(4) : 0} s
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Packets
              </Typography>
              <Typography variant="h3">
                {analysisData.total_packets || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Delay Trend Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Delay Trend Analysis
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={formatDelayData(analysisData)}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="value"
                      fill={theme.palette.primary.main}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Protocol Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Protocol Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={formatProtocolData(analysisData)}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {formatProtocolData(analysisData).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Delay Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Delay Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={formatDelayData(analysisData)}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="delay"
                      fill={theme.palette.primary.main}
                      name="Delay (ms)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DelayDashboard;
