import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

export default function ProfilePrivateRoute() {
  const user = useSelector(state=>state.user);
  return (
    user.currentUser !==null ? <Outlet /> : <Navigate to="/sign-in"/> 
  )
}
