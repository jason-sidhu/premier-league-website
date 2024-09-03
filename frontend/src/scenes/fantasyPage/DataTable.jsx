import React from 'react';
import { useTheme, Table, TableSortLabel, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { positionMapping, teamMapping } from '../../components/Mapping.js';

//order asc/desc got confusing trying to see whether we want arrows up or down. Temp fix implemented


const DataTable = ({ rows, order, orderBy, handleRequestSort }) => {
    const theme = useTheme(); 
    return (
        <TableContainer sx={{ maxHeight: 550 }} component={Paper}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell>Player Name</TableCell>
                        <TableCell>Team</TableCell>
                        <TableCell>Position</TableCell>
                        <TableCell sortDirection={orderBy === 'form' ? order : true}>
                            <TableSortLabel
                                active={orderBy === 'form'}
                                direction={order === 'asc' ? 'desc' : 'asc'}
                                onClick={(event) => handleRequestSort(event, 'form')}
                            >
                                Form
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sortDirection={orderBy === 'now_cost' ? order : true}>
                            <TableSortLabel
                                active={orderBy === 'now_cost'}
                                direction={order === 'asc' ? 'desc' : 'asc'}
                                onClick={(event) => handleRequestSort(event, 'now_cost')}
                            >
                                Price
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sortDirection={orderBy === 'selected_by_percent' ? order : true}>
                            <TableSortLabel
                                active={orderBy === 'selected_by_percent'}
                                direction={order === 'asc' ? 'desc' : 'asc'}
                                onClick={(event) => handleRequestSort(event, 'selected_by_percent')}
                            >
                                Selected %
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sortDirection={orderBy === 'points_per_game' ? order : true}>
                            <TableSortLabel
                                active={orderBy === 'points_per_game'}
                                direction={order === 'asc' ? 'desc' : 'asc'}
                                onClick={(event) => handleRequestSort(event, 'points_per_game')}
                            >
                                Points Per Game
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sortDirection={orderBy === 'total_points' ? order : true}>
                            <TableSortLabel
                                active={orderBy === 'total_points'}
                                direction={order === 'asc' ? 'desc' : 'asc'}
                                onClick={(event) => handleRequestSort(event, 'total_points')}
                            >
                                Total Points
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sortDirection={orderBy === 'minutes' ? order : true}>
                            <TableSortLabel
                                active={orderBy === 'minutes'}
                                direction={order === 'asc' ? 'desc' : 'asc'}
                                onClick={(event) => handleRequestSort(event, 'minutes')}
                            >
                                Minutes
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sortDirection={orderBy === 'influence' ? order : true}>
                            <TableSortLabel
                                active={orderBy === 'influence'}
                                direction={order === 'asc' ? 'desc' : 'asc'}
                                onClick={(event) => handleRequestSort(event, 'influence')}
                            >
                                Influence
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sortDirection={orderBy === 'creativity' ? order : true}>
                            <TableSortLabel
                                active={orderBy === 'creativity'}
                                direction={order === 'asc' ? 'desc' : 'asc'}
                                onClick={(event) => handleRequestSort(event, 'creativity')}
                            >
                                Creativity
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sortDirection={orderBy === 'threat' ? order : true}>
                            <TableSortLabel
                                active={orderBy === 'threat'}
                                direction={order === 'asc' ? 'desc' : 'asc'}
                                onClick={(event) => handleRequestSort(event, 'threat')}
                            >
                                Threat
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sortDirection={orderBy === 'transfers_in_event' ? order : true}>
                            <TableSortLabel
                                active={orderBy === 'transfers_in_event'}
                                direction={order === 'asc' ? 'desc' : 'asc'}
                                onClick={(event) => handleRequestSort(event, 'transfers_in_event')}
                            >
                                GW Transfers In
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sortDirection={orderBy === 'transfers_out_event' ? order : true}>
                            <TableSortLabel
                                active={orderBy === 'transfers_out_event'}
                                direction={order === 'asc' ? 'desc' : 'asc'}
                                onClick={(event) => handleRequestSort(event, 'transfers_out_event')}
                            >
                                GW Transfers Out
                            </TableSortLabel>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((player) => (
                        <TableRow key={player.id}>
                            <TableCell>{player.first_name} {player.second_name}</TableCell>
                            <TableCell>{teamMapping[player.team]}</TableCell>
                            <TableCell>{positionMapping[player.element_type]}</TableCell>
                            <TableCell>{player.form}</TableCell>
                            <TableCell>£{player.now_cost}m</TableCell>
                            <TableCell>{player.selected_by_percent}%</TableCell>
                            <TableCell>{player.points_per_game}pts</TableCell>
                            <TableCell>{player.total_points}pts</TableCell>
                            <TableCell>{player.minutes}</TableCell>
                            <TableCell>{player.influence}</TableCell>
                            <TableCell>{player.creativity}</TableCell>
                            <TableCell>{player.threat}</TableCell>
                            <TableCell>{player.transfers_in_event}</TableCell>
                            <TableCell>{player.transfers_out_event}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DataTable;