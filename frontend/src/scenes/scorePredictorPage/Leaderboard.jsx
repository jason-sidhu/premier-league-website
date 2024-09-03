// src/components/Leaderboard.jsx
import React from 'react';
import { Box, Typography, List, ListItem } from '@mui/material';

const Leaderboard = ({ users }) => {
    return (
        <Box sx={{ padding: '20px', border: '1px solid #ddd', marginTop: '20px' }}>
            <Typography variant="h6">Leaderboard</Typography>
            <List>
                {users.map((user, index) => (
                    <ListItem key={index}>
                        {index + 1}. {user.name} - {user.points} points
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Leaderboard;
