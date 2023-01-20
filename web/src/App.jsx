import { useEffect } from 'react'
import { useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:4000'

function getCookie(key) {
  if (!document.cookie) return null
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${key}=`))
    .split('=')[1]
}

function removeCookie(key) {
  if (!document.cookie) return null

  document.cookie = key + "=;expires="
    + new Date(0).toUTCString();
}

function App() {
  const [user, setUser] = useState(null)
  const token = getCookie('token')

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await fetch(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })


        const data = await response.json()

        if (!data?.id) {
          return removeCookie('token')
        }


        setUser(data)
      } catch (error) {
        setUser(null)
        removeCookie('token')
      }

    }
    if (token) {
      getUserInfo()
    }

  }, [token])

  const toApiUrl = () => {
    window.location.href = `${API_URL}/auth/discord`
  }

  const logout = () => {
    removeCookie('token')
    setUser(null)
  }


  if (token) {
    return (
      <div className="App">
        {
          user ? (
            <>
              <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} alt={`${user.username}'s photo`} />
              <h1>{user.username}</h1>
              <p>{user.email}</p>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <svg style={{ backgroundColor: 'white' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )
        }
      </div>
    )
  }

  return (
    <div className="App">
      {/**
       * Se puede usar un link o un boton para redireccionar a la ruta de la API
       * Nota: Al usar el boton se puede ocultar la ruta de la API
       */}
      {/* <a href={`${API_URL}/auth/discord`}>Login with Discord</a> */}
      <button onClick={toApiUrl} href={`${API_URL}/auth/discord`}>Login with Discord</button>
    </div>
  )
}

export default App
