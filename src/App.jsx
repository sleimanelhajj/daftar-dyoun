import './App.css'
import Header from './components/header'
import Msarif from './components/Msarif'
import Dyoun from './components/Dyoun';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/msarif" element={
            <PrivateRoute><Msarif /></PrivateRoute>
          } />
          <Route path="/dyoun" element={
            <PrivateRoute><Dyoun /></PrivateRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
