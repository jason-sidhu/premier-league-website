import React from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'; 
import HomePage from 'scenes/homePage';
import FantasyPage from 'scenes/fantasyPage';
import FavouritePage from 'scenes/favouritePage';
import LoginPage from 'scenes/loginPage';
import Navbar from 'scenes/navbar';
import ProfilePage from 'scenes/profilePage';
import ResultsPage from 'scenes/resultsPage';
import StandingsPage from 'scenes/standingsPage';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme';

function App() {
  const mode = useSelector((state) => state.mode); 
  const theme = useSelector(() => createTheme(themeSettings(mode)), [mode]); 
  return (
    <div className="app">
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={ <HomePage />} />
          <Route path="/fantasy" element={ <FantasyPage />} />
          <Route path="/favourite" element={ <FavouritePage />} />
          <Route path="/login" element={ <LoginPage />} />
          <Route path="/profile" element={ <ProfilePage />} />
          <Route path="/results" element={ <ResultsPage />} />
          <Route path="/standing" element={ <StandingsPage />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
    </div>
  );
}

export default App;
