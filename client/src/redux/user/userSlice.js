import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    currentUser : null,
    loading : false,
    error : null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers : {
        signInStart : (state) =>{
            state.loading = true;
        },
        signInSuccess : (state,action) =>{
            state.loading = false;
            state.currentUser = action.payload;
            state.error = null;
        },
        signInFailed : (state,action) =>{
            state.loading = false;
            state.currentUser = null;
            state.error = action.payload;
        },
    }
});

export const {signInStart,signInSuccess,signInFailed} = userSlice.actions;
export default userSlice.reducer;