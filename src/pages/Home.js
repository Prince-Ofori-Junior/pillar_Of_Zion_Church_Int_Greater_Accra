import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import './Home.css';

import img1 from '../assets/image1.jpeg';
import img2 from '../assets/image2.jpeg';
import img3 from '../assets/image3.jpeg';
import img4 from '../assets/image4.jpeg';
import img5 from '../assets/image5.jpeg';
import img6 from '../assets/image6.jpeg';
import img7 from '../assets/image7.jpeg';
import img8 from '../assets/image8.jpeg';
import img9 from '../assets/image9.jpeg';
import img10 from '../assets/image10.jpeg';
import img11 from '../assets/image11.jpeg';
import img12 from '../assets/image12.jpeg';

import API from '../api';
import YouTube from 'react-youtube';
import heroVideo from '../assets/MONTAGE-1b9e1.mp4';

const images = [
  img1, img2, img3, img4, img5, img6,
  img7, img8, img9, img10, img11, img12
];

const Home = () => {
  const [events, setEvents] = useState([]);
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [step, setStep] = useState(window.innerWidth > 768 ? 2 : 1);

  // Handle window resize to switch step
  useEffect(() => {
    const handleResize = () => setStep(window.innerWidth > 768 ? 2 : 1);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cloned images for smooth infinite loop
  const sliderImages = [
    ...images.slice(-step),
    ...images,
    ...images.slice(0, step)
  ];

  // Set initial index based on step
  useEffect(() => {
    setCurrentIndex(step);
  }, [step]);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: eventsData } = await API.get('/api/events');
        setEvents(eventsData.events?.slice(-4).reverse() || []);

        const { data: sermonsData } = await API.get('/api/sermons');
        setSermons(sermonsData.sermons?.slice(-4).reverse() || []);
      } catch (err) {
        console.error('Error fetching latest data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ---------------- AUTO SLIDE ---------------- */
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [isHovered, step]);

  const nextSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + step);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - step);
  };

  const handleTransitionEnd = () => {
    const maxIndex = images.length;
    if (currentIndex >= maxIndex + step) {
      setIsTransitioning(false);
      setCurrentIndex(step);
    }
    if (currentIndex < step) {
      setIsTransitioning(false);
      setCurrentIndex(maxIndex);
    }
  };

  /* ---------------- SERMON VIDEO ---------------- */
  const renderVideo = (sermon) => {
    const youtubeMatch = sermon.media_url?.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([\w-]+)/
    );

    if (youtubeMatch) {
      return (
        <YouTube
          videoId={youtubeMatch[1]}
          opts={{ width: '100%', height: '200', playerVars: { autoplay: 0 } }}
        />
      );
    }

    return (
      <video
        src={sermon.media_url}
        controls
        style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover',
          borderRadius: 8,
          background: 'black'
        }}
      />
    );
  };

  return (
    <>
      {/* ================= HERO SLIDER ================= */}
      <section className="hero-slider">
        <div
          className="slider-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button className="slide-btn prev" onClick={prevSlide}>
            &#10094;
          </button>

          <div
            className="slider-wrapper"
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translateX(-${(currentIndex * 100) / step}%)`,
              transition: isTransitioning ? 'transform 0.8s ease-in-out' : 'none'
            }}
          >
            {sliderImages.map((img, idx) => (
              <div
                className="slide-item"
                key={idx}
                style={{ minWidth: `${100 / step}%` }}
              >
                <img src={img} alt={`Slide ${idx}`} />
              </div>
            ))}
          </div>

          <button className="slide-btn next" onClick={nextSlide}>
            &#10095;
          </button>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
       {/* Features Section */}
<section className="features">
  <h2>Our Features</h2>
  <div className="feature-cards">
    
    <div className="feature-card">
      <div className="feature-icon events">
        <i className="fas fa-calendar-alt"></i>
      </div>
      <h3>Events</h3>
      <p>Join upcoming church events and gatherings.</p>
      <Button onClick={() => window.location.href = '/api/events'}>Explore</Button>
    </div>

    <div className="feature-card">
      <div className="feature-icon prayers">
        <i className="fas fa-praying-hands"></i>
      </div>
      <h3>Prayers</h3>
      <p>Submit prayer requests or pray for others.</p>
      <Button onClick={() => window.location.href = '/api/prayers'}>Pray</Button>
    </div>

    <div className="feature-card">
      <div className="feature-icon sermons">
        <i className="fas fa-video"></i>
      </div>
      <h3>Sermons</h3>
      <p>Watch or listen to recent sermons and teachings.</p>
      <Button onClick={() => window.location.href = '/api/sermons'}>Watch</Button>
    </div>

    <div className="feature-card">
      <div className="feature-icon donation">
        <i className="fas fa-hand-holding-heart"></i>
      </div>
      <h3>Donations</h3>
      <p>Support our mission and help the community.</p>
      <Button onClick={() => window.location.href = '/api/donations'}>Give</Button>
    </div>
    
  </div>
</section>

     {/* Latest Updates Section */}
<section className="latest">
  <h2>Latest Events</h2>
  <div className="latest-cards">
    {loading ? (
      <p>Loading events...</p>
    ) : events.length === 0 ? (
      <p>No events available</p>
    ) : (
      events.map((event, idx) => (
        <div key={event.id} className="custom-card">
          <div className="card-image">
            <img
              src={event.image || images[idx % images.length]}
              alt={event.title}
            />
          </div>
          <div className="card-body">
            <h3>{event.title}</h3>
            {/* Hidden extra info */}
          </div>
        </div>
      ))
    )}
  </div>



  {/* About Section */}
<section className="bout-section">
  <div className="bout-content">
    <p className='p1'>
      Pillar Of Zion is a church that believes in Jesus Christ, a church that loves God and people.
    </p>
    <p className='p2'>
      Overwhelmed by the gift of salvation we have found in Jesus, we have a heart for authentic worship, are passionate about the local church, and are on mission to see God’s kingdom established across the earth.
    </p>
  </div>
</section>


{/* Latest Sermons Section */}
<h2>Latest Sermons</h2>
<div className="latest-cards">
  {loading ? (
    <p>Loading sermons...</p>
  ) : sermons.length === 0 ? (
    <p>No sermons available</p>
  ) : (
    sermons.map((sermon) => {
      const getYouTubeLiveUrl = (s) => {
        if (!s?.social_streams) return null;
        let streams = [];
        try {
          streams =
            typeof s.social_streams === 'string'
              ? JSON.parse(s.social_streams)
              : s.social_streams;
        } catch (err) {
          console.error('Error parsing social_streams', err);
        }
        return (
          streams.find(
            (url) => url.includes('youtube.com') || url.includes('youtu.be')
          ) || null
        );
      };

      const renderVideo = (s) => {
        const { media_url, cameras } = s;
        const liveUrl = getYouTubeLiveUrl(s);
        const videoUrl = media_url || liveUrl;
        const youtubeMatch = videoUrl?.match(
          /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([\w-]+)/
        );

        if (youtubeMatch) {
          const videoId = youtubeMatch[1];
          return (
            <YouTube
              videoId={videoId}
              opts={{ width: '100%', height: '200', playerVars: { autoplay: 0 } }}
            />
          );
        }

        const hlsUrl = cameras?.[0]?.hlsUrl || null;
        return (
          <video
            src={media_url}
            controls
            style={{
              width: '100%',
              height: '200px',
              borderRadius: 8,
              objectFit: 'cover',
              background: 'black',
            }}
          />
        );
      };

      return (
        <div key={sermon.id} className="custom-card">
          <div className="card-video">{renderVideo(sermon)}</div>
          <div className="card-body">
            <h3>{sermon.title}</h3>
            {/* extra info hidden for clean UI */}
          </div>
        </div>
      );
    })
  )}
</div>
</section>
{/* Video Hero Section */}
<div className="video-overlay">
    <h2>Watch Our Story</h2>
    <p>Discover our mission, vision, and impact in the community.</p>
  </div>
<section className="video-hero">
  <div className="video-container">
    <video
      src={heroVideo} // use the imported video
      autoPlay
      muted
      loop
      playsInline
      className="hero-video" 
    />
  </div>
</section>
    </>
  );
  
};


export default Home;