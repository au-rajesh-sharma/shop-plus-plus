//this slice is purely for setting and removing user credentials to local storage
//this will be added directly to store.js, because this is not a child of apiSlice or userSlice
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: localStorage.getItem('userInfo') 
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null
}

const authSlice = createSlice ({
    name: 'auth',
    initialState,
    reducers: {
        //set the state and localStorage userInfo to payload
        setCredentials: (state, action) => { 
            state.userInfo = action.payload
            localStorage.setItem('userInfo', JSON.stringify(action.payload))
        },

        logout: (state, action) => {
            state.userInfo = null
            localStorage.removeItem('userInfo')
        }
    }
})

export const {setCredentials, logout} = authSlice.actions;

export default authSlice.reducer;