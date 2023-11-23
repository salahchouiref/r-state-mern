import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer, { signInSuccess,SignOut } from "./user/userSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  user: userReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// Set up a timer to clear user information after 24 hours
const clearUserAfter24Hours =  () => {
  const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000 ;

  setTimeout(() => {
    handleSignOut();
    store.dispatch(SignOut());
  }, twentyFourHoursInMilliseconds);
};


const handleSignOut = async (e) =>{
    e.preventDefault();
    try{
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if(data.success){
        console.log(data.message);
      };
    }catch(err){
      console.log(err);
    }
  }




// Initialize the timer
clearUserAfter24Hours();

// Action creators for userSlice.js
export const setUserWithTimer = (user) => {
  // Dispatch the action to set user information
  store.dispatch(signInSuccess(user));

  // Restart the timer when the user is set
  clearUserAfter24Hours();
};
