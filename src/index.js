const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// importar y ejecutar la conexion de mongo
const dbConnect = require('../config/connection');
dbConnect();

//Instalar y configuar EL JWT y bcrypt
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});
server.set('view engine', 'ejs');

//conexion a la base de datos
async function getConnection() {
  //crear y configurar la conexion
  const connection = await mysql.createConnection({
    host: 'Localhost',
    user: 'root',
    password: process.env.PASS /*poner cada una su password para arrancar*/,
    database: process.env.DATABASE /* 'netflix'*/,
  });
  connection.connect();
  return connection;
}

//console.log(process.env);

server.get('/movies', async (req, res) => {
  //1. Obtener los datos de la base de datos
  const conex = await getConnection();
  const genre = req.query.genre;
  console.log(genre);
  let moviesList = '';
  if (genre === '' || genre === undefined) {
    const query = 'select * from movies';
    const [results] = await conex.query(query);
    console.log(results);
    moviesList = results;
  } else {
    const query = 'select * from movies where genre = ?';
    const [results] = await conex.query(query, [genre]);
    moviesList = results;
  }
  res.json({
    success: true,
    movies: moviesList,
  });
  conex.end();
});

//endpoint para todas las películas
// server.get('/movies', async (req, res) => {
//   //1. Obtener los datos de la base de datos
//   const conn = await getConnection();
//   //2. Consulta que quiero a la bd: obtener todas las alumnas
//   const queryMovies = 'SELECT * FROM movies';
//   //3. Ejecutar la consulta
//   const [results, fields] = await conn.query(queryMovies);
//   console.log(fields);
//   console.log(results);
//   //4.Cerrar la conexión
//   conn.end();
//   res.json({
//     success: true,
//     movies: results
//   });
// });

server.get('/movies/:movieId', async (req, res) => {
  console.log(req.params.movieId);
  const queryMovie = 'SELECT * FROM movies WHERE idMovies=?;';
  //hacer la conexión
  const conn = await getConnection();

  //Ejecutar la query
  const [results] = await conn.query(queryMovie, [req.params.movieId]);

  res.render('movie', {foundMovie: results});
  console.log(queryMovie);
  console.log(results);
  conn.end();
});

//Proceso de registro
//usuario, contraseña, email, nombre....
server.post('/sign-up', async (req, res) => {
  const username = req.body.name;
  const password = req.body.password;
  const email = req.body.email;
  //encriptar la contraseña
  const passwordHashed = await bcrypt.hash(password, 10); //aumentar la seguridad de contraseña encriptada
  // prepara la consulta sql
  const sql =
    "INSERT INTO users(user, password, email, name, plan_details) VALUES (?, ? ,?, ?, ?)"; //nos daba error porque nos faltaban pasar parametros user y plan_detail, porque eran obligatorios
  const conn = await getConnection(); 
  const [results] = await conn.query(sql, [email, passwordHashed, email, username, "Standard"]);  // hemos vuelto a pasar email como valor para no tener que inventar en el post un nuevo valor, y "Standard" es un valor fijo que es obligatorio
  conn.end();
  res.json({
    success: true,
    id: results.insertId,
  });
});




 //servidor de estáticos
const staticServerPath = './web/dist';
server.use(express.static(staticServerPath));

const pathImgServer = './src/public-movies-images/';
server.use(express.static(pathImgServer));

const pathServerPublicStyles = '../web/src/styles/index.css';
server.use(express.static(pathServerPublicStyles));

module.exports = server;