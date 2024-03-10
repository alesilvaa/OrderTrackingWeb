import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

const app = express();
app.use(cors());

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('c:/Users/aacosta/OneDrive/Escritorio/pedidos.db');

// Función para manejar errores
const handleError = (res, statusCode, message) => {
  console.error(message);
  res.status(statusCode).json({ error: message });
};

// Endpoint para consultar un pedido por su número de seguimiento
app.get("/api/track/:trackingNumber", (req, res) => {
  const trackingNumber = req.params.trackingNumber;
  const sql = `SELECT * FROM pedidos WHERE numero_pedido = ?`;

  db.get(sql, [trackingNumber], (err, row) => {
    if (err) {
      return handleError(res, 500, 'Error en el servidor');
    }
    if (!row) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.json(row);
  });
});

// Puerto en el que se ejecutará el servidor
const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
