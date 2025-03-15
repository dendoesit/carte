import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ProjectProvider } from '@/context/ProjectContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Documentation from './pages/Documentation'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ProjectProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/documentation" element={<Documentation />} />
          </Routes>
        </Router>
      </ProjectProvider>
    </AuthProvider>
  )
}

export default App