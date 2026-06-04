import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col selection:bg-purple-500/30">
        <Navbar />
        <main className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/upload" element={<UploadPage />} />
            {/* Additional routes can be added here */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
