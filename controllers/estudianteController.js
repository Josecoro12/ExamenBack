const Estudiante = require('../models/Estudiante');
const bcrypt = require('bcryptjs');

exports.getAll = async (req, res) => {
  try {
    const estudiantes = await Estudiante.find();
    res.json(estudiantes);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener estudiantes' });
  }
};

exports.create = async (req, res) => {
  try {
    const { nombre, edad, carrera, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const estudiante = new Estudiante({ nombre, edad, carrera, email, password: hashedPassword });
    await estudiante.save();
    res.status(201).json(estudiante);
  } catch (err) {
    res.status(400).json({ msg: 'Error al crear estudiante' });
  }
};

exports.getById = async (req, res) => {
  try {
    const estudiante = await Estudiante.findById(req.params.id);
    if (!estudiante) return res.status(404).json({ msg: 'No encontrado' });
    res.json(estudiante);
  } catch (err) {
    res.status(500).json({ msg: 'Error al buscar estudiante' });
  }
};

exports.update = async (req, res) => {
  try {
    const { nombre, edad, carrera, password } = req.body;
    const updateData = { nombre, edad, carrera };
    if (password) updateData.password = await bcrypt.hash(password, 10);
    const estudiante = await Estudiante.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!estudiante) return res.status(404).json({ msg: 'No encontrado' });
    res.json(estudiante);
  } catch (err) {
    res.status(400).json({ msg: 'Error al actualizar estudiante' });
  }
};

exports.delete = async (req, res) => {
  try {
    const estudiante = await Estudiante.findByIdAndDelete(req.params.id);
    if (!estudiante) return res.status(404).json({ msg: 'No encontrado' });
    res.json({ msg: 'Estudiante eliminado' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al eliminar estudiante' });
  }
};
