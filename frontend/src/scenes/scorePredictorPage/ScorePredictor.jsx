import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import MatchCard from './MatchCard';
import axios from 'axios';
import { FormControl, InputLabel, MenuItem, Select, Typography, Box, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';

const ScorePredictor = () => {
    const [matches, setMatches] = useState([]);
    const [predictions, setPredictions] = useState({});
    const [gameWeek, setGameWeek] = useState(1);
    const [gameWeekScore, setGameWeekScore] = useState(null);
    const [totalScore, setTotalScore] = useState(null);
    const [isGameWeekFinished, setIsGameWeekFinished] = useState(false);
    const [loading, setLoading] = useState(true); // Loading state for data fetching
    const token = useSelector((state) => state.token);
    const isLoggedIn = Boolean(token);

    const fetchMatches = async () => {
        setLoading(true); // Set loading to true when fetching starts

        try {
            const response = await axios.get(`http://localhost:3001/matches?gameWeek=${gameWeek}`);
            const fetchedMatches = response.data.matches;
            setMatches(fetchedMatches);

            // Check if the game week is finished
            const finished = fetchedMatches.every(match => match.finished);
            setIsGameWeekFinished(finished);

            if (isLoggedIn) {
                // Fetch predictions for the current game week if logged in
                const predictionsResponse = await axios.get(`http://localhost:3001/predictions/get?gameWeek=${gameWeek}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const predictionsData = Array.isArray(predictionsResponse.data)
                    ? predictionsResponse.data.reduce((acc, prediction) => {
                          acc[prediction.matchId] = prediction;
                          return acc;
                      }, {})
                    : {};

                setPredictions(predictionsData);

                // Fetch the total score and game week score
                const scoreResponse = await axios.get(`http://localhost:3001/predictions/getGameWeekScore?gameWeek=${gameWeek}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (scoreResponse.data.gameWeekScore !== undefined) {
                    setGameWeekScore(scoreResponse.data.gameWeekScore);
                    setTotalScore(scoreResponse.data.totalScore);
                } else {
                    setGameWeekScore(null);
                }
            }
        } catch (error) {
            console.error('Error fetching matches, predictions, or scores:', error);
        } finally {
            setLoading(false); // Set loading to false after fetching completes
        }
    };

    useEffect(() => {
        fetchMatches();
    }, [gameWeek]);

    const handleGameWeekChange = (event) => {
        setGameWeek(event.target.value);
    };

    return (
        <Box sx={{ position: 'relative' }}>
            <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel>Game Week</InputLabel>
                <Select value={gameWeek} label="Game Week" onChange={handleGameWeekChange}>
                    {Array.from({ length: 38 }, (_, i) => i + 1).map((week) => (
                        <MenuItem key={week} value={week}>
                            {`Week ${week}`}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {loading ? (
                <Box 
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 2, // Ensure it's above everything else
                    }}
                >
                    <CircularProgress/>
                </Box>
                
            ) : (
            <>
            <Box 
                sx={{
                    width: '100%',
                    textAlign: 'center',
                    padding: 1,
                    borderRadius: '8px',
                    position: 'relative',
                    zIndex: 1 // Make sure content is behind the loading spinner if it overlaps
                }}
            >
                {isLoggedIn ? (
                    isGameWeekFinished ? (
                        gameWeekScore !== null ? (
                            <Typography variant="h6" sx={{ mb: 4 }}>
                                Your score for Game Week {gameWeek}: {gameWeekScore} <br />
                                Total Score: {totalScore}
                            </Typography>
                        ) : (
                            <Typography variant="h6" sx={{ mb: 4 }}>
                                Scores will be calculated at the end of the game week.
                            </Typography>
                        )
                    ) : (
                        <Typography variant="h6" sx={{ mb: 4 }}>
                            The game week has not finished yet. Scoring will be made at the end of the entire game week. <br />
                            Total Score: {totalScore}
                        </Typography>
                    )
                ) : (
                    <Typography variant="h6" sx={{ mb: 4 }}>
                        Log in to see your score.
                    </Typography>
                )}
            </Box>
            

            <Grid container spacing={4} justifyContent="center" sx={{ position: 'relative', zIndex: 0 }}>
                {matches.map((match, index) => (
                    <Grid xs={12} sm={6} key={index}>
                        <MatchCard 
                            match={match} 
                            gameStarted={match.started} 
                            gameFinished={match.finished}
                            prediction={predictions[match.matchId]} 
                            isLoggedIn={isLoggedIn} // Pass isLoggedIn as a prop to MatchCard
                        />
                    </Grid>
                ))}
            </Grid>
            </>
            )}
        </Box>
    );
};

export default ScorePredictor;
