import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'https://portfolio-cms-production-7468.up.railway.app'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        const response = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        const data = await response.json()
        if (!response.ok) {
            setError('Inavlid username or password')
            return
        } 
        localStorage.setItem('token', data.token)
        navigate('/')
    }
    return (
        <div className='min-h-screen flex flex-col items-center justify-center px-6'>
            <form onSubmit={handleLogin} className='flex flex-col gap-3 w-full max-w-xs'> 
                <input 
                    type='text'
                    placeholder='username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='border-b border-gray-400 outline-none py-1 text-xs bg-transparent'
                 />
                <input 
                    type='password'
                    placeholder='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='border-b border-gray-400 outline-none py-1 text-xs bg-transparent'
                 />
                 <button type='submit' className='text-xs text-left mt-1'>login</button>
            </form>
            {error && <p className='text-xs mt-3 text-gray-400'>{error}</p>}
            <a href="https://asmirmehic.com" target='_blank' className='text-xs mt-6 text-gray-400'>asmirmehic.com</a>
        </div>
    )
}

export default Login