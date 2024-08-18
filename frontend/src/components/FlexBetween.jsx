import { Box } from "@mui/material";
import { styled } from "@mui/system"; 

//a way to reuse this css styled component, and pass in CSS properties
const FlexBetween = styled(Box)({
    display: "flex", 
    justifyContent: "space-between",
    alignItems: "center"
})

export default FlexBetween; 