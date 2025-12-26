import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './components/About';
import '@fortawesome/fontawesome-free/css/all.min.css';


import Home from './pages/Home';
import Events from './pages/Events';
import Donations from './pages/Donations';
import Prayers from './pages/Prayers';
import Sermons from './pages/Sermons';

import './styles/index.css';

function App() {
  return (
    <div className="app-layout">
      <Router>
        <Navbar />

        <div className="app-content">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Home />
                  <About />
                </>
              }
            />
            <Route path="/events" element={<Events />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/prayers" element={<Prayers />} />
            <Route path="/sermons" element={<Sermons />} />
          </Routes>
        </div>

        <Footer />
      </Router>
    </div>
  );
}
export default App;