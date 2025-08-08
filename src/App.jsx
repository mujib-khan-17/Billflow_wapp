// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ProjectManagement from './pages/Projects';
import BillingGeneration from './pages/Billing_generation';
import BillingHistory from './pages/Billing_history';
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Projects" element={<ProjectManagement />} />
        <Route path='/billing-generation' element={<BillingGeneration />} />
        <Route path='/billing-history' element={<BillingHistory />} />
      </Routes>
    </Router>
  );
}
