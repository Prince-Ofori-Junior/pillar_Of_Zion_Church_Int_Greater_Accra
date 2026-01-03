import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/Logo.jpg';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [ministriesOpen, setMinistriesOpen] = useState(false); // new state

  const closeMenus = () => {
    setInfoOpen(false);
    setMediaOpen(false);
    setMinistriesOpen(false); // close ministries
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Church Logo" className="logo" />
        <Link to="/" className="nav-brand">
          <div>Pillar Of Zion</div>
          <div>Church International</div>
        </Link>
      </div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={`navbar-right ${menuOpen ? 'show' : ''}`}>
        <NavLink to="/" className="nav-tab" onClick={closeMenus}>
          Home
        </NavLink>

        {/* INFO HUB */}
        <div className="nav-dropdown">
          <span className="nav-tab" onClick={() => setInfoOpen(!infoOpen)}>
            Info Hub ▾
          </span>
          <div className={`nav-dropdown-menu ${infoOpen ? 'open' : ''}`}>
            <NavLink to="/events" className="nav-dropdown-item" onClick={closeMenus}>Events</NavLink>
            <NavLink to="/announcements" className="nav-dropdown-item" onClick={closeMenus}>Announcements</NavLink>
          </div>
        </div>

        {/* MEDIA */}
        <div className="nav-dropdown">
          <span className="nav-tab" onClick={() => setMediaOpen(!mediaOpen)}>
            Media ▾
          </span>
          <div className={`nav-dropdown-menu ${mediaOpen ? 'open' : ''}`}>
            <NavLink to="/sermons" className="nav-dropdown-item" onClick={closeMenus}>Sermons</NavLink>
            <NavLink to="/media/gallery" className="nav-dropdown-item" onClick={closeMenus}>Gallery</NavLink>
          </div>
        </div>

        {/* MINISTRIES */}
        <div className="nav-dropdown">
          <span className="nav-tab" onClick={() => setMinistriesOpen(!ministriesOpen)}>
            Ministries ▾
          </span>
          <div className={`nav-dropdown-menu ${ministriesOpen ? 'open' : ''}`}>
            <NavLink to="/ministries/youth" className="nav-dropdown-item" onClick={closeMenus}>Youth Ministry</NavLink>
            <NavLink to="/ministries/women" className="nav-dropdown-item" onClick={closeMenus}>Women Ministry</NavLink>
            <NavLink to="/ministries/men" className="nav-dropdown-item" onClick={closeMenus}>Men Ministry</NavLink>
            <NavLink to="/ministries/children" className="nav-dropdown-item" onClick={closeMenus}>Children Ministry</NavLink>
          </div>
        </div>

        <NavLink to="/donations" className="nav-tab" onClick={closeMenus}>Donate</NavLink>
        <NavLink to="/prayers" className="nav-tab" onClick={closeMenus}>Prayers</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
