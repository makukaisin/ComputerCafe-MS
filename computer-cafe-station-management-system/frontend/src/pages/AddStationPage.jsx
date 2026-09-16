import {
    useEffect,
    useState
  } from 'react'
  
  import {
    useNavigate
  } from 'react-router-dom'
  
  import StatusMessage
    from '../components/StatusMessage.jsx'
  
  import {
    stationsApi
  } from '../lib/api.js'
  
  const initialForm = {
  
    station_name: '',
  
    pc_number: '',
  
    tier: '',
  
    hourly_rate: '',
  
  }
  
  export default function AddStationPage() {
  
    const navigate = useNavigate()
  
    const [form, setForm] =
      useState(initialForm)
  
    const [errors, setErrors] =
      useState({})
  
    const [
      generalError,
      setGeneralError
    ] = useState('')
  
    const [saving, setSaving] =
      useState(false)
  
    useEffect(() => {
  
      document.title =
        'Add Station | Computer Cafe Station Manager'
  
    }, [])
  
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
        [name]: ''
      }))
  
      setGeneralError('')
    }
  
    function validateClientSide() {
  
      const nextErrors = {}
  
      if (!form.station_name.trim()) {
  
        nextErrors.station_name =
          'Station Name is required.'
      }
  
      if (!form.pc_number.trim()) {
  
        nextErrors.pc_number =
          'PC Number is required.'
      }
  
      if (!form.tier) {
  
        nextErrors.tier =
          'Tier/Category is required.'
      }
  
      if (form.hourly_rate === '') {
  
        nextErrors.hourly_rate =
          'Hourly Rate is required.'
  
      } else if (
        Number.isNaN(
          Number(form.hourly_rate)
        )
        ||
        Number(form.hourly_rate) < 0
      ) {
  
        nextErrors.hourly_rate =
          'Enter a valid non-negative hourly rate.'
      }
  
      return nextErrors
    }
  
    async function handleSubmit(event) {
  
      event.preventDefault()
  
      const nextErrors =
        validateClientSide()
  
      if (
        Object.keys(nextErrors).length > 0
      ) {
  
        setErrors(nextErrors)
  
        return
      }
  
      setSaving(true)
  
      setGeneralError('')
  
      try {
  
        const response =
          await stationsApi.create({
  
            station_name:
              form.station_name.trim(),
  
            pc_number:
              form.pc_number.trim(),
  
            tier:
              form.tier,
  
            hourly_rate:
              Number(form.hourly_rate),
  
          })
  
        navigate(
          `/stations/${response.data.id}`,
          {
            replace: true,
  
            state: {
              success:
                'Station saved successfully.'
            },
          }
        )
  
      } catch (err) {
  
        if (
          err.status === 422
          &&
          err.errors
        ) {
  
          const apiErrors =
            Object.fromEntries(
  
              Object.entries(
                err.errors
              ).map(
                ([key, messages]) => [
                  key,
                  messages[0]
                ]
              )
  
            )
  
          setErrors(apiErrors)
  
        } else {
  
          setGeneralError(
            err.message
          )
        }
  
      } finally {
  
        setSaving(false)
      }
    }
  
    return (
  
      <section className="narrow-page">
  
        <div className="page-heading">
  
          <div>
  
            <p className="eyebrow">
              Home / Add Station
            </p>
  
            <h2>
              Add New Station
            </h2>
  
            <p className="muted">
              All fields are required.
            </p>
  
          </div>
  
        </div>
  
        <div className="panel form-panel">
  
          <StatusMessage type="error">
            {generalError}
          </StatusMessage>
  
          <form
            className="station-form"
            onSubmit={handleSubmit}
            noValidate
          >
  
            <label className="field">
  
              <span>
                Station Name
              </span>
  
              <input
                name="station_name"
                value={form.station_name}
                onChange={handleChange}
                placeholder="e.g. Alpha Station"
                className={
                  errors.station_name
                    ? 'input-error'
                    : ''
                }
              />
  
              {errors.station_name && (
  
                <small className="field-error">
                  {errors.station_name}
                </small>
  
              )}
  
            </label>
  
            <label className="field">
  
              <span>
                PC Number
              </span>
  
              <input
                name="pc_number"
                value={form.pc_number}
                onChange={handleChange}
                placeholder="e.g. PC-001"
                className={
                  errors.pc_number
                    ? 'input-error'
                    : ''
                }
              />
  
              {errors.pc_number && (
  
                <small className="field-error">
                  {errors.pc_number}
                </small>
  
              )}
  
            </label>
  
            <label className="field">
  
              <span>
                Tier / Category
              </span>
  
              <select
                name="tier"
                value={form.tier}
                onChange={handleChange}
                className={
                  errors.tier
                    ? 'input-error'
                    : ''
                }
              >
  
                <option value="">
                  Select a category
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
  
                <small className="field-error">
                  {errors.tier}
                </small>
  
              )}
  
            </label>
  
            <label className="field">
  
              <span>
                Hourly Rate (₱)
              </span>
  
              <input
                type="number"
                min="0"
                step="0.01"
                name="hourly_rate"
                value={form.hourly_rate}
                onChange={handleChange}
                placeholder="e.g. 50.00"
                className={
                  errors.hourly_rate
                    ? 'input-error'
                    : ''
                }
              />
  
              {errors.hourly_rate && (
  
                <small className="field-error">
                  {errors.hourly_rate}
                </small>
  
              )}
  
            </label>
  
            <div className="form-actions">
  
              <button
                className="secondary-button"
                type="button"
                onClick={() =>
                  navigate('/stations')
                }
                disabled={saving}
              >
                Cancel
              </button>
  
              <button
                className="primary-button"
                type="submit"
                disabled={saving}
              >
                {
                  saving
                    ? 'Saving…'
                    : 'Save Station'
                }
              </button>
  
            </div>
  
          </form>
  
        </div>
  
      </section>
    )
  }