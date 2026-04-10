import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import FileUpload from './pages/FileUpload';
import DelayDashboard from './pages/DelayDashboard';
import DelayCategories from './pages/DelayCategories';
import Timeline from './pages/Timeline';
import AdvancedSearch from './pages/AdvancedSearch';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<FileUpload />} />
            <Route path="/dashboard" element={<DelayDashboard />} />
            <Route path="/categories" element={<DelayCategories />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/search" element={<AdvancedSearch />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
