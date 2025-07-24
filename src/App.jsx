// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ProjectManagement from './pages/Projects';
import BillingGeneration from './pages/Billings';
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/Projects" element={<ProjectManagement />} />
        <Route path='/Billing' element={<BillingGeneration />} />
      </Routes>
    </Router>
  );
}
