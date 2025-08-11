const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { sql, connectToDatabase } = require('./db');

const app = express();

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conecta ao banco de dados ao iniciar o servidor
connectToDatabase();

// Configuração do Multer para salvar os arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Salva na pasta /uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nome do arquivo único
  },
});

const upload = multer({ storage: storage });

//Rota de upload da foto
app.post('/api/upload', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo enviado.');
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  const createdAt = new Date();

  try {
    const request = new sql.Request();
    request.input('Url', sql.VarChar, fileUrl);
    request.input('CreatedAt', sql.DateTime, createdAt);

    // Insere o caminho no banco de dados
    const result = await request.query(
      `INSERT INTO Photos (Url, CreatedAt) VALUES (@Url, @CreatedAt); SELECT SCOPE_IDENTITY() AS PhotoId;`
    );

    const photoId = result.recordset[0].PhotoId;
    res
      .status(200)
      .json({ PhotoId: photoId, Url: fileUrl, CreatedAt: createdAt });
  } catch (error) {
    console.error('Erro ao salvar no banco de dados:', error);
    res.status(500).send('Erro interno do servidor.');
  }
});

// Rota para buscar as fotos
app.get('/api/photos', async (req, res) => {
  try {
    const result = await sql.query(
      'SELECT * FROM Photos ORDER BY CreatedAt DESC'
    );
    res.json(result.recordset);
  } catch (err) {
    console.error('Erro ao buscar as fotos:', err);
    res.status(500).send('Erro interno do servidor.');
  }
});

// Rota de login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if(!email || !password)
  {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  try{

    const request = new sql.request();
    request.input('Email', sql.VarChar, email);

    // Busca o usuário pelo email
    const result = await request.query(`SELECT UserId, Email, PasswordHash FROM Users WHERE Email = @Email`);

    if(result.recordset.length === 0) {
      return res.status(401).json({ message: 'Email ou senha incorretos.' });
    }

    const user = result.recordset[0];

    if(user.PasswordHash === password) {
      return res.status(200).json({ message: 'Login bem-sucedido.' });
    }
    else
      return res.status(401).json({ message: 'Email ou senha incorretos.' });

  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// Serve os arquivos estáticos (as imagens)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
