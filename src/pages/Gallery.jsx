import React, { useEffect, useState } from 'react';
import './Gallery.css';
import API from '../api';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch all images from backend
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data } = await API.get('/api/gallery'); 
        setImages(data.images || []);
      } catch (err) {
        console.error('Error fetching gallery images:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);
  const nextImage = () =>
    setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="gallery-page">
      <h2>Gallery</h2>

      {loading ? (
        <p>Loading images...</p>
      ) : images.length === 0 ? (
        <p>No images available</p>
      ) : (
        <div className="masonry">
          {images.map((img, idx) => (
            <div
              className="masonry-item"
              key={img.id || idx}
              onClick={() => openLightbox(idx)}
            >
              <img src={img.url} alt={img.title || 'Gallery Image'} />
            </div>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div className="lightbox">
          <span className="close" onClick={closeLightbox}>&times;</span>
          <span className="prev" onClick={prevImage}>&#10094;</span>
          <img
            className="lightbox-image"
            src={images[currentIndex].url}
            alt={images[currentIndex].title}
          />
          <span className="next" onClick={nextImage}>&#10095;</span>
          <div className="caption">{images[currentIndex].title}</div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
