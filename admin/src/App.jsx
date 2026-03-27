import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Gallery from './pages/Gallery'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={ <Home />}/>
        <Route path='/gallery/:gallery' element={ <Gallery /> }/>
      </Routes>
    </div>
  )
}

export default App;
