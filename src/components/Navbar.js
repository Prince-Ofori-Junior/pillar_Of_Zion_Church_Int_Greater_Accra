import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/Logo.jpg';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        {logo && <img src={logo} alt="Church Logo" className="logo" />}
        <Link to="/" className="nav-brand">
          <div>Pillar Of Zion</div>
          <div>Church International</div>
        </Link>
      </div>

      <div className="navbar-right">
        <NavLink to="/" className="nav-tab">Home</NavLink>
        <NavLink to="/events" className="nav-tab">Events</NavLink>
        <NavLink to="/donations" className="nav-tab">Donate</NavLink>
        <NavLink to="/prayers" className="nav-tab">Prayers</NavLink>
        <NavLink to="/sermons" className="nav-tab">Sermons</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
