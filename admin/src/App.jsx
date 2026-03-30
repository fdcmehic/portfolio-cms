import { Routes, Route } from 'react-router-dom'
import Gallery from './pages/Gallery'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import { Navigate } from 'react-router-dom'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Navigate to='/gallery/architecture' />}/>
        <Route path='/gallery/:gallery' element={<ProtectedRoute><Gallery /></ProtectedRoute>}/>
      </Routes>
    </div>
  )
}

export default App;
