import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoute = ({ isAllowed, redirect }) => {

  if (!isAllowed) {
    return <Navigate to={redirect} />
  }

  return <Outlet />
}

export default ProtectedRoute