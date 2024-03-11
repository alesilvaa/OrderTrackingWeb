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

//endpoint para consultar todos los pedidos
app.get("/api/tracks", (req, res) => {
  const sql = `SELECT * FROM pedidos`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return handleError(res, 500, 'Error en el servidor');
    }
    res.json(rows);
  });
});

//Endpoint para cargar pedido a la base de datos

app.post("/api/trackAdd", (req, res) => {
  const { numero_pedido, fecha_pedido, cliente, direccion, telefono, estado } = req.body;
  const sql = `INSERT INTO pedidos (numero_pedido, fecha_pedido, cliente, direccion, telefono, estado) VALUES (?, ?, ?, ?, ?, ?)`;

  db.run(sql, [numero_pedido, fecha_pedido, cliente, direccion, telefono, estado], (err) => {
    if (err) {
      return handleError(res, 500, 'Error en el servidor');
    }
    res.json({ message: 'Pedido agregado' });
  });
}
);

// Endpoint para eliminar un pedido
app.delete("/api/trackDelete/:trackingNumber", (req, res) => {
  const trackingNumber = req.params.trackingNumber;
  const sql = `DELETE FROM pedidos WHERE numero_pedido = ?`;

  db.run(sql, [trackingNumber], (err) => {
    if (err) {
      return handleError(res, 500, 'Error en el servidor');
    }
    res.json({ message: 'Pedido eliminado' });
  });
});


// Endpoint para actualizar un pedido

app.put("/api/track/:trackingNumber", (req, res) => {
  const trackingNumber = req.params.trackingNumber;
  const { fecha_pedido, cliente, direccion, telefono, estado } = req.body;
  const sql = `UPDATE pedidos SET fecha_pedido = ?, cliente = ?, direccion = ?, telefono = ?, estado = ? WHERE numero_pedido = ?`;

  db.run(sql, [fecha_pedido, cliente, direccion, telefono, estado, trackingNumber], (err) => {
    if (err) {
      return handleError(res, 500, 'Error en el servidor');
    }
    res.json({ message: 'Pedido actualizado' });
  });
}
);

// Endpoint para consultar todos los pedidos


// Puerto en el que se ejecutará el servidor
const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
