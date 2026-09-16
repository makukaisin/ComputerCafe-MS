import {
    Link
  } from 'react-router-dom'
  
  export default function NotFoundPage() {
  
    return (
  
      <div className="not-found">
  
        <h1>
          404
        </h1>
  
        <p>
          The page you requested
          does not exist.
        </p>
  
        <Link
          className="primary-button"
          to="/"
        >
          Return home
        </Link>
  
      </div>
  
    )
  }