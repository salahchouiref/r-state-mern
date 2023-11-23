import React from 'react';
import {GoogleAuthProvider,signInWithPopup,getAuth} from "@firebase/auth";
import {app} from "../firebase.js";
import {useNavigate} from "react-router-dom";
import {setUserWithTimer} from "../redux/store";

export default function OAuth () {
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try{
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth,provider);
            const res = await fetch("/api/auth/google",{
                method : "POST",
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({
                    name : result.user.displayName, // NB
                    email : result.user.email,
                    photo : result.user.photoURL, 
                })
            });
            const data = await res.json();
            setUserWithTimer(data);
            navigate("/");
        }catch(error){
            console.log("could not login with google",error);
        }
    }
  return (
    <button type='button' onClick={handleGoogleClick} className="bg-red-700 text-white p-2 rounded-l uppercase hover:opacity-80">Continue with google</button>
  )
}
