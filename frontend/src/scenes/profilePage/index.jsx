import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; 
import { 
    MenuItem, 
    Select, 
    InputLabel,
    FormControl,
    Snackbar, 
    Alert, 
    TextField, 
    Button, 
    Typography, 
    Box, 
    CircularProgress, 
    IconButton, 
    InputAdornment,
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Navbar from 'scenes/navbar';
import axios from 'axios';
import { setLogout } from 'state'; 
import { useNavigate } from 'react-router-dom'; 
import { teamMapping } from "components/Mapping";

const ProfilePage = () => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        favouriteTeam: '',
    });
    const [editMode, setEditMode] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false); 
    const [deletePassword, setDeletePassword] = useState('');
    const dispatch = useDispatch(); 
    const navigate = useNavigate(); 
    const token = useSelector((state) => state.token);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    // Store initial user data for resetting form
    const [initialUser, setInitialUser] = useState(user);

    // Fetch user profile data on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // const response = await axios.get(`http://localhost:3001/profile`, {
                const response = await axios.get(`${backendUrl}/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Include token in Authorization header
                    }
                });
                setUser(response.data);
                setInitialUser(response.data); 
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
            const response = await axios.patch(`${backendUrl}/profile/update`, {
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
            setInitialUser(user); 
            setShowSuccess(true); 
        } catch (error) {
            setMessage('Error updating profile. Please check your password.');
            console.error('Error updating profile:', error);
        }
    };
    
    const handleCancel = () => {
        setUser(initialUser);
        setEditMode(false);
        setMessage(''); 
    };

    const handleEditProfile = () => {
        setEditMode(true);
        setCurrentPassword(''); 
        setNewPassword('');
        setShowPassword(false); 
    };
    

    // Delete account handler
    const handleDeleteAccount = async () => {
        try {
            const response = await axios.delete(`${backendUrl}/profile/delete`, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the headers
                },
                data: {
                    password: deletePassword // Send the password for deletion
                }
            });
    
            if (response.status === 200) {
                dispatch(setLogout()); 
                navigate('/'); 
            }
        } catch (error) {
            setMessage('Error deleting account. Please check your password.');
            console.error('Error deleting account:', error);
        } finally {
            setOpenDeleteDialog(false); // Close the delete confirmation dialog
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
                        {editMode ? (
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel id="favourite-team-label">Favourite Team</InputLabel>
                                    <Select
                                        labelId="favourite-team-label"
                                        name="favouriteTeam"
                                        value={user.favouriteTeam}
                                        onChange={handleChange}
                                    >
                                        {Object.entries(teamMapping).map(([key, value]) => (
                                                <MenuItem key={key} value={value}>{value}</MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            
                        ) : (
                            <TextField
                                label="Favorite Team"
                                name="favoriteTeam"
                                value={user.favouriteTeam}
                                disabled={!editMode}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                        )}

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
                                <Box >
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={handleUpdate}
                                        sx={{ mt: 2 }}
                                    >
                                        Save Changes
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={handleCancel}
                                        sx={{ mt: 2, ml: 2 }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </>
                        )}

                        {!editMode && (
                            <Box>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleEditProfile} 
                                sx={{ 
                                    mt: 2,
                                    ":hover": {
                                        backgroundColor: (theme) => theme.palette.primary.dark 
                                    }
                                }}
                            >
                                Edit Profile
                            </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => setOpenDeleteDialog(true)}
                                    sx={{ mt: 2, ml: 2 }}
                                >
                                    Delete Account
                                </Button>
                            </Box>
                        )}
                    </>
                )}
            </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your password to confirm the account deletion. This action cannot be undone.
                    </DialogContentText>
                    <TextField
                        label="Password"
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        fullWidth
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteAccount} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={showSuccess}
                autoHideDuration={3000} 
                onClose={() => setShowSuccess(false)} 
            >
                <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    Profile updated successfully!
                </Alert>
            </Snackbar>

        </Box>
    );
};

export default ProfilePage;
