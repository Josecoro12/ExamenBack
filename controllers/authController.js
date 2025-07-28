
const User = require('../models/User');
const Estudiante = require('../models/Estudiante');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 🔐 Generar token
const generarToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// 🔑 Login común
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await Estudiante.findOne({ email });
    }
    if (!user) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }
    const token = generarToken(user._id, user.role);
    res.json({
      token,
      usuario: {
        id: user._id,
        nombre: user.nombre,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// 📝 Registro exclusivo para estudiantes
exports.registrarEstudiante = async (req, res) => {
  try {
    const { nombre, email, password, carrera, edad } = req.body;
    if (!nombre || !email || !password || !carrera || !edad) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }
    const existe = await Estudiante.findOne({ email });
    if (existe) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoEstudiante = new Estudiante({
      nombre,
      email,
      password: hashedPassword,
      carrera,
      edad,
      role: 'estudiante'
    });
    await nuevoEstudiante.save();
    const token = generarToken(nuevoEstudiante._id, nuevoEstudiante.role);
    res.status(201).json({
      token,
      usuario: {
        id: nuevoEstudiante._id,
        nombre: nuevoEstudiante.nombre,
        role: nuevoEstudiante.role
      }
    });
  } catch (error) {
    console.error('Error registrando estudiante:', error);
    res.status(500).json({ mensaje: 'Error al registrar estudiante' });
  }
};
