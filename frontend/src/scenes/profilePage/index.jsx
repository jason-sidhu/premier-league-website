import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { TextField, Button, Typography, Box, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Navbar from 'scenes/navbar';
import axios from 'axios';

const ProfilePage = () => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        favoriteTeam: '',
    });
    const [editMode, setEditMode] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // For toggling visibility
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const token = useSelector((state) => state.token);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    // Fetch user profile data on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get("http://localhost:3001/profile", {
                // const response = await axios.get(`${backendUrl}/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Include token in Authorization header
                    }
                });
                setUser(response.data);
            } catch (error) {
                setMessage('Error fetching profile. Please try again.');
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };        
        fetchProfile();
    }, []);

    // Handles change of input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    // Handles the update request
    const handleUpdate = async () => {
        try {
            const response = await axios.get("http://localhost:3001/profile/update", {
            // const response = await axios.post(`${backendUrl}/profile/update`, {
                ...user,
                currentPassword,
                newPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the headers
                }
            });
            
            setMessage(response.data.message);
            setEditMode(false);
        } catch (error) {
            setMessage('Error updating profile. Please check your password.');
            console.error('Error updating profile:', error);
        }
    };

    return (
        <Box>
            <Box>
                <Navbar />
            </Box>

            <Box sx={{ width: '50%', margin: '0 auto', mt: 5 }}>
                <Typography variant="h4" sx={{ mb: 3 }}>Profile Page</Typography>

                {message && <Typography sx={{ mb: 2, color: 'red' }}>{message}</Typography>}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {/* Profile Fields */}
                        <TextField
                            label="First Name"
                            name="firstName"
                            value={user.firstName}
                            onChange={handleChange}
                            disabled={!editMode}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Last Name"
                            name="lastName"
                            value={user.lastName}
                            onChange={handleChange}
                            disabled={!editMode}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            disabled={!editMode}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Username"
                            name="username"
                            value={user.username}
                            onChange={handleChange}
                            disabled={!editMode}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Favorite Team"
                            name="favoriteTeam"
                            value={user.favoriteTeam}
                            onChange={handleChange}
                            disabled={!editMode}
                            fullWidth
                            sx={{ mb: 2 }}
                        />

                        {editMode && (
                            <>
                                <TextField
                                    label="Current Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    label="New Password (optional)"
                                    type={showPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUpdate}
                                    sx={{ mt: 2 }}
                                >
                                    Save Changes
                                </Button>
                            </>
                        )}

                        {!editMode && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setEditMode(true)}
                                sx={{ mt: 2 }}
                            >
                                Edit Profile
                            </Button>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
};

export default ProfilePage;
