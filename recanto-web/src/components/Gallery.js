import React, { useState, useEffect } from 'react';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      const response = await fetch('http://localhost:3001/api/photos');
      const data = await response.json();
      setPhotos(data);
      setLoading(false);
    };
    fetchPhotos();
  }, []);

  if (loading) {
    return <div>Carregando galeria...</div>;
  }

  return (
    <div>
      <h2>Nossa Galeria</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {photos.map((photo) => (
          <img
            key={photo.id}
            src={photo.url}
            alt="Galeria de Casamento"
            style={{ width: '300px', height: '200px', objectFit: 'cover' }}
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
