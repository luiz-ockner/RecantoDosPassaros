import React, { useState, useEffect } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db, storage } from '../firebase-config';

const AdminDashboard = () => {
  const [file, setFile] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    // Carrega as fotos existentes ao iniciar
    const fetchPhotos = async () => {
      const photosCollection = await getDocs(collection(db, 'photos'));
      const photosData = photosCollection.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setPhotos(photosData);
    };
    fetchPhotos();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (file) {
      const storageRef = ref(storage, `gallery/${file.name}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);

      // Adiciona a URL da foto no Firestore (banco de dados)
      await addDoc(collection(db, 'photos'), {
        url: photoURL,
        createdAt: new Date(),
      });

      setFile(null); // Limpa o estado após o upload
      // Atualiza a lista de fotos
      const newPhotos = [...photos, { url: photoURL, id: Date.now() }];
      setPhotos(newPhotos);
    }
  };

  return (
    <div>
      <h2>Painel Administrativo</h2>
      <h3>Upload de Fotos</h3>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Adicionar à Galeria</button>
      </form>
      <hr />
      <h3>Galeria Atual</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {photos.map((photo) => (
          <img
            key={photo.id}
            src={photo.url}
            alt="Galeria"
            style={{ width: '150px', height: '150px', objectFit: 'cover', margin: '5px' }}
          />
        ))}
      </div>
    </div>
  );

};

export default AdminDashboard;