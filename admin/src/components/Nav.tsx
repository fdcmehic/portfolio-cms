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
        <nav className='flex flex-wrap justify-center gap-x-3 gap-y-1 px-2 py-2 text-xs'>
            {links.map(link => (
                <button 
                    key={link}
                    onClick={() => gallery !== link && navigate(`/gallery/${link}`)}
                    disabled={gallery === link}
                    className={gallery === link ? 'text-gray-400 cursor-default' : 'text-black cursor-pointer'}
                >
                    {link}
                </button>
            ))}
            <button onClick={handleLogout} className="text-black cursor-pointer">logout</button>
            <a href="https://asmirmehic.com" target="_blank" className="text-gray-400">asmirmehic.com</a>
        </nav>
    )
}
export default Nav