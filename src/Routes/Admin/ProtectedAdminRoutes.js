import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedAdminRoutes = () => {

    const { isLogedIn } = useSelector(state => state.adminAuth)

    if (isLogedIn === undefined){
        return null
    } else if (isLogedIn) {
        return <Outlet />
    } else if (isLogedIn === false){
        return <Navigate to={'/admin/login'} />
    }
  
}

export default ProtectedAdminRoutes;