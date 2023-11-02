const mysql = require ("mysql2/promise")

const express = require('express');
const cors = require('cors');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

//conexion a la base de datos
async function getConnection() {
  //crear y configurar la conexion
  const connection = await mysql.createConnection({
    host: 'Localhost',
    user: 'root',
    password: 'Sonrie2132',
    database: 'netflix',
  });
  connection.connect();
  return connection;
}

//iniciar el servidor
const port = 4000;
server.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});


//endpoint para todas las películas
server.get('/movies', async (req, res) => {
  //1. Obtener los datos de la base de datos
  const conn = await getConnection();
  //2. Consulta que quiero a la bd: obtener todas las alumnas
  const queryMovies = 'SELECT * FROM movies';
  //3. Ejecutar la consulta
  const [results, fields] = await conn.query(queryMovies);
  console.log(fields);
  console.log(results);
  //4.Cerrar la conexión
  conn.end();

  res.json(results);
});
