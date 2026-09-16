import { useEffect, useState } from "react";
import {
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext.jsx";
import { stationsApi } from "./lib/api.js";

/* =========================
   PROTECTED ROUTE
========================= */

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/* =========================
   LOGIN PAGE
========================= */

function LoginPage() {
  const {
    isAuthenticated,
    login
  } = useAuth();

  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  if (isAuthenticated) {
    return (
      <Navigate
        to="/stations"
        replace
      />
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    const success =
      login(
        username.trim(),
        password
      );

    if (!success) {
      setError(
        "Invalid username or password."
      );
      return;
    }

    navigate(
      "/stations",
      { replace: true }
    );
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="logo-box">
          PC
        </div>

        <p className="small-label">
          CCS112 MIDTERM LABORATORY
        </p>

        <h1>
          Computer Cafe Station
          Management System
        </h1>

        <p className="muted">
          Administrator Login
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="form"
        >

          <label>
            Username

            <input
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(
                  event.target.value
                )
              }
              placeholder="Enter username"
            />
          </label>

          <label>
            Password

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Enter password"
            />
          </label>

          <button
            type="submit"
            className="primary-button"
          >
            Login
          </button>

        </form>

        <div className="credentials">
          <strong>
            Exam Credentials
          </strong>

          <span>
            cafe_admin / pccafe2026
          </span>
        </div>

      </div>

    </div>
  );
}

/* =========================
   LAYOUT
========================= */

function Layout({ children }) {
  const { logout } = useAuth();

  const navigate =
    useNavigate();

  function handleLogout() {
    logout();

    navigate(
      "/login",
      { replace: true }
    );
  }

  return (
    <div className="app">

      <header className="header">

        <div className="brand">

          <div className="header-logo">
            PC
          </div>

          <div>
            <small>
              CCS112
            </small>

            <h2>
              Computer Cafe Manager
            </h2>
          </div>

        </div>

        <nav>

          <NavLink
            to="/stations"
          >
            Station List
          </NavLink>

          <NavLink
            to="/stations/add"
          >
            Add Station
          </NavLink>

          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>

        </nav>

      </header>

      <main className="content">
        {children}
      </main>

    </div>
  );
}

/* =========================
   STATION LIST
========================= */

function StationListPage() {
  const [stations, setStations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const navigate =
    useNavigate();

  async function loadStations() {
    setLoading(true);
    setError("");

    try {
      const response =
        await stationsApi.list();

      setStations(
        response.data || []
      );

    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStations();
  }, []);

  return (
    <Layout>

      <div className="page-title">

        <div>
          <p className="small-label">
            HOME / STATION LIST
          </p>

          <h1>
            PC Rental Stations
          </h1>

          <p className="muted">
            View all registered
            computer stations.
          </p>
        </div>

        <div className="counter">
          {stations.length}
          {" "}
          Station
          {stations.length !== 1
            ? "s"
            : ""}
        </div>

      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading ? (

        <div className="panel center">
          Loading stations...
        </div>

      ) : stations.length === 0 ? (

        <div className="panel center">

          <h2>
            No stations yet
          </h2>

          <p className="muted">
            Add your first computer
            station.
          </p>

          <button
            className="primary-button"
            onClick={() =>
              navigate(
                "/stations/add"
              )
            }
          >
            Add Station
          </button>

        </div>

      ) : (

        <div className="station-grid">

          {stations.map(
            (station) => (

              <div
                key={station.id}
                className="station-card"
                onClick={() =>
                  navigate(
                    `/stations/${station.id}`
                  )
                }
              >

                <div className="card-top">

                  <span className="badge">
                    {station.tier}
                  </span>

                  <span className="pc-number">
                    {station.pc_number}
                  </span>

                </div>

                <h2>
                  {
                    station.station_name
                  }
                </h2>

                <div className="rate">

                  <span>
                    Hourly Rate
                  </span>

                  <strong>
                    ₱
                    {
                      Number(
                        station.hourly_rate
                      ).toFixed(2)
                    }
                  </strong>

                </div>

                <p className="view-details">
                  View Details →
                </p>

              </div>

            )
          )}

        </div>

      )}

      <button
        className="floating-button"
        onClick={() =>
          navigate(
            "/stations/add"
          )
        }
        title="Add Station"
      >
        +
      </button>

    </Layout>
  );
}

/* =========================
   ADD STATION
========================= */

function AddStationPage() {
  const navigate =
    useNavigate();

  const [stationName, setStationName] =
    useState("");

  const [pcNumber, setPcNumber] =
    useState("");

  const [tier, setTier] =
    useState("");

  const [hourlyRate, setHourlyRate] =
    useState("");

  const [errors, setErrors] =
    useState({});

  const [generalError, setGeneralError] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  function validate() {
    const nextErrors = {};

    if (!stationName.trim()) {
      nextErrors.station_name =
        "Station Name is required.";
    }

    if (!pcNumber.trim()) {
      nextErrors.pc_number =
        "PC Number is required.";
    }

    if (!tier) {
      nextErrors.tier =
        "Tier/Category is required.";
    }

    if (!hourlyRate) {
      nextErrors.hourly_rate =
        "Hourly Rate is required.";

    } else if (
      Number(hourlyRate) < 0
    ) {
      nextErrors.hourly_rate =
        "Hourly Rate must be valid.";
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setGeneralError("");

    const nextErrors =
      validate();

    if (
      Object.keys(nextErrors)
        .length > 0
    ) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSaving(true);

    try {
      const response =
        await stationsApi.create({
          station_name:
            stationName.trim(),

          pc_number:
            pcNumber.trim(),

          tier,

          hourly_rate:
            Number(hourlyRate),
        });

      navigate(
        `/stations/${response.data.id}`,
        {
          state: {
            success:
              "Station added successfully."
          }
        }
      );

    } catch (error) {

      if (
        error.status === 422 &&
        error.errors
      ) {
        const backendErrors = {};

        Object.keys(
          error.errors
        ).forEach((key) => {
          backendErrors[key] =
            error.errors[key][0];
        });

        setErrors(
          backendErrors
        );

      } else {
        setGeneralError(
          error.message
        );
      }

    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout>

      <div className="form-container">

        <div className="page-title">

          <div>
            <p className="small-label">
              HOME / ADD STATION
            </p>

            <h1>
              Add New Station
            </h1>

            <p className="muted">
              Enter the computer
              station information.
            </p>
          </div>

        </div>

        <div className="panel">

          {generalError && (
            <div className="error-message">
              {generalError}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="form"
          >

            <label>
              Station Name

              <input
                type="text"
                value={stationName}
                onChange={(event) =>
                  setStationName(
                    event.target.value
                  )
                }
                placeholder="Example: Alpha Station"
              />

              {errors.station_name && (
                <span className="field-error">
                  {
                    errors.station_name
                  }
                </span>
              )}
            </label>

            <label>
              PC Number

              <input
                type="text"
                value={pcNumber}
                onChange={(event) =>
                  setPcNumber(
                    event.target.value
                  )
                }
                placeholder="Example: PC-001"
              />

              {errors.pc_number && (
                <span className="field-error">
                  {errors.pc_number}
                </span>
              )}
            </label>

            <label>
              Tier / Category

              <select
                value={tier}
                onChange={(event) =>
                  setTier(
                    event.target.value
                  )
                }
              >

                <option value="">
                  Select Category
                </option>

                <option value="Regular">
                  Regular
                </option>

                <option value="VIP">
                  VIP
                </option>

                <option value="Streaming Room">
                  Streaming Room
                </option>

              </select>

              {errors.tier && (
                <span className="field-error">
                  {errors.tier}
                </span>
              )}
            </label>

            <label>
              Hourly Rate (₱)

              <input
                type="number"
                min="0"
                step="0.01"
                value={hourlyRate}
                onChange={(event) =>
                  setHourlyRate(
                    event.target.value
                  )
                }
                placeholder="Example: 50"
              />

              {errors.hourly_rate && (
                <span className="field-error">
                  {
                    errors.hourly_rate
                  }
                </span>
              )}
            </label>

            <div className="button-row">

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  navigate("/stations")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {
                  saving
                    ? "Saving..."
                    : "Save Station"
                }
              </button>

            </div>

          </form>

        </div>

      </div>

    </Layout>
  );
}

/* =========================
   STATION DETAILS
========================= */

function StationDetailsPage() {
  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [station, setStation] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    async function loadStation() {

      try {
        const response =
          await stationsApi.get(id);

        setStation(
          response.data
        );

      } catch (error) {
        setError(error.message);

      } finally {
        setLoading(false);
      }
    }

    loadStation();

  }, [id]);

  return (
    <Layout>

      <div className="form-container">

        <div className="page-title">

          <div>
            <p className="small-label">
              HOME / STATION DETAILS
            </p>

            <h1>
              Station Details
            </h1>
          </div>

        </div>

        {location.state?.success && (
          <div className="success-message">
            {
              location.state.success
            }
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (

          <div className="panel center">
            Loading station...
          </div>

        ) : station ? (

          <div className="panel">

            <div className="details-header">

              <div>

                <span className="badge">
                  {station.tier}
                </span>

                <h2>
                  {
                    station.station_name
                  }
                </h2>

                <p className="muted">
                  Station record
                  #{station.id}
                </p>

              </div>

              <div className="big-rate">

                <span>
                  Hourly Rate
                </span>

                <strong>
                  ₱
                  {
                    Number(
                      station.hourly_rate
                    ).toFixed(2)
                  }
                </strong>

              </div>

            </div>

            <div className="details-grid">

              <div>
                <span>
                  Station Name
                </span>

                <strong>
                  {
                    station.station_name
                  }
                </strong>
              </div>

              <div>
                <span>
                  PC Number
                </span>

                <strong>
                  {
                    station.pc_number
                  }
                </strong>
              </div>

              <div>
                <span>
                  Tier / Category
                </span>

                <strong>
                  {station.tier}
                </strong>
              </div>

              <div>
                <span>
                  Hourly Rate
                </span>

                <strong>
                  ₱
                  {
                    Number(
                      station.hourly_rate
                    ).toFixed(2)
                  }
                </strong>
              </div>

            </div>

            <button
              className="secondary-button"
              onClick={() =>
                navigate(
                  "/stations"
                )
              }
            >
              ← Back to Station List
            </button>

          </div>

        ) : null}

      </div>

    </Layout>
  );
}

/* =========================
   MAIN APP ROUTES
========================= */

export default function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      <Route
        path="/login"
        element={
          <LoginPage />
        }
      />

      <Route
        path="/stations"
        element={
          <ProtectedRoute>
            <StationListPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/stations/add"
        element={
          <ProtectedRoute>
            <AddStationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/stations/:id"
        element={
          <ProtectedRoute>
            <StationDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>
  );
}