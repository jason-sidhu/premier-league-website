// src/pages/ScorePredictorPage.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import ScorePredictor from './ScorePredictor';
import Navbar from 'scenes/navbar';
import ScorePredictorInfo from './scorePredictorInfo'; // Adjust the path as needed

const ScorePredictorPage = () => {
    return (
        <Box>
            <Box>
                <Navbar />
            </Box>
            <Box sx={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4" gutterBottom>Score Predictor</Typography>
                <ScorePredictorInfo />
            </Box>
            <Box sx={{ padding: '20px' }}>
                <ScorePredictor />
            </Box>
        </Box>
    );
};

export default ScorePredictorPage;
