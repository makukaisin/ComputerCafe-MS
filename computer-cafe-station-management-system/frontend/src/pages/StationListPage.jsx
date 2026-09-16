import {
    useEffect,
    useState
  } from 'react'
  
  import {
    Link,
    useNavigate
  } from 'react-router-dom'
  
  import StatusMessage
    from '../components/StatusMessage.jsx'
  
  import {
    stationsApi
  } from '../lib/api.js'
  
  const money =
    new Intl.NumberFormat(
      'en-PH',
      {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
      }
    )
  
  export default function StationListPage() {
  
    const navigate = useNavigate()
  
    const [stations, setStations] =
      useState([])
  
    const [loading, setLoading] =
      useState(true)
  
    const [error, setError] =
      useState('')
  
    useEffect(() => {
  
      document.title =
        'Station List | Computer Cafe Station Manager'
  
      let active = true
  
      async function loadStations() {
  
        try {
  
          const response =
            await stationsApi.list()
  
          if (active) {
  
            setStations(
              response.data || []
            )
          }
  
        } catch (err) {
  
          if (active) {
  
            setError(err.message)
          }
  
        } finally {
  
          if (active) {
  
            setLoading(false)
          }
        }
      }
  
      loadStations()
  
      return () => {
        active = false
      }
  
    }, [])
  
    return (
  
      <section>
  
        <div className="page-heading">
  
          <div>
  
            <p className="eyebrow">
              Home / Station List
            </p>
  
            <h2>
              PC Rental Stations
            </h2>
  
            <p className="muted">
              Select a station to view
              its complete details.
            </p>
  
          </div>
  
          <div className="count-chip">
  
            {
              loading
                ? 'Loading…'
                : `${stations.length} station${
                    stations.length === 1
                      ? ''
                      : 's'
                  }`
            }
  
          </div>
  
        </div>
  
        <StatusMessage type="error">
          {error}
        </StatusMessage>
  
        {loading ? (
  
          <div className="panel center-state">
  
            <div className="spinner" />
  
            <p>
              Loading stations…
            </p>
  
          </div>
  
        ) : !error &&
            stations.length === 0 ? (
  
          <div className="panel center-state">
  
            <div className="empty-icon">
              ＋
            </div>
  
            <h3>
              No stations yet
            </h3>
  
            <p className="muted">
              Use the floating action button
              to add your first computer station.
            </p>
  
            <Link
              className="primary-button"
              to="/stations/add"
            >
              Add first station
            </Link>
  
          </div>
  
        ) : (
  
          <div className="station-grid">
  
            {stations.map(station => (
  
              <button
                key={station.id}
                type="button"
                className="station-card"
                onClick={() =>
                  navigate(
                    `/stations/${station.id}`
                  )
                }
              >
  
                <div className="station-card-top">
  
                  <span
                    className={
                      `tier-badge tier-${
                        station.tier
                          .toLowerCase()
                          .replace(/\s+/g, '-')
                      }`
                    }
                  >
  
                    {station.tier}
  
                  </span>
  
                  <span className="pc-number">
  
                    {station.pc_number}
  
                  </span>
  
                </div>
  
                <h3>
                  {station.station_name}
                </h3>
  
                <div className="station-meta">
  
                  <span>
                    Hourly rate
                  </span>
  
                  <strong>
  
                    {
                      money.format(
                        Number(
                          station.hourly_rate
                        )
                      )
                    }
  
                  </strong>
  
                </div>
  
                <span className="details-link">
                  View details →
                </span>
  
              </button>
  
            ))}
  
          </div>
  
        )}
  
        <Link
          className="fab"
          to="/stations/add"
          aria-label="Add station"
          title="Add Station"
        >
          +
        </Link>
  
      </section>
    )
  }