import React from 'react';
import '../styles/Card.css';

const Card = ({ title, description, children }) => {
  return (
    <div className="card">
      {title && <h3 className="card-title">{title}</h3>}
      {description && <p className="card-description">{description}</p>}
      {children}
    </div>
  );
};

export default Card;
