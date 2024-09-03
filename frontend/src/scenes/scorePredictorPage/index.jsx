// src/pages/ScorePredictorPage.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import ScorePredictor from './ScorePredictor';
import Navbar from 'scenes/navbar';

const ScorePredictorPage = () => {
    return (
        <Box>
            <Box>
                <Navbar />
            </Box>
            <Box sx={{ padding: '20px' }}>
                <Typography variant="h4" gutterBottom>Score Predictor</Typography>
            </Box>
            <Box sx={{ padding: '20px' }}>
                <ScorePredictor />
            </Box>
           
        </Box>
        
    );
};

export default ScorePredictorPage;
