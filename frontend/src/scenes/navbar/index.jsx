import { useState } from "react";
import { Box, 
    IconButton, 
    InputBase, 
    Typography, 
    Select, 
    MenuItem,
    FormControl,
    useTheme, 
    useMediaQuery,
    InputLabel } from "@mui/material";

import { Search, 
    Message,
    DarkMode, 
    LightMode, 
    Notifications,
    Menu, 
    Close,
    Help} from "@mui/icons-material"
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state"; 
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";


const Navbar = () => {
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false); 
    const dispatch = useDispatch(); 
    const navigate = useNavigate(); 
    const user = useSelector((state) => state.user);
    //to check mobile screen etc.
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)") ; 
    
    
    const theme = useTheme(); 
    const neutralLight = theme.palette.neutral.light;
    const neutralMain = theme.palette.neutral.main;
    const neutralMediumMain = theme.palette.neutral.MediumMain;
    const neutralMedium = theme.palette.neutral.medium;
    const dark = theme.palette.neutral.dark; 
    const background = theme.palette.neutral.background; 
    const primaryLight = theme.palette.primary.light; 
    const primary = theme.palette.primary.main; 
    const primaryDark = theme.palette.primary.dark; 
    const alt = theme.palette.background.alt; 

    const fullName = user ? `${user.firstName} ${user.lastName}` : ""; 

    //mui box component and using our pre defined flex between component
    return (<FlexBetween padding="1rem 6%" backgroundColor={alt}>
        <FlexBetween gap="1.75rem">
        <Typography
            fontWeight="bold"
            fontSize="clamp(1rem, 2rem, 2.25rem)"
            color={primary}
            onClick={() => navigate ("/home")}
            sx={{
                "&:hover": {
                    color: primaryDark, 
                    cursor: "pointer",
                },
            }}
        >
        Premier League 
        </Typography>
        {isNonMobileScreens ? (
            <FlexBetween gap="2rem"> 
                <Typography 
                fontWeight="bold"
                onClick={() => navigate ("/results")}
                sx={{
                    "&:hover": {
                        color: primaryDark, 
                        cursor: "pointer",
                    },
                }}>Results</Typography>

                <Typography 
                fontWeight="bold"
                onClick={() => navigate ("/statistics")}
                sx={{
                    "&:hover": {
                        color: primaryDark, 
                        cursor: "pointer",
                    },
                }}>Statistics</Typography>

                <Typography 
                fontWeight="bold"
                onClick={() => navigate ("/fantasy")}
                sx={{
                    "&:hover": {
                        color: primaryDark, 
                        cursor: "pointer",
                    },
                }}>Fantasy</Typography>

                <Typography 
                fontWeight="bold"
                onClick={() => navigate ("/favourite")}
                sx={{
                    "&:hover": {
                        color: primaryDark, 
                        cursor: "pointer",
                    },
                }}>Favourite</Typography>
            </FlexBetween>
        ) : (
            <></>
        )}        
        </FlexBetween>
        
        {/* DESKTOP NAV*/}
        {isNonMobileScreens ? (
            <FlexBetween gap="2rem"> 
               
                <IconButton onClick={() => dispatch(setMode())}> 
                    {theme.palette.mode === "dark" ? (
                        <DarkMode sx={{ fontSize: "25px" }} />
                    ) : (
                        <LightMode sx={{ color: dark, fontSize: "25px" }} />
                    )}
                </IconButton> 
                {user ? (
                    <FlexBetween gap="2rem">

                        <Typography
                            fontWeight="bold"
                            onClick={() => navigate("/profile")}
                            sx={{
                                "&:hover": {
                                    color: primaryDark, 
                                    cursor: "pointer",
                                },
                            }}
                        >
                            Profile
                        </Typography>

                        <Typography
                            fontWeight="bold"
                            onClick={() => dispatch(setLogout())}
                            sx={{
                                "&:hover": {
                                    color: primaryDark, 
                                    cursor: "pointer",
                                },
                            }}
                        >
                            Log out
                        </Typography>
                    </FlexBetween>

                    
                ) : (
                    <Typography
                        fontWeight="bold"
                        onClick={() => navigate("/login")}
                        sx={{
                            "&:hover": {
                                color: primaryDark, 
                                cursor: "pointer",
                            },
                        }}
                    >
                        Log In
                    </Typography>
                )}
            </FlexBetween>
        ) : (
            <IconButton
                onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
                <Menu />
            </IconButton>
        )}

        {/* MOBILE NAV */}
        {!isNonMobileScreens && isMobileMenuToggled && (
            <Box
                position="fixed"
                right="0"
                bottom="0"
                height="100%"
                zIndex="10"
                maxWidth="500px"
                minWidth="300px"
                backgroundColor={neutralMedium} 
            >
                {/* CLOSE ICON */}
                <Box display="flex" justifyContent="flex-end" p="1rem">
                    <IconButton
                        onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                    >
                        <Close />
                    </IconButton>
                </Box>
                {/* MENU ITEMS */}
                <FlexBetween 
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    gap="3rem"
                > 
                <IconButton 
                    onClick={() => dispatch(setMode())}
                    sx={{ fontSize: "25px" }}
                > 
                    {theme.palette.mode === "dark" ? (
                        <DarkMode sx={{ fontSize: "25px" }} />
                    ) : (
                        <LightMode sx={{ color: dark, fontSize: "25px" }} />
                    )}
                </IconButton> 
                <Typography 
                fontWeight="bold"
                onClick={() => navigate ("/results")}
                sx={{
                    "&:hover": {
                        color: primaryDark, 
                        cursor: "pointer",
                    },
                }}>Results</Typography>

                <Typography 
                fontWeight="bold"
                onClick={() => navigate ("/statistics")}
                sx={{
                    "&:hover": {
                        color: primaryDark, 
                        cursor: "pointer",
                    },
                }}>Statistics</Typography>

                <Typography 
                fontWeight="bold"
                onClick={() => navigate ("/fantasy")}
                sx={{
                    "&:hover": {
                        color: primaryDark, 
                        cursor: "pointer",
                    },
                }}>Fantasy</Typography>

                <Typography 
                fontWeight="bold"
                onClick={() => navigate ("/favourite")}
                sx={{
                    "&:hover": {
                        color: primaryDark, 
                        cursor: "pointer",
                    },
                }}>Favourite</Typography>
                {user ? (
                    <FlexBetween 
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        gap="3rem"
                    > 
                        <Typography
                            fontWeight="bold"
                            onClick={() => navigate("/profile")}
                            sx={{
                                "&:hover": {
                                    color: primaryDark, 
                                    cursor: "pointer",
                                },
                            }}
                        >
                            Profile
                        </Typography>

                        <Typography
                            fontWeight="bold"
                            onClick={() => dispatch(setLogout())}
                            sx={{
                                "&:hover": {
                                    color: primaryDark, 
                                    cursor: "pointer",
                                },
                            }}
                        >
                            Log out
                        </Typography>
                    </FlexBetween>

                    
                ) : (
                    <Typography
                        fontWeight="bold"
                        onClick={() => navigate("/login")}
                        sx={{
                            "&:hover": {
                                color: primaryDark, 
                                cursor: "pointer",
                            },
                        }}
                    >
                        Log In
                    </Typography>
                )}
                
                
            </FlexBetween>
            </Box>
        )}
    </FlexBetween>
    );
}

export default Navbar; 