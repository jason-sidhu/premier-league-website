import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from 'scenes/navbar';
import { useTheme } from '@mui/material/styles';

const HomePage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const token = useSelector((state) => state.token);
    const isLoggedIn = Boolean(token);

    return (
        <Box>
            <Navbar />
            <Box 
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '80vh',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h3" sx={{ mb: 4 }}>
                    Welcome to the Premier League Game Zone!
                </Typography>
                <Typography variant="h6" sx={{ mb: 4 }}>
                    Test your prediction skills and get all your FPL stats.
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item>
                        <Button 
                            variant="contained" 
                            sx={{
                                backgroundColor: theme.palette.primary.main,
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.dark,
                                },
                            }}
                            onClick={() => navigate("/scorepredictor")}
                        >
                            Go to Score Predictor
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button 
                            variant="contained" 
                            sx={{
                                backgroundColor: theme.palette.primary.main,
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.dark,
                                },
                            }}
                            onClick={() => navigate("/fantasy")}
                        >
                            Go to Fantasy Page
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default HomePage;
