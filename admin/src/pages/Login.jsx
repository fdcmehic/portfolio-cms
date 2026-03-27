import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'https://portfolio-cms-production-7468.up.railway.app'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    async function handleLogin(e) {
        e.preventDefault()
        setError(null)

        const response = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })

        console.log(response.status, await response.text())

        const data = await response.json()

        if (!response.ok) {
            setError('Inavlid username or password')
            return
        } 

        localStorage.setItem('token', data.token)
        navigate('/')
    }

    return (
        <div>

            <h1>Admin Login</h1>
            <form onSubmit={handleLogin}> 
                <input 
                    type='text'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                 />
                <input 
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                 />
                 <button type='submit'>Login</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    )
}

export default Login