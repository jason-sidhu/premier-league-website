import React, { useState } from 'react';
import { Box, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useTheme } from '@mui/material/styles'; // Import the useTheme hook

const ScorePredictorInfo = () => {
    const [open, setOpen] = useState(false);
    const theme = useTheme(); // Get the current theme

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box>
            <IconButton 
                onClick={handleOpen} 
                sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }} // Adjust color based on theme
            >
                <InfoIcon />
            </IconButton>

            {/* Dialog for rules */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Score Predictor Rules</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Here are the rules for the score predictor game:
                        <ul>
                            <li>3 points for predicting the correct match outcome (win/lose/draw).</li>
                            <li>5 points for predicting the exact score for each team.</li>
                            <li>1 point for predicting the correct goal difference (if the outcome is correct).</li>
                            <li>Scoring is locked once the match begins.</li>
                            <li>Make sure to save your predictions before the match starts!</li>
                        </ul>
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ScorePredictorInfo;
