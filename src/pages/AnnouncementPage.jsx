import React, { useState, useEffect } from 'react';
import About from '../components/About';
import API from '../api';
import '../AnnouncementPage.css'; // make sure this is updated with the CSS below

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState([]);

  // Fetch announcements from API
  const fetchAnnouncements = async () => {
    try {
      const { data } = await API.get('/api/announcements');
      setAnnouncements(data.announcements || []);
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="parallax-slider-two">
        <div className="slides-container">
          <div className="slide" style={{ backgroundImage: `url('/assets/announcement-hero.jpg')` }}>
            <div className="slide-content">
              <h1>Announcements</h1>
            </div>
          </div>
        </div>
      </section>

      <div className="page-container">
        <section className="announcement-section">
          <h2>Latest Announcements</h2>

          {announcements.length === 0 ? (
            <p className="empty-text">No announcements yet.</p>
          ) : (
            <div className="announcement-grid">
              {announcements.map(a => (
                <div className="announcement-card" key={a.id}>
                  {a.image && <img src={a.image} alt={a.title} className="announcement-img" />}
                  <div className="announcement-content">
                    <h3>{a.title}</h3>
                    <span className="announcement-date">{new Date(a.date).toLocaleDateString()}</span>
                    <p>{a.description}</p>
                    {a.link && (
                      <a href={a.link} target="_blank" rel="noopener noreferrer" className="announcement-link">
                        Read More
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <About />
    </>
  );
};

export default AnnouncementPage;
