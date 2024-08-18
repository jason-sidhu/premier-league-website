import { createSlice } from "@reduxjs/toolkit"; 

const initialState = { 
    //light or dark
    mode: "light", 
    
    //user auth info
    user: null, 
    token: null,
    favouriteTeam: null
};

export const authSlice = createSlice({
    name: "auth",
    initialState, 

    //functions to change the initial state
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light"; 
        },

        setLogin: (state, action) => {
            state.user = action.payload.user; 
            state.token = action.payload.token;
            state.favouriteTeam = action.payload.favouriteTeam; 
        },

        setLogout: (state) => { 
            state.user = null; 
            state.token = null;
            state.favouriteTeam = null; 
        }, 
    }
})


export const { setMode, setLogin, setLogout } = authSlice.actions; 
export default authSlice.reducer; 