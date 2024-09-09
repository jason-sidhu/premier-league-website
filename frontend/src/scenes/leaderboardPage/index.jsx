import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, CircularProgress } from '@mui/material';
import Navbar from 'scenes/navbar';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true); // Set loading to true when fetching starts
            try {
                const response = await axios.get('http://localhost:3001/leaderboard');
                setLeaderboard(response.data);
            } catch (error) {
                console.error('Error fetching leaderboard data', error);
            } finally {
                setLoading(false); // Set loading to false after fetching completes
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <Box>
            <Box>
                <Navbar />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Leaderboard
                </Typography>
            </Box>

            <Box 
                sx={{
                    maxWidth: '80%',  // Restrict the max-width to 80% of the screen
                    margin: '0 auto',  // Center the table horizontally
                    mt: 3,             // Add margin-top to create space below the navbar
                    padding: 2,        // Add padding to ensure space between the table and sides
                }}
            >
                <TableContainer component={Paper}>
                    {loading ? (
                        // Show circular progress while loading
                        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Rank</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Total Score</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {leaderboard.map((user, index) => (
                                    <TableRow key={user.userId._id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{user.userId.username}</TableCell>
                                        <TableCell>{user.totalScore}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>
            </Box>
        </Box>
    );
};

export default Leaderboard;
