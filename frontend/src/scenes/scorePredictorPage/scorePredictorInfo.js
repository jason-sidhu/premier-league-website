import React, { useState } from 'react';
import { Box, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const ScorePredictorInfo = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <IconButton onClick={handleOpen} sx={{ color: 'white' }}>
                <InfoIcon />
            </IconButton>

            {/* Dialog (Modal) for rules */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Score Predictor Rules</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Here are the rules for the score predictor game:
                        <ul>
                            <li>3 points for predicting the correct match outcome (win/lose/draw).</li>
                            <li>5 points for predicting the exact score of a team (10 points if score of both teams is exactly correct).</li>
                            <li>1 point for predicting the correct goal difference (if outcome is correct).</li>
                            <li>A max score for a single game is 14 points.</li>
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
