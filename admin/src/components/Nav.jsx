import { useNavigate, useParams } from "react-router-dom";

function Nav() {
    const navigate = useNavigate()
    const { gallery } = useParams()

    function handleLogout() {
        localStorage.removeItem('token')
        navigate('/login')
    }

    const links = ['architecture', 'motorsport', 'photography']

    return (
        <nav>
            {links.map(link => (
                <button 
                    key={link}
                    onClick={() => gallery !== link && navigate(`/gallery/${link}`)}
                    disabled={gallery === link}
                >
                    {link}
                </button>
            ))}
            <button onClick={handleLogout}>logout</button>
            <a href="https://asmirmehic.com" target="_blank">asmirmehic.com</a>
        </nav>
    )
}
export default Nav