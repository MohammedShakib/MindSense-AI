import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Auth routes placeholders */}
        <Route path="/login" element={<div className="p-20 text-white">Login Page Placeholder</div>} />
        <Route path="/register" element={<div className="p-20 text-white">Register Page Placeholder</div>} />
        <Route path="/assessment" element={<div className="p-20 text-white">Assessment Setup Placeholder</div>} />
      </Routes>
    </Router>
  );
}

export default App;
