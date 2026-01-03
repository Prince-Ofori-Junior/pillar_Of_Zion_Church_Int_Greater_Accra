import React, { useEffect, useState } from 'react';
import './Gallery.css';
import API from '../api';
import About from '../components/About'; // ✅ ADD THIS

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  /* ======================
     Fetch PUBLIC gallery
  ====================== */
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await API.get('/api/gallery');
        setGallery(data.gallery || []); // ✅ backend-aligned
      } catch (err) {
        console.error('Failed to load gallery:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const nextImage = () =>
    setCurrentIndex((prev) => (prev + 1) % gallery.length);

  const prevImage = () =>
    setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);

  return (
    <>
      <div className="gallery-page">
        <h2>Photo Gallery</h2>

        {loading ? (
          <p>Loading gallery...</p>
        ) : gallery.length === 0 ? (
          <p>No photos uploaded yet.</p>
        ) : (
          <div className="masonry">
            {gallery.map((item, index) => (
              <div
                key={item.id}
                className="masonry-item"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={item.image}
                  alt={item.title || 'Gallery image'}
                />
              </div>
            ))}
          </div>
        )}

        {/* ======================
           Lightbox
        ====================== */}
        {lightboxOpen && (
          <div className="lightbox">
            <span className="close" onClick={closeLightbox}>&times;</span>
            <span className="prev" onClick={prevImage}>&#10094;</span>

            <img
              className="lightbox-image"
              src={gallery[currentIndex].image}
              alt={gallery[currentIndex].title}
            />

            <span className="next" onClick={nextImage}>&#10095;</span>

            {gallery[currentIndex].title && (
              <div className="caption">
                {gallery[currentIndex].title}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ✅ About Section */}
      <About />
    </>
  );
};

export default Gallery;
