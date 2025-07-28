const mongoose = require('mongoose');

const estudianteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  edad: { type: Number, required: true },
  carrera: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['estudiante'], default: 'estudiante' }
});

module.exports = mongoose.model('Estudiante', estudianteSchema);
