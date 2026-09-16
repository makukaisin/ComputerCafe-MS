import {
    NavLink,
    Outlet,
    useNavigate
  } from 'react-router-dom'
  
  import {
    useAuth
  } from '../context/AuthContext.jsx'
  
  export default function DashboardLayout() {
  
    const { logout } = useAuth()
  
    const navigate = useNavigate()
  
    function handleLogout() {
  
      logout()
  
      navigate(
        '/login',
        { replace: true }
      )
    }
  
    return (
  
      <div className="app-shell">
  
        <header className="topbar">
  
          <div className="brand-lockup">
  
            <div className="brand-icon">
              PC
            </div>
  
            <div>
  
              <p className="eyebrow">
                CCS112 Midterm Laboratory
              </p>
  
              <h1>
                Computer Cafe Station Manager
              </h1>
  
            </div>
  
          </div>
  
          <nav
            className="topnav"
            aria-label="Main navigation"
          >
  
            <NavLink
              to="/stations"
              end
            >
              Station List
            </NavLink>
  
            <NavLink
              to="/stations/add"
            >
              Add Station
            </NavLink>
  
            <button
              className="nav-logout"
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
  
          </nav>
  
        </header>
  
        <main className="main-content">
  
          <Outlet />
  
        </main>
  
      </div>
    )
  }