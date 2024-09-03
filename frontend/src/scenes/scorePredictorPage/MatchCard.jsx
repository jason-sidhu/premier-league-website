import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, TextField, Button, Avatar, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const MatchCard = ({ match, gameStarted, gameFinished, prediction: initialPrediction, isGameWeekFinished, onSubmissionResult }) => {
    const theme = useTheme();
    const [team1Score, setTeam1Score] = useState(0);
    const [team2Score, setTeam2Score] = useState(0);
    const [prediction, setPrediction] = useState(null);
    const navigate = useNavigate(); 
    const token = useSelector((state) => state.token);
    const isLoggedIn = Boolean(token);

    useEffect(() => {
        if (initialPrediction) {
            setPrediction(initialPrediction);
            setTeam1Score(initialPrediction.team1Score);
            setTeam2Score(initialPrediction.team2Score);
        } else {
            setPrediction(null);
            setTeam1Score(0);
            setTeam2Score(0);
        }
    }, [initialPrediction, match.matchId]);

    const handleScoreChange = (team, increment) => {
        if (team === 1) {
            setTeam1Score(prev => Math.max(0, prev + increment));
        } else {
            setTeam2Score(prev => Math.max(0, prev + increment));
        }
    };

    const handleSubmit = async () => {
        if (!isLoggedIn) {
            navigate("/login"); 
        } else {
            try {
                const response = await axios.post(`http://localhost:3001/predictions/save`, {
                    matchId: match.matchId,
                    gameWeek: match.gameWeek,
                    team1Score,
                    team2Score
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Update the prediction state with the new prediction from the server
                setPrediction(response.data.prediction);
                setTeam1Score(response.data.prediction.team1Score);
                setTeam2Score(response.data.prediction.team2Score);
                console.log('Prediction submitted');
                onSubmissionResult('Prediction saved successfully!');
            } catch (error) {
                console.error('Error submitting prediction:', error);
                onSubmissionResult('Failed to save prediction.');
            }
        }
    };

    return (
        <Card sx={{ minWidth: 275, mb: 2, p: 2, boxShadow: 3, borderRadius: 2, backgroundColor: theme.palette.background.alt }}>
            <CardContent>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item xs={4} container direction="column" alignItems="center">
                        <Avatar alt={match.team1} src={match.team1Flag} sx={{ width: 56, height: 56, mb: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{match.team1}</Typography>
                    </Grid>

                    <Grid item xs={4} container justifyContent="center" alignItems="center">
                        <Box display="flex" alignItems="center" justifyContent="center">
                            {gameFinished ? (
                                <>
                                    {prediction ? (
                                        <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                                            Your Prediction: {prediction.team1Score} - {prediction.team2Score}
                                            {isGameWeekFinished && (
                                                <Typography variant="body2" sx={{ color: theme.palette.success.main }}>
                                                    Points: {prediction.score}
                                                </Typography>
                                            )}
                                        </Typography>
                                    ) : (
                                        <Typography  sx={{ color: theme.palette.text.secondary }}>
                                            {isLoggedIn ? 'No saved prediction' : 'Log in to see saved prediction'}
                                        </Typography>
                                    )}
                                </>
                            ) : gameStarted ? (
                                <>
                                    <Button onClick={() => handleScoreChange(1, -1)} disabled>
                                        <RemoveIcon sx={{ color: theme.palette.primary.dark }} />
                                    </Button>
                                    <TextField 
                                        variant="outlined"
                                        value={team1Score}
                                        onChange={(e) => setTeam1Score(Math.max(0, parseInt(e.target.value)))}
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
                                        onChange={(e) => setTeam2Score(Math.max(0, parseInt(e.target.value)))}
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
                                    <Button onClick={() => handleScoreChange(1, -1)} disabled={!isLoggedIn}>
                                        <RemoveIcon sx={{ color: theme.palette.primary.dark }} />
                                    </Button>
                                    <TextField 
                                        variant="outlined"
                                        value={team1Score}
                                        onChange={(e) => setTeam1Score(Math.max(0, parseInt(e.target.value)))}
                                        sx={{ width: 50, mx: 1 }}
                                        inputProps={{ style: { textAlign: 'center', fontSize: '1.5rem', color: theme.palette.neutral.main } }}
                                        disabled={!isLoggedIn}
                                    />
                                    <Button onClick={() => handleScoreChange(1, 1)} disabled={!isLoggedIn}>
                                        <AddIcon sx={{ color: theme.palette.primary.dark }} />
                                    </Button>
                                    <Button onClick={() => handleScoreChange(2, -1)} disabled={!isLoggedIn}>
                                        <RemoveIcon sx={{ color: theme.palette.primary.dark }} />
                                    </Button>
                                    <TextField 
                                        variant="outlined"
                                        value={team2Score}
                                        onChange={(e) => setTeam2Score(Math.max(0, parseInt(e.target.value)))}
                                        sx={{ width: 50, mx: 1 }}
                                        inputProps={{ style: { textAlign: 'center', fontSize: '1.5rem', color: theme.palette.neutral.main } }}
                                        disabled={!isLoggedIn}
                                    />
                                    <Button onClick={() => handleScoreChange(2, 1)} disabled={!isLoggedIn}>
                                        <AddIcon sx={{ color: theme.palette.primary.dark }} />
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Grid>

                    <Grid item xs={4} container direction="column" alignItems="center">
                        <Avatar alt={match.team2} src={match.team2Flag} sx={{ width: 56, height: 56, mb: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{match.team2}</Typography>
                    </Grid>
                </Grid>
                
                <Box mt={2} sx={{ textAlign: 'center', fontWeight: 'bold'}}>
                    {gameFinished ? (
                        <>
                            <Typography  sx={{ color: theme.palette.success.main }}>
                                Match Finished: {match.team1} {match.team1Score} - {match.team2Score} {match.team2}
                            </Typography>
                        </>
                    ) : (
                        <>
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
