const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3001;
const saltRounds = 10;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456', // Ajusta si tienes password
  database: 'registro', // Asegúrate que exista esta BD
});

// Verifica conexión
db.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar a la base de datos:', err);
  } else {
    console.log('✅ Conectado a la base de datos MySQL');
  }
});

// ✅ RUTA DE REGISTRO
app.post('/registro', async (req, res) => {
  const { nombre, apellido, correo, contrasena } = req.body;

  if (!nombre || !apellido || !correo || !contrasena) {
    return res.status(400).json({ message: 'Faltan campos' });
  }

  try {
    console.log('📩 Contraseña recibida:', contrasena);

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);
    console.log('🔐 Contraseña encriptada:', hashedPassword);

    // Insertar en base de datos
    const query = 'INSERT INTO usuarios (nombre, apellido, correo, contrasena) VALUES (?, ?, ?, ?)';
    db.query(query, [nombre, apellido, correo, hashedPassword], (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Correo ya registrado' });
          }
          return res.status(500).json({ message: 'Error al registrar usuario' });
        }
      
        res.status(201).json({ message: 'Usuario registrado con éxito 🎉' });
    });
      
  } catch (err) {
    console.error('❌ Error al encriptar:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// ✅ RUTA DE LOGIN
app.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;

  const query = 'SELECT * FROM usuarios WHERE correo = ?';

  db.query(query, [correo], async (err, results) => {
    if (err) {
      console.error('Error de consulta:', err);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Correo no encontrado' });
    }

    const usuario = results[0];
    const match = await bcrypt.compare(contrasena, usuario.contrasena);

    if (match) {
      res.json({ success: true, message: 'Inicio de sesión exitoso' });
    } else {
      res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }
  });
});

// ✅ FUNCIÓN PARA GENERAR CÓDIGO DE 6 DÍGITOS
const generarCodigo = () => Math.floor(100000 + Math.random() * 900000);

// ✅ RUTA PARA ENVIAR CÓDIGO DE RECUPERACIÓN
app.post('/enviar-codigo', (req, res) => {
  const { correo } = req.body;

  const codigo = generarCodigo();
  const expiraEn = new Date(Date.now() + 10 * 60000); // Expira en 10 minutos

  // Verificar si el correo existe
  const query = 'SELECT * FROM usuarios WHERE correo = ?';
  db.query(query, [correo], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error en el servidor' });
    if (results.length === 0) return res.status(404).json({ message: 'Correo no encontrado' });

    // Guardar código en base de datos
    const insert = 'INSERT INTO reset_tokens (correo, token, fecha_expiracion) VALUES (?, ?, ?)';
    db.query(insert, [correo, codigo, expiraEn], async (err) => {
      if (err) return res.status(500).json({ message: 'Error al guardar el código' });

      // Configurar transporte de correo
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'joselobos6098@gmail.com',
          pass: 'mnzn orjm yrod fwbp',
        },
      });

      const mailOptions = {
        from: 'joselobos6098@gmail.com',
        to: correo,
        subject: 'Código de recuperación de contraseña',
        text: `Tu código de verificación es: ${codigo}. Expira en 10 minutos.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error al enviar el correo:', error);
          return res.status(500).json({ message: 'Error al enviar el correo' });
        }

        res.json({ message: 'Código enviado al correo' });
      });
    });
  });
});

// ✅ RUTA PARA VERIFICAR CÓDIGO
app.post('/verificar-codigo', (req, res) => {
  const { correo, codigo } = req.body;

  const query = 'SELECT * FROM reset_tokens WHERE correo = ? AND token = ? AND fecha_expiracion > NOW()';
  db.query(query, [correo, codigo], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error en el servidor' });
    if (results.length === 0) return res.status(400).json({ message: 'Código incorrecto o expirado' });

    res.json({ success: true, message: 'Código válido' });
  });
});

// ✅ RUTA PARA RESTABLECER CONTRASEÑA
app.post('/restablecer-contrasena', async (req, res) => {
  const { correo, codigo, nuevaContrasena } = req.body;

  const query = 'SELECT * FROM reset_tokens WHERE correo = ? AND token = ? AND fecha_expiracion > NOW()';
  db.query(query, [correo, codigo], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Error en el servidor' });
    if (results.length === 0) return res.status(400).json({ message: 'Código inválido o expirado' });

    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
    const updateQuery = 'UPDATE usuarios SET contrasena = ? WHERE correo = ?';
    db.query(updateQuery, [hashedPassword, correo], (err) => {
      if (err) return res.status(500).json({ message: 'Error al actualizar la contraseña' });

      // Borrar el código de la BD
      const deleteQuery = 'DELETE FROM reset_tokens WHERE correo = ?';
      db.query(deleteQuery, [correo]);

      res.json({ success: true, message: 'Contraseña actualizada' });
    });
  });
});

// ✅ INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
