import React, { useEffect, useState } from 'react';
import About from '../components/About';
import API from '../api';
import { format, parseISO } from 'date-fns';
import '../Events.css';
import church1 from '../assets/church11.jpg';
import church2 from '../assets/church11.jpg';
import { getClientId } from '../utils/utils';


const Events = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('date');
  const [showPast, setShowPast] = useState(true);
  const [view, setView] = useState('grid'); // grid or calendar
  const [rsvps, setRsvps] = useState({}); // RSVP status
  const clientId = getClientId();


// Fetch events and mark RSVPs
const fetchEvents = async () => {
  try {
    const { data } = await API.get(`/events?client_id=${clientId}`);
    setEvents(data.events || []);

    const initialRsvps = {};
    (data.events || []).forEach(ev => {
      initialRsvps[ev.id] = ev.rsvps?.some(r => r.user_id === clientId) || false;
    });
    setRsvps(initialRsvps);
  } catch (err) {
    console.error(err);
  }
};

// RSVP button
const handleRSVP = async (eventId) => {
  try {
    await API.post(`/events/${eventId}/rsvp`, { client_id: clientId });
    setRsvps(prev => ({ ...prev, [eventId]: true }));
    alert('RSVP successful!');
  } catch (err) {
    console.error(err);
    alert('Failed to RSVP.');
  }
};


  useEffect(() => {
    fetchEvents();
  }, []);

  

  // Slider
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [{ img: church1 }, { img: church2 }];

  const changeSlide = (direction) => {
    let newIndex = currentSlide + direction * 2;
    if (newIndex >= slides.length) newIndex = 0;
    if (newIndex < 0) newIndex = slides.length - 2;
    setCurrentSlide(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => changeSlide(1), 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);
  

  // Filter & sort events
  const filteredEvents = events
    .filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || event.category === category;
      const matchesPast = showPast || new Date(event.date) >= new Date();
      return matchesSearch && matchesCategory && matchesPast;
    })
    .sort((a, b) => {
      if (sort === 'date') return new Date(a.date) - new Date(b.date);
      if (sort === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

  const calendarEvents = filteredEvents.reduce((acc, event) => {
    const day = format(new Date(event.date), 'yyyy-MM-dd');
    if (!acc[day]) acc[day] = [];
    acc[day].push(event);
    return acc;
  }, {});

  const getCountdown = (date) => {
  const now = new Date();
  const eventDate = new Date(date);
  const diff = eventDate - now;

  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;

  const minutes = Math.floor(diff / (1000 * 60));
  return `${minutes} min left`;
};


  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const isPastEvent = (date) => new Date(date) < new Date();

  return (
    <div className="container">
      {/* SLIDER */}
      <section className="parallax-slider-two">
        <div className="slides-container">
          {slides.slice(currentSlide, currentSlide + 2).map((slide, index) => (
            <div
              key={index}
              className="slide"
              style={{ backgroundImage: `url(${slide.img})` }}
            ></div>
          ))}
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="service">Church Service</option>
          <option value="conference">Conference</option>
          <option value="outreach">Outreach</option>
          <option value="youth">Youth Program</option>
          <option value="training">Training</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="date">Sort by Date</option>
          <option value="title">Sort by Title</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={showPast}
            onChange={() => setShowPast(!showPast)}
          />
          Show Past Events
        </label>
        <button
          onClick={() => setView(view === 'grid' ? 'calendar' : 'grid')}
        >
          {view === 'grid' ? 'Calendar View' : 'Grid View'}
        </button>
      </div>

     {/* EVENTS GRID */}
{view === 'grid' && (
  <div className="cards-grid">
    {filteredEvents.length === 0 && <p className="empty-text">No events found.</p>}

    {filteredEvents.map((event) => (
      <div key={event.id} className="card">
        {/* IMAGE */}
       <div className="card-image">
  <img src={event.image || church1} alt={event.title} />

  <span
    className={`event-status ${
      isPastEvent(event.date) ? 'past' : 'upcoming'
    }`}
  >
    {/* {isPastEvent(event.date) ? 'Past Event' : 'Upcoming'} */}
  </span>

  {!isPastEvent(event.date) && (
    <span className="event-countdown">
      ⏳ {getCountdown(event.date)}
    </span>
  )}
</div>


        {/* CARD BODY */}
        <div className="card-body">
          <h3 className="product-name">{event.title}</h3>
          <p className="price1">{formatDate(event.date)}</p>
          <p className="product-description">{event.description}</p>

          {/* STATUS */}
          <span
            className={`event-status ${
              isPastEvent(event.date) ? 'past' : 'upcoming'
            }`}
          >
            {isPastEvent(event.date) ? 'Past Event' : 'Upcoming'}
          </span>

          {/* META */}
          <div className="event-meta">
            {event.time && <p>⏰ {event.time}</p>}
            {event.location && <p>📍 {event.location}</p>}
            {event.category && <span className="event-category">{event.category}</span>}
          </div>

          {/* ACTIONS */}
          <div className="card-actions">
            {event.link && (
              <button onClick={() => window.open(event.link, '_blank')}>
                View Details
              </button>
            )}
            {!rsvps[event.id] && !isPastEvent(event.date) && (
              <button onClick={() => handleRSVP(event.id)}>RSVP</button>
            )}
            {rsvps[event.id] && <span className="rsvp-badge">✅ RSVP'd</span>}
          </div>
        </div>
      </div>
    ))}
  </div>
)}

      {/* CALENDAR VIEW */}
      {view === 'calendar' && (
        <div className="calendar-view">
          {Object.keys(calendarEvents).length === 0 && <p className="empty-text">No events found.</p>}
          {Object.keys(calendarEvents)
            .sort()
            .map((day) => (
              <div key={day} className="calendar-day">
                <h3>{format(parseISO(day), 'EEEE, d MMMM yyyy')}</h3>
                <div className="calendar-events">
                  {calendarEvents[day].map((event) => (
                    <div key={event.id} className="card calendar-card">
                      <h4>{event.title}</h4>
                      {event.time && <p>⏰ {event.time}</p>}
                      {event.location && <p>📍 {event.location}</p>}
                      <p>{event.description}</p>
                      {!rsvps[event.id] && !isPastEvent(event.date) && (
                        <button onClick={() => handleRSVP(event.id)}>RSVP</button>
                      )}
                      {rsvps[event.id] && <span className="rsvp-badge">✅ RSVP'd</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ABOUT SECTION */}
      <section className="about-over-footer">
        <About />
      </section>
    </div>
  );
};

export default Events;
