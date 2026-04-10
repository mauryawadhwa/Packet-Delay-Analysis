import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

const AdvancedSearch = () => {
  const theme = useTheme();
  const [filters, setFilters] = useState({
    protocol: '',
    sourceIp: '',
    destinationIp: '',
    minDelay: '',
    maxDelay: '',
    port: '',
  });
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const addFilter = (field) => {
    if (filters[field] && !activeFilters.find(f => f.field === field)) {
      setActiveFilters(prev => [...prev, {
        field,
        value: filters[field],
        id: Date.now(),
      }]);
    }
  };

  const removeFilter = (filterId) => {
    setActiveFilters(prev => prev.filter(f => f.id !== filterId));
  };

  const clearAllFilters = () => {
    setFilters({
      protocol: '',
      sourceIp: '',
      destinationIp: '',
      minDelay: '',
      maxDelay: '',
      port: '',
    });
    setActiveFilters([]);
  };

  const handleSearch = () => {
    // Implement search logic here using activeFilters
    // This would typically make an API call to the backend
    const mockResults = [
      {
        id: 1,
        timestamp: new Date().toISOString(),
        protocol: 'TCP',
        sourceIp: '192.168.1.1',
        destinationIp: '192.168.1.2',
        delay: 150,
        port: 80,
      },
      // Add more mock results...
    ];
    setSearchResults(mockResults);
  };

  const renderFilterField = (field, label, type = 'text') => (
    <Grid item xs={12} sm={6} md={4}>
      <TextField
        fullWidth
        label={label}
        type={type}
        value={filters[field]}
        onChange={(e) => handleFilterChange(field, e.target.value)}
        InputProps={{
          endAdornment: (
            <IconButton
              size="small"
              onClick={() => addFilter(field)}
              disabled={!filters[field]}
            >
              <FilterIcon />
            </IconButton>
          ),
        }}
      />
    </Grid>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Advanced Search & Filtering
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Search Filters
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Protocol</InputLabel>
                    <Select
                      value={filters.protocol}
                      onChange={(e) => handleFilterChange('protocol', e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="TCP">TCP</MenuItem>
                      <MenuItem value="UDP">UDP</MenuItem>
                      <MenuItem value="ICMP">ICMP</MenuItem>
                      <MenuItem value="HTTP">HTTP</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {renderFilterField('sourceIp', 'Source IP')}
                {renderFilterField('destinationIp', 'Destination IP')}
                {renderFilterField('minDelay', 'Min Delay (ms)', 'number')}
                {renderFilterField('maxDelay', 'Max Delay (ms)', 'number')}
                {renderFilterField('port', 'Port', 'number')}

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {activeFilters.map(filter => (
                      <Chip
                        key={filter.id}
                        label={`${filter.field}: ${filter.value}`}
                        onDelete={() => removeFilter(filter.id)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                    {activeFilters.length > 0 && (
                      <Chip
                        label="Clear All"
                        onDelete={clearAllFilters}
                        color="error"
                      />
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={handleSearch}
                    disabled={activeFilters.length === 0}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {searchResults.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Search Results
                </Typography>
                
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Protocol</TableCell>
                        <TableCell>Source IP</TableCell>
                        <TableCell>Destination IP</TableCell>
                        <TableCell>Delay (ms)</TableCell>
                        <TableCell>Port</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {searchResults.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell>{new Date(result.timestamp).toLocaleString()}</TableCell>
                          <TableCell>{result.protocol}</TableCell>
                          <TableCell>{result.sourceIp}</TableCell>
                          <TableCell>{result.destinationIp}</TableCell>
                          <TableCell>{result.delay}</TableCell>
                          <TableCell>{result.port}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AdvancedSearch;
