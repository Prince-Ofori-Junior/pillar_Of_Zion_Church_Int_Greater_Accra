import React, { useState, useEffect, useRef } from 'react';
import API from '../api';
import '../ministries.css';
import { FaHeart, FaShare } from 'react-icons/fa';
import About from '../components/About';

const Ministries = () => {
  const [ministries, setMinistries] = useState([]);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [likes, setLikes] = useState({});
  
  const fetchMinistries = async () => {
    try {
      const res = await API.get('/api/ministries');
      setMinistries(res.data.ministries || []);
      if (res.data.ministries.length > 0) setSelectedMinistry(res.data.ministries[0]);
    } catch (err) {
      console.error('Failed to fetch ministries', err);
    }
  };

  useEffect(() => {
    fetchMinistries();
  }, []);

  const likeMinistry = async (ministryId) => {
    try {
      const res = await API.post(`/api/ministries/${ministryId}/like`);
      setLikes((prev) => ({ ...prev, [ministryId]: res.data.likes }));
    } catch (err) {
      console.error('Failed to like ministry', err);
    }
  };

  const shareMinistry = (ministry) => {
    navigator.clipboard.writeText(ministry.image_url || window.location.href);
    alert('Link copied!');
  };

  const filteredMinistries = ministries.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="ministries-container">
        {/* Main Ministry Display */}
        <div className="main-ministry">
          {selectedMinistry ? (
            <>
              <img
                src={selectedMinistry.image_url || '/placeholder.png'}
                alt={selectedMinistry.name}
                className="main-ministry-image"
              />
              <h2 className="main-ministry-title">{selectedMinistry.name}</h2>
              {selectedMinistry.leader && <p>Leader: {selectedMinistry.leader}</p>}
              {selectedMinistry.description && <p>{selectedMinistry.description}</p>}

              {/* Actions */}
              <div className="ministry-actions">
                <div onClick={() => likeMinistry(selectedMinistry.id)} className="icon-action">
                  <FaHeart /> {likes[selectedMinistry.id] || selectedMinistry.likes || 0}
                </div>
                <div onClick={() => shareMinistry(selectedMinistry)} className="icon-action">
                  <FaShare />
                </div>
              </div>
            </>
          ) : (
            <div>No Ministry Selected</div>
          )}
        </div>

        {/* Sidebar */}
        <div className="sidebar-ministries">
          <h3>Ministries</h3>
          <input
            type="text"
            placeholder="Search ministries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="ministry-list">
            {filteredMinistries.map((m) => (
              <div
                key={m.id}
                className={`ministry-item ${selectedMinistry?.id === m.id ? 'selected' : ''}`}
                onClick={() => setSelectedMinistry(m)}
              >
                <img
                  src={m.image_url || '/placeholder.png'}
                  alt={m.name}
                  className="ministry-thumbnail"
                />
                <p className="ministry-title">{m.name}</p>
                {m.leader && <small>Leader: {m.leader}</small>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <About />
    </>
  );
};

export default Ministries;
