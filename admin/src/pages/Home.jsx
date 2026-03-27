import { useNavigate } from "react-router-dom"

function Home() {
    const navigate = useNavigate()

    function handleLogout() {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <div>
            <button onClick={() => navigate('/gallery/architecture')}>architecture</button>
            <button onClick={() => navigate('/gallery/motorsport')}>motorsport</button>
            <button onClick={() => navigate('/gallery/photography')}>photography</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Home;