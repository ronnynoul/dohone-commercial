import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Enrolement from './pages/Enrolement'
import ListeEnrollements from './pages/ListeEnrollements'
import Confirmation from './pages/Confirmation'
import Dashboard from "./pages/Dashboard"
import MesEnrolements from "./pages/MesEnrolements"




function App() {

  return (
     <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/enrolement" element={<Enrolement />} />
        <Route path="/liste" element={<ListeEnrollements />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mes-enrolements" element={<MesEnrolements />} />


      </Routes>
    </div>
  )
}

export default App
