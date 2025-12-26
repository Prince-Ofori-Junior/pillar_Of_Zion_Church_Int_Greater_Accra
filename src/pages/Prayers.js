import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import About from '../components/About';
import API from '../api';

import '../prayer.css';

import prayer1 from '../assets/prayer22.jpg';
import prayer2 from '../assets/prayer22.jpg';

const Prayers = () => {
  const [prayers, setPrayers] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [{ img: prayer1 }, { img: prayer2 }];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev + 2 >= slides.length ? 0 : prev + 2
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Fetch prayers
  const fetchPrayers = async () => {
    try {
      const { data } = await API.get('/prayers');
      setPrayers(data.prayers || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPrayers();
  }, []);

  // Submit prayer
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/prayers', { title, message, isAnonymous });
      setTitle('');
      setMessage('');
      setIsAnonymous(false);
      setShowForm(false);
      fetchPrayers();
    } catch (err) {
      console.error(err);
      alert('Failed to submit prayer.');
    }
  };

  // Prayed For
  const handlePrayedFor = async (id) => {
    setPrayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, prayedCount: (p.prayedCount || 0) + 1 } : p
      )
    );
    try {
      await API.post(`/prayers/${id}/pray`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* HERO SLIDER */}
      <section className="parallax-slider-two">
        <div className="slides-container">
          {slides.slice(currentSlide, currentSlide + 2).map((slide, index) => (
            <div
              key={index}
              className="slide"
              style={{ backgroundImage: `url(${slide.img})` }}
            >
              <div className="slide-content"></div>
            </div>
          ))}
        </div>
      </section>

      <div className="page-container">
        {/* Action Button */}
        <div className="prayer-action">
          <Button onClick={() => setShowForm(true)}>Prayer Request</Button>
        </div>

        {/* Prayer Modal */}
        {showForm && (
          <div className="prayer-modal-overlay" onClick={() => setShowForm(false)}>
            <div className="prayer-modal" onClick={(e) => e.stopPropagation()}>
              <div className="prayer-modal-header">
                <h2>Prayer Request</h2>
                <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
              </div>

              <form onSubmit={handleSubmit} className="prayer-form">
                <input
                  placeholder="Prayer Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Write your prayer request..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                  Submit anonymously
                </label>
                <Button type="submit" full>Submit Prayer 🙏</Button>
              </form>
            </div>
          </div>
        )}

        {/* Prayer Wall */}
        <section className="prayer-wall">
          <h2>Recent Prayers</h2>
          <div className="cards-grid">
            {prayers.length === 0 && <p className="empty-text">No prayers yet. Be the first 🙏</p>}
            {prayers.map((p) => (
              <Card key={p.id} className="prayer-card">
                <h3>{p.title}</h3>
                <span className="prayer-author">{p.isAnonymous ? 'Anonymous' : 'Community Member'}</span>
                <p>{p.message}</p>
                <div className="prayer-footer">
                  <Button onClick={() => handlePrayedFor(p.id)} size="small">
                    ❤️ Prayed For ({p.prayedCount || 0})
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <About />
    </>
  );
};

export default Prayers;
