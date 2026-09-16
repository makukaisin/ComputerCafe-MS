import {
    useEffect,
    useState
  } from 'react'
  
  import {
    Navigate,
    useLocation,
    useNavigate
  } from 'react-router-dom'
  
  import {
    useAuth
  } from '../context/AuthContext.jsx'
  
  import StatusMessage
    from '../components/StatusMessage.jsx'
  
  export default function LoginPage() {
  
    const {
      isAuthenticated,
      login
    } = useAuth()
  
    const navigate = useNavigate()
  
    const location = useLocation()
  
    const [form, setForm] =
      useState({
        username: '',
        password: ''
      })
  
    const [errors, setErrors] =
      useState({})
  
    useEffect(() => {
  
      document.title =
        'Login | Computer Cafe Station Manager'
  
    }, [])
  
    if (isAuthenticated) {
  
      return (
        <Navigate
          to="/stations"
          replace
        />
      )
    }
  
    function handleChange(event) {
  
      const {
        name,
        value
      } = event.target
  
      setForm(current => ({
        ...current,
        [name]: value
      }))
  
      setErrors(current => ({
        ...current,
        [name]: '',
        general: ''
      }))
    }
  
    function handleSubmit(event) {
  
      event.preventDefault()
  
      const nextErrors = {}
  
      if (!form.username.trim()) {
  
        nextErrors.username =
          'Username is required.'
      }
  
      if (!form.password) {
  
        nextErrors.password =
          'Password is required.'
      }
  
      if (
        Object.keys(nextErrors).length > 0
      ) {
  
        setErrors(nextErrors)
  
        return
      }
  
      const valid =
        login(
          form.username.trim(),
          form.password
        )
  
      if (!valid) {
  
        setErrors({
          general:
            'Invalid username or password. Please try again.'
        })
  
        return
      }
  
      const destination =
        location.state?.from
        ||
        '/stations'
  
      navigate(
        destination,
        { replace: true }
      )
    }
  
    return (
  
      <div className="login-page">
  
        <section className="login-card">
  
          <div className="login-badge">
            CCS112
          </div>
  
          <p className="eyebrow">
            University of Cabuyao ·
            College of Computing Studies
          </p>
  
          <h1>
            Computer Cafe Station
            Management System
          </h1>
  
          <p className="muted">
            Administrator access
          </p>
  
          <StatusMessage type="error">
            {errors.general}
          </StatusMessage>
  
          <form
            className="form-stack"
            onSubmit={handleSubmit}
            noValidate
          >
  
            <label className="field">
  
              <span>
                Username
              </span>
  
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                placeholder="Enter username"
                className={
                  errors.username
                    ? 'input-error'
                    : ''
                }
              />
  
              {errors.username && (
  
                <small className="field-error">
                  {errors.username}
                </small>
  
              )}
  
            </label>
  
            <label className="field">
  
              <span>
                Password
              </span>
  
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                placeholder="Enter password"
                className={
                  errors.password
                    ? 'input-error'
                    : ''
                }
              />
  
              {errors.password && (
  
                <small className="field-error">
                  {errors.password}
                </small>
  
              )}
  
            </label>
  
            <button
              className="primary-button full-width"
              type="submit"
            >
              Sign in
            </button>
  
          </form>
  
          <div className="credential-hint">
  
            <strong>
              Exam credentials
            </strong>
  
            <span>
              cafe_admin · pccafe2026
            </span>
  
          </div>
  
        </section>
  
      </div>
    )
  }