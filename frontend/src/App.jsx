import HomePage from './Components/HomePage';
import LoginSignup from './Components/LoginSignup'
import Navbar from './Components/Navbar'
import TeamMemberDashboardRefactored from './components/MemberDashboard'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <Navbar /> {/* Show on all pages */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/member" element={<TeamMemberDashboardRefactored />} />
      </Routes>
    </Router>
  );
}