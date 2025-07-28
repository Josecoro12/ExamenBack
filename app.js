require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const estudianteRoutes = require('./routes/estudiante');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/estudiante', estudianteRoutes);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión a MongoDB exitosa');
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
  })
  .catch(err => console.error('Error conectando a MongoDB:', err));
