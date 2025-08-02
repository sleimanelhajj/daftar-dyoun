import './App.css'
import Header from './components/header'
import Msarif from './components/Msarif'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/msarif" element={<Msarif />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  )
}

export default App
