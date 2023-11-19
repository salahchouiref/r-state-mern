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
        updateUserStart : (state) =>{
            state.loading = true;
        },
        updateUserSuccess : (state,action) =>{
            state.loading = false;
            state.currentUser = action.payload;
            state.error = null;
        },
        updateUserFailure : (state,action) =>{
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart : (state) =>{
            state.loading = true;
        },
        deleteUserSuccess : (state) =>{
            state.loading = false;
            state.currentUser = null;
            state.error = null;
        },
        deleteUserFailure : (state,action) =>{
            state.loading = false;
            state.error = action.payload;
        },
        SignOut : (state) =>{
            state.loading = false;
            state.currentUser = null;
            state.error = null;
        },
        
    }
});

export const {signInStart , signInSuccess , signInFailed ,
    updateUserStart , updateUserSuccess , updateUserFailure ,
    deleteUserStart , deleteUserSuccess , deleteUserFailure , SignOut
} = userSlice.actions;
export default userSlice.reducer;