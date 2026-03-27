import { useNavigate } from "react-router-dom"

function Home() {
    const navigate = useNavigate()
    return (
        <div>
            <button onClick={() => navigate('/gallery/architecture')}>architecture</button>
            <button onClick={() => navigate('/gallery/motorsport')}>motorsport</button>
            <button onClick={() => navigate('/gallery/photography')}>photography</button>
        </div>
    )
}

export default Home;