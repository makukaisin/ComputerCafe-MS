const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL
  ||
  'http://127.0.0.1:8000/api'

async function request(
  path,
  options = {}
) {

  let response

  try {

    response = await fetch(
      `${API_BASE_URL}${path}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },

        ...options,
      }
    )

  } catch {

    const error =
      new Error(
        'Cannot reach the Laravel API. Make sure php artisan serve is running on port 8000.'
      )

    error.network = true

    throw error
  }

  const data =
    await response
      .json()
      .catch(() => ({}))

  if (!response.ok) {

    const error =
      new Error(
        data.message
        ||
        'The request could not be completed.'
      )

    error.status = response.status

    error.errors =
      data.errors || {}

    throw error
  }

  return data
}

export const stationsApi = {

  list: () =>
    request('/stations'),

  get: (id) =>
    request(`/stations/${id}`),

  create: (payload) =>
    request(
      '/stations',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    ),

}