import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchPhotos = async () => {
      const photosCollection = await getDocs(collection(db, 'photos'));
      const photosData = photosCollection.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setPhotos(photosData);
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