import {
    useEffect,
    useState
  } from 'react'
  
  import {
    useLocation,
    useNavigate,
    useParams
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
  
  export default function StationDetailsPage() {
  
    const { id } = useParams()
  
    const navigate = useNavigate()
  
    const location = useLocation()
  
    const [station, setStation] =
      useState(null)
  
    const [loading, setLoading] =
      useState(true)
  
    const [error, setError] =
      useState('')
  
    useEffect(() => {
  
      document.title =
        'Station Details | Computer Cafe Station Manager'
  
      let active = true
  
      async function loadStation() {
  
        try {
  
          const response =
            await stationsApi.get(id)
  
          if (active) {
  
            setStation(response.data)
          }
  
        } catch (err) {
  
          if (active) {
  
            setError(
              err.status === 404
                ? 'Station not found.'
                : err.message
            )
          }
  
        } finally {
  
          if (active) {
  
            setLoading(false)
          }
        }
      }
  
      loadStation()
  
      return () => {
        active = false
      }
  
    }, [id])
  
    return (
  
      <section className="narrow-page">
  
        <div className="page-heading">
  
          <div>
  
            <p className="eyebrow">
              Home / Station Details
            </p>
  
            <h2>
              Station Details
            </h2>
  
            <p className="muted">
              Complete information for
              the selected PC rental station.
            </p>
  
          </div>
  
        </div>
  
        <StatusMessage type="success">
          {location.state?.success}
        </StatusMessage>
  
        <StatusMessage type="error">
          {error}
        </StatusMessage>
  
        {loading ? (
  
          <div className="panel center-state">
  
            <div className="spinner" />
  
            <p>
              Loading station details…
            </p>
  
          </div>
  
        ) : station ? (
  
          <div className="panel detail-panel">
  
            <div className="detail-hero">
  
              <div>
  
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
  
                <h3>
                  {station.station_name}
                </h3>
  
                <p className="muted">
                  Database record #{station.id}
                </p>
  
              </div>
  
              <div className="rate-display">
  
                <span>
                  Hourly Rate
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
  
            </div>
  
            <dl className="detail-grid">
  
              <div>
  
                <dt>
                  Station Name
                </dt>
  
                <dd>
                  {station.station_name}
                </dd>
  
              </div>
  
              <div>
  
                <dt>
                  PC Number
                </dt>
  
                <dd>
                  {station.pc_number}
                </dd>
  
              </div>
  
              <div>
  
                <dt>
                  Tier / Category
                </dt>
  
                <dd>
                  {station.tier}
                </dd>
  
              </div>
  
              <div>
  
                <dt>
                  Hourly Rate
                </dt>
  
                <dd>
  
                  {
                    money.format(
                      Number(
                        station.hourly_rate
                      )
                    )
                  }
  
                </dd>
  
              </div>
  
            </dl>
  
            <button
              className="secondary-button"
              type="button"
              onClick={() =>
                navigate('/stations')
              }
            >
              ← Back to Station List
            </button>
  
          </div>
  
        ) : !loading && !error ? (
  
          <StatusMessage type="error">
            Station not found.
          </StatusMessage>
  
        ) : null}
  
      </section>
    )
  }