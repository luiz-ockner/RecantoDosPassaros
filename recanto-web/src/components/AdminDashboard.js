import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [file, setFile] = useState(null);
  const [photos, setPhotos] = useState([]);

  // URL base da sua API de backend
  const API_BASE_URL = 'http://localhost:3001/api';

  useEffect(() => {
    // Carrega as fotos existentes ao iniciar
    const fetchPhotos = async () => {
      const response = await fetch(`${API_BASE_URL}/photos`);
      if (!response.ok) {
        console.error('Erro ao buscar fotos:', response.statusText);
      } else {
        const data = await response.json();
        setPhotos(data);
      }
    };
    fetchPhotos();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Por favor, selecione um arquivo.');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file); // 'photo' deve ser o mesmo nome do campo usado no Multer (upload.single('photo'))

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newPhoto = await response.json();
        // Adiciona a nova foto no início da lista para que apareça de forma imediata
        setPhotos([newPhoto, ...photos]);
        setFile(null); // Limpa o estado para o próximo upload
        // Opcional: limpa o input do tipo file no formulário
        e.target.reset();
      } else {
        console.error('Erro no upload da foto.');
        alert(
          'Erro no upload da foto. Verifique o console para mais detalhes.'
        );
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload. Verifique se o servidor está rodando.');
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
        {photos.length > 0 ? (
          photos.map((photo) => (
            <img
              key={photo.PhotoId}
              // O caminho completo para a imagem no servidor.
              // Note que a URL é `http://localhost:3001` + o caminho retornado pela API.
              src={`http://localhost:3001/${photo.Url.replace(/\\/g, '/')}`}
              alt="Galeria"
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'cover',
                margin: '5px',
              }}
            />
          ))
        ) : (
          <p>Nenhuma foto na galeria ainda.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
