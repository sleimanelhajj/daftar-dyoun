import './App.css'
import Header from './components/header'
import Msarif from './components/Msarif'
import Dyoun from './components/Dyoun';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/msarif" element={<Msarif />} />
        <Route path="/dyoun" element={<Dyoun />} />
      </Routes>
    </Router>
  )
}

export default App
