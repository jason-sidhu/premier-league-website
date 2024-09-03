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
import StatisticsPage from 'scenes/statisticsPage';
import ScorePredictorPage from 'scenes/scorePredictorPage';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme';


function App() {
  const mode = useSelector((state) => state.mode); 
  const theme = useSelector(() => createTheme(themeSettings(mode)), [mode]); 
  const isAuth = Boolean(useSelector((state) => state.token)); 
  return (
    <div className="app">
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/fantasy" element={ <FantasyPage />} />
          <Route path="/favourite" element={  isAuth ? <FavouritePage /> : <Navigate to="/login" />} />
          <Route path="/login" element={ isAuth ? <HomePage /> : <LoginPage />} />
          <Route path="/profile" element={ isAuth ? <ProfilePage /> : <Navigate to="/login" /> } />
          <Route path="/results" element={ <ResultsPage />} />
          <Route path="/standings" element={ <StandingsPage />} />
          <Route path="/statistics" element={ <StatisticsPage />} />
          <Route path="/scorepredictor" element={ <ScorePredictorPage />} />
          
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
    </div>
  );
}

export default App;
