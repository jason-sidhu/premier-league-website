import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, TextField, Button, Grid, CircularProgress, useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles'; // Import useMediaQuery to handle mobile
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import moment from "moment-timezone";

const MatchCard = ({ match, gameStarted, gameFinished, prediction: initialPrediction }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detect if it's a small screen
    const [team1Score, setTeam1Score] = useState('0');
    const [team2Score, setTeam2Score] = useState('0');
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); 
    const token = useSelector((state) => state.token);
    const isLoggedIn = Boolean(token);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        setLoading(true);

        if (initialPrediction) {
            setPrediction(initialPrediction);
            setTeam1Score(String(initialPrediction.team1Score));
            setTeam2Score(String(initialPrediction.team2Score));
        } else {
            setPrediction(null);
            setTeam1Score('0');
            setTeam2Score('0');
        }

        const timeout = setTimeout(() => {
            setLoading(false);
        }, 300); 

        return () => clearTimeout(timeout);
    }, [initialPrediction, match.matchId]);

    const handleScoreChange = (team, increment) => {
        if (team === 1) {
            setTeam1Score(prev => String(Math.max(0, parseInt(prev) + increment)));
        } else {
            setTeam2Score(prev => String(Math.max(0, parseInt(prev) + increment)));
        }
    };

    const handleScoreInput = (team, value) => {
        if (value === '') {
            if (team === 1) setTeam1Score('');
            else setTeam2Score('');
        } else {
            const parsedValue = parseInt(value);
            if (!isNaN(parsedValue)) {
                if (team === 1) setTeam1Score(String(Math.max(0, parsedValue)));
                else setTeam2Score(String(Math.max(0, parsedValue)));
            }
        }
    };

    const handleSubmit = async () => {
        if (!isLoggedIn) {
            navigate("/login"); 
        } else {
            try {
                const response = await axios.post(`${backendUrl}/predictions/save`, {
                    matchId: match.matchId,
                    gameWeek: match.gameWeek,
                    team1Score: parseInt(team1Score),
                    team2Score: parseInt(team2Score)
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setPrediction(response.data.prediction);
                setTeam1Score(String(response.data.prediction.team1Score));
                setTeam2Score(String(response.data.prediction.team2Score));
                console.log('Prediction submitted');
            } catch (error) {
                console.error('Error submitting prediction:', error);
            }
        }
    };

    return (
        <Card sx={{ minWidth: 275, mb: 2, p: 2, boxShadow: 3, borderRadius: 2, backgroundColor: theme.palette.background.alt }}>
            <CardContent>
                <Grid container justifyContent="space-between" alignItems="center" direction={isMobile ? 'column' : 'row'}>
                    {/* Team 1 Info */}
                    <Grid item xs={12} sm={4} container direction="column" alignItems="center">
                        <Box
                            component="img"
                            alt={match.team1}
                            src={`/team-logos/${match.team1}.svg`}
                            sx={{ width: 56, height: 56, mb: 1 }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{match.team1}</Typography>
                    </Grid>

                    {/* Score Input/Display */}
                    <Grid item xs={12} sm={4} container justifyContent="center" alignItems="center" sx={{ mt: isMobile ? 2 : 0 }}>
                        <Box display="flex" alignItems="center" justifyContent="center">
                            {loading ? (
                                <CircularProgress />
                            ) : gameFinished ? (
                                prediction ? (
                                    <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                                        Your Prediction: {prediction.team1Score} - {prediction.team2Score}
                                    </Typography>
                                ) : (
                                    <Typography sx={{ color: theme.palette.text.secondary }}>
                                        {isLoggedIn ? 'No saved prediction' : 'Log in to see saved prediction'}
                                    </Typography>
                                )
                            ) : gameStarted ? (
                                <>
                                    {/* Game Started - Scores Locked */}
                                    <Button onClick={() => handleScoreChange(1, -1)} disabled>
                                        <RemoveIcon sx={{ color: theme.palette.primary.dark }} />
                                    </Button>
                                    <TextField 
                                        variant="outlined"
                                        value={team1Score}
                                        onChange={(e) => handleScoreInput(1, e.target.value)}
                                        sx={{ width: 50, mx: 1 }}
                                        inputProps={{ style: { textAlign: 'center', fontSize: '1.5rem', color: theme.palette.neutral.main } }}
                                        disabled
                                    />
                                    <Button onClick={() => handleScoreChange(1, 1)} disabled>
                                        <AddIcon sx={{ color: theme.palette.primary.dark }} />
                                    </Button>
                                    <Button onClick={() => handleScoreChange(2, -1)} disabled>
                                        <RemoveIcon sx={{ color: theme.palette.primary.dark }} />
                                    </Button>
                                    <TextField 
                                        variant="outlined"
                                        value={team2Score}
                                        onChange={(e) => handleScoreInput(2, e.target.value)}
                                        sx={{ width: 50, mx: 1 }}
                                        inputProps={{ style: { textAlign: 'center', fontSize: '1.5rem', color: theme.palette.neutral.main } }}
                                        disabled
                                    />
                                    <Button onClick={() => handleScoreChange(2, 1)} disabled>
                                        <AddIcon sx={{ color: theme.palette.primary.dark }} />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {/* Game Not Started - Can Edit Scores */}
                                    <Button onClick={() => handleScoreChange(1, -1)}>
                                        <RemoveIcon sx={{ color: theme.palette.primary.dark }} />
                                    </Button>
                                    <TextField 
                                        variant="outlined"
                                        value={team1Score}
                                        onChange={(e) => handleScoreInput(1, e.target.value)}
                                        sx={{ width: 50, mx: 1 }}
                                        inputProps={{ style: { textAlign: 'center', fontSize: '1.5rem', color: theme.palette.neutral.main } }}
                                    />
                                    <Button onClick={() => handleScoreChange(1, 1)}>
                                        <AddIcon sx={{ color: theme.palette.primary.dark }} />
                                    </Button>
                                    <Button onClick={() => handleScoreChange(2, -1)}>
                                        <RemoveIcon sx={{ color: theme.palette.primary.dark }} />
                                    </Button>
                                    <TextField 
                                        variant="outlined"
                                        value={team2Score}
                                        onChange={(e) => handleScoreInput(2, e.target.value)}
                                        sx={{ width: 50, mx: 1 }}
                                        inputProps={{ style: { textAlign: 'center', fontSize: '1.5rem', color: theme.palette.neutral.main } }}
                                    />
                                    <Button onClick={() => handleScoreChange(2, 1)}>
                                        <AddIcon sx={{ color: theme.palette.primary.dark }} />
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Grid>

                    {/* Team 2 Info */}
                    <Grid item xs={12} sm={4} container direction="column" alignItems="center" sx={{ mt: isMobile ? 2 : 0 }}>
                        <Box
                            component="img"
                            alt={match.team2}
                            src={`/team-logos/${match.team2}.svg`}
                            sx={{ width: 56, height: 56, mb: 1 }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{match.team2}</Typography>
                    </Grid>
                </Grid>
                
                <Box mt={2} sx={{ textAlign: 'center', fontWeight: 'bold'}}>
                    {gameFinished ? (
                        <Typography sx={{ color: theme.palette.success.main }}>
                            Match Finished: {match.team1} {match.team1Score} - {match.team2Score} {match.team2}
                        </Typography>
                    ) : (
                        <>
                            {!gameStarted && match.kickoffTime && (
                                <Typography sx={{ color: theme.palette.text.secondary }}>
                                    Kickoff: {moment(match.kickoffTime).tz('America/New_York').format('dddd, MMMM D, YYYY [at] h:mma z')}
                                </Typography>
                            )}
                            {isLoggedIn && prediction && !gameStarted && (
                                <Typography>
                                    Current Prediction: {prediction.team1Score} - {prediction.team2Score}
                                </Typography>
                            )}
                            {!prediction && !gameStarted && (
                                <Typography>
                                    {isLoggedIn ? 'No current saved prediction' : 'Log in to save your prediction.'}
                                </Typography>
                            )}
                            <Button 
                                variant="contained" 
                                color="primary" 
                                size="large" 
                                sx={{ width: '100%', mt: 2 }}
                                onClick={handleSubmit}
                                disabled={gameStarted}
                            >
                                {gameStarted ? `Prediction Locked` : `Submit Prediction`}
                            </Button>
                        </>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default MatchCard;
