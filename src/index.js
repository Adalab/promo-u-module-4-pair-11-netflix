const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// importar y ejecutar la conexion de mongo
const dbConnect = require('./config/conexion');
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
  const name = req.body.name;
  const password = req.body.password;
  const email = req.body.email;
  const user = req.body.user;
  //encriptar la contraseña
  const passwordHashed = await bcrypt.hash(password, 10); //aumentar la seguridad de contraseña encriptada
  // prepara la consulta sql
  const sql =
    "INSERT INTO users(user, password, email, name, plan_details) VALUES (?, ? ,?, ?, ?)"; //nos daba error porque nos faltaban pasar parametros user y plan_detail, porque eran obligatorios
  const conn = await getConnection(); 
  const [results] = await conn.query(sql, [user, passwordHashed, email, name, "Standard"]);  // hemos vuelto a pasar email como valor para no tener que inventar en el post un nuevo valor, y "Standard" es un valor fijo que es obligatorio
  conn.end();
  res.json({
    success: true,
    id: results.insertId,
    message: 'nuevo id añadido'
  });
});

//login
const generateToken = (payload) => {
  const token = jwt.sign(payload, 'secreto', { expiresIn: '1h' });
    return token;
  };
  
  const verifyToken = (token) => {
    try {
      const decoded = jwt.verify(token, 'secreto');
      return decoded;
    } catch (err) {
      return null;
    }
  };
  
server.post("/login", async (request, response) => {
  //recibe el cuerpo de la solicitud, que debería contener el nombre de usuario y la contraseña.
  const body = request.body;
  //Buscar si el usuario existe en la bases de datos
  const sql = "SELECT * FROM users WHERE email= ?";
  const connection = await getConnection();
  const [users] = await connection.query(sql, [body.email]);
  connection.end();

  const user = users[0]; //como select siempre me devuelve un listado, me quedo con el primer usuario que cumple la condicion

  //Comprueba si el usuario existe y si la contraseña proporcionada es correcta utilizando bcrypt.compare.
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.password);

  //Si el usuario no existe o la contraseña es incorrecta, responde con un estado 401 y un mensaje de error.
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      success:false,
      error: "Credenciales inválidas",
    });
  }

  //Si las credenciales son correctas, se prepara un objeto userForToken que incluye el username y el id del usuario.
  const userForToken = {
    username: user.username,
    id: user.id,
  };

  //Crear el token para enviar al front
  const token = generateToken(userForToken);

  //Finalmente, si todo es correcto, la función responde con un estado 200 y envía un objeto JSON con el token, el nombre de usuario y el nombre real del usuario.
  response
    .status(200)
    .json({ token, username: user.username, name: user.name });
});




// server.post('/login', async (req, res) => {
// // console.log(req.body);
// const password = req.body.password;
// const email = req.body.email;
// const passwordHashed = await bcrypt.hash(password, 10); 

//   const sql =
//     "SELECT * FROM users WHERE email=? AND password=?";
//     console.log(req.body);
//   const conn = await getConnection(); 
//   const [results] = await conn.query(sql, [email, passwordHashed]);  
//   conn.end();

//   res.json({
//     success: true,
//     message: 'te has logueado'
//   });
// });





 //servidor de estáticos
const staticServerPath = './src/public-react';
server.use(express.static(staticServerPath));

const pathImgServer = './src/public-movies-images/';
server.use(express.static(pathImgServer));

const pathServerPublicStyles = '../web/src/styles/index.css';
server.use(express.static(pathServerPublicStyles));

module.exports = server;