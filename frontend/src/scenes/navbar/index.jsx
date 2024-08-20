import { useState } from "react";
import { Box, 
    IconButton, 
    InputBase, 
    Typography, 
    Select, 
    MenuItem, 
    useTheme, 
    useMediaQuery } from "@mui/material";

import { Search, 
    DarkMode, 
    LightMode, 
    Menu, 
    Close} from "@mui/icons-material"
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
    const dark = theme.palette.neutral.dark; 
    const background = theme.palette.neutral.background; 
    const primary = theme.palette.primary.light; 
    const alt = theme.palette.background.alt; 

    const fullName = `${user.firstName} ${user.lastName}`; 

    //mui box component and using our pre defined flex between component
    return <FlexBetween padding="1rem 6%" backgroundColor={alt}>
    <FlexBetween></FlexBetween>

    </FlexBetween>


    return(
        <div>Navbar</div>
    )
}

export default Navbar; 