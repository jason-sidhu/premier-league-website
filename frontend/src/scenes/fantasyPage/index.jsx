import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress } from '@mui/material';
import TableControls from './TableControls'; // Custom table controls component
import DataTable from './DataTable'; // Custom data table component
import Navbar from "scenes/navbar";
import { positionMapping, teamMapping } from '../../components/Mapping.js';

const FantasyPage = () => {
    const [fantasyData, setFantasyData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [sortBy, setSortBy] = useState({ key: 'now_cost', ascending: false });
    const [team, setTeam] = useState("All Teams");
    const [position, setPosition] = useState("All Positions");
    const [price, setPrice] = useState("Unlimited");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true); // Loading state
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchFantasyData = async () => {
            setLoading(true); // Set loading to true when fetching starts
            try {
                // const response = await axios.get('http://localhost:3001/fantasy/general');
                const response = await axios.get(`${backendUrl}/fantasy/general`);
                const formattedData = response.data.elements.map((player) => ({
                    ...player,
                    now_cost: parseFloat((player.now_cost / 10).toFixed(1)),
                }));
                let data = [...formattedData]; 
                data = data.sort((a, b) => {
                    const aValue = parseFloat(a[sortBy.key]);
                    const bValue = parseFloat(b[sortBy.key]);
        
                    if (!isNaN(aValue) && !isNaN(bValue)) {
                        return sortBy.ascending ? aValue - bValue : bValue - aValue;
                    }
                    return 0; // Handle non-numeric cases
                });
    
                setFantasyData(formattedData);
                setFilteredData(data);
            } catch (error) {
                console.error('Error fetching fantasy data:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching completes
            }
        };

        fetchFantasyData();
    }, []);

    useEffect(() => {
        let data = [...fantasyData]; 
        if(search){
            data = data.filter(player => `${player.first_name} ${player.second_name}`.toLowerCase().includes(search.toLowerCase()));
        }
        if (team !== "All Teams") {
            data = data.filter(player => teamMapping[player.team] === team);
        }
        if(position !== "All Positions"){
            data = data.filter(player => positionMapping[player.element_type] === position);
        }
        if (price !== "Unlimited") {
            data = data.filter(player => player.now_cost <= parseFloat(price));
        }

        // Apply sorting logic
        data = data.sort((a, b) => {
            const aValue = parseFloat(a[sortBy.key]);
            const bValue = parseFloat(b[sortBy.key]);

            if (!isNaN(aValue) && !isNaN(bValue)) {
                return sortBy.ascending ? aValue - bValue : bValue - aValue;
            }
            return 0; // Handle non-numeric cases
        });

        setFilteredData(data);

    }, [sortBy, team, position, price, search]); 

    const handleRequestSort = (event, property) => {
        // If clicking on a new column, default to descending order
        const isSameColumn = sortBy.key === property;
        setSortBy({ key: property, ascending: isSameColumn ? !sortBy.ascending : false });
    };
    

    const handleResetFilters = () => {
        setTeam("All Teams");
        setPosition("All Positions");
        setPrice("Unlimited");
        setSearch("");
        setSortBy({ key: 'now_cost', ascending: false }); // Default sort
    };  

    return (
        <Box>
            <Box>
                <Navbar/>
            </Box>
            <Box sx={{ padding: '20px', position: 'relative' }}>
                <Typography variant="h4" gutterBottom>Fantasy Premier League Statistics</Typography>
                
                {loading && (
                    <Box 
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}
                
                <TableControls 
                    team={team} setTeam={setTeam} 
                    position={position} setPosition={setPosition} 
                    price={price} setPrice={setPrice} 
                    search={search} setSearch={setSearch}
                    handleResetFilters={handleResetFilters}
                />
                <DataTable 
                    rows={filteredData} 
                    order={sortBy.ascending ? 'asc' : 'desc'} 
                    orderBy={sortBy.key} 
                    handleRequestSort={handleRequestSort} 
                />
            </Box>
        </Box>
    );
};

export default FantasyPage;
