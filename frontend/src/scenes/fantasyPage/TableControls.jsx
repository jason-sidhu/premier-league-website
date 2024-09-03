import React, { useState } from 'react';
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, useTheme } from '@mui/material';
import { positionMapping, teamMapping } from '../../components/Mapping.js';

const TableControls = ({ team, setTeam, position, setPosition, price, setPrice, search, setSearch, handleResetFilters }) => {
    const theme = useTheme();
    return (
        <Box>
            <TextField
                label="Search Player"
                variant="outlined"
                fullWidth
                margin="normal"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Team</InputLabel>
                        <Select value={team} onChange={(e) => setTeam(e.target.value)} label="Team">
                            <MenuItem value="All Teams">All Teams</MenuItem>
                            {Object.values(teamMapping).map((team) => (
                                <MenuItem key={team} value={team}>{team}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Position</InputLabel>
                        <Select value={position} onChange={(e) => setPosition(e.target.value)} label="Position">
                            <MenuItem value="All Positions">All Positions</MenuItem>
                            {Object.values(positionMapping).map((pos) => (
                                <MenuItem key={pos} value={pos}>{pos}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Price</InputLabel>
                        <Select value={price} onChange={(e) => setPrice(e.target.value)} label="Price">
                            <MenuItem value="Unlimited">Unlimited</MenuItem>
                            <MenuItem value="15.5">£15.5m</MenuItem>
                            <MenuItem value="15.0">£15.0m</MenuItem>
                            <MenuItem value="14.5">£14.5m</MenuItem>
                            <MenuItem value="14.0">£14.0m</MenuItem>
                            <MenuItem value="13.5">£13.5m</MenuItem>
                            <MenuItem value="13.0">£13.0m</MenuItem>
                            <MenuItem value="12.5">£12.5m</MenuItem>
                            <MenuItem value="12.0">£12.0m</MenuItem>
                            <MenuItem value="11.5">£11.5m</MenuItem>
                            <MenuItem value="11.0">£11.0m</MenuItem>
                            <MenuItem value="10.5">£10.5m</MenuItem>
                            <MenuItem value="10.0">£10.0m</MenuItem>
                            <MenuItem value="9.5">£9.5m</MenuItem>
                            <MenuItem value="9.0">£9.0m</MenuItem>
                            <MenuItem value="8.5">£8.5m</MenuItem>
                            <MenuItem value="8.0">£8.0m</MenuItem>
                            <MenuItem value="7.5">£7.5m</MenuItem>
                            <MenuItem value="7.0">£7.0m</MenuItem>
                            <MenuItem value="6.5">£6.5m</MenuItem>
                            <MenuItem value="6.0">£6.0m</MenuItem>
                            <MenuItem value="5.5">£5.5m</MenuItem>
                            <MenuItem value="5.0">£5.0m</MenuItem>
                            <MenuItem value="4.5">£4.5m</MenuItem>
                            <MenuItem value="4.0">£4.0m</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ paddingRight: '20px' }}>
                    <Button variant="contained" backgroundColor={theme.palette.primary.main} onClick={handleResetFilters}>
                        Reset Filters
                    </Button>
                </Box>

            </Box>
        </Box>
    );
};

export default TableControls;

