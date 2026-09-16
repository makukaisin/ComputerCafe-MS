import {
  Navigate,
  Route,
  Routes
} from 'react-router-dom'

import { useAuth } from './context/AuthContext.jsx'

import ProtectedRoute from './components/ProtectedRoute.jsx'
import DashboardLayout from './components/DashboardLayout.jsx'

import LoginPage from './pages/LoginPage.jsx'
import StationListPage from './pages/StationListPage.jsx'
import AddStationPage from './pages/AddStationPage.jsx'
import StationDetailsPage from './pages/StationDetailsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

function RootRedirect() {

  const { isAuthenticated } = useAuth()

  return (
    <Navigate
      to={
        isAuthenticated
          ? '/stations'
          : '/login'
      }
      replace
    />
  )
}

export default function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<RootRedirect />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route element={<ProtectedRoute />}>

        <Route element={<DashboardLayout />}>

          <Route
            path="/home"
            element={
              <Navigate
                to="/stations"
                replace
              />
            }
          />

          <Route
            path="/stations"
            element={<StationListPage />}
          />

          <Route
            path="/stations/add"
            element={<AddStationPage />}
          />

          <Route
            path="/stations/:id"
            element={<StationDetailsPage />}
          />

        </Route>

      </Route>

      <Route
        path="*"
        element={<NotFoundPage />}
      />

    </Routes>

  )
}