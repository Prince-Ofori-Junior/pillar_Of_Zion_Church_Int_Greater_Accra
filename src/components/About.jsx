import React, { useState } from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaTwitter, FaHome, FaDonate, FaCalendarAlt, FaBookOpen } from 'react-icons/fa';
import '../styles/About.css';

const About = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you, ${formData.name}! Your message has been sent.`);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section className="about-section">
      <div className="about-container">

        {/* Bottom Row */}
        <div className="about-bottom-row">

          {/* Left Column: Contact + Social */}
          <div className="about-contact">
            <h4>Contact Us</h4>
            <p><FaEnvelope className="icon" /> pillarofzion32@gmail.com</p>
            <p><FaPhoneAlt className="icon" /> +233 208428411</p>
            <p><FaMapMarkerAlt className="icon" /> Accra-Kasoa, Roman Winger-Poultry Farm</p>

            <h4 style={{ marginTop: '1rem' }}>Connect With Us</h4>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            </div>
          </div>



             {/* Right Column: Quick Links */}
          <div className="about-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/"><FaHome /> Home</a></li>
              <li><a href="/donations"><FaDonate /> Donations</a></li>
              <li><a href="/events"><FaCalendarAlt /> Events</a></li>
              <li><a href="/sermons"><FaBookOpen /> Sermons</a></li>
              <li><a href="/prayers"><FaBookOpen /> Prayers</a></li>
            </ul>
          </div>

          {/* Middle Column: Email Form */}
          <div className="about-email">
            <h4>Send Us a Message</h4>
            <form className="contact-form" onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="name" 
                placeholder="Your Name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
              <input 
                type="email" 
                name="email" 
                placeholder="Your Email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
              <textarea 
                name="message" 
                placeholder="Your Message" 
                value={formData.message} 
                onChange={handleChange} 
                rows="4" 
                required 
              />
              <button type="submit" className="about-btn">Send</button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
