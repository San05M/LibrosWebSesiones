/*
Ejercicio de desarrollo de una web con Express, sobre la base de datos
de "libros" utilizada en sesiones anteriores. Se definirán distintas
vistas en Nunjucks para mostrar información de los libros y poderlos
insertar, borrar, etc.
*/

// Carga de librerías
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');

// Enrutadores
const libros = require(__dirname + '/routes/libros');
const autores = require(__dirname + '/routes/autores');
const auth = require(__dirname + '/routes/auth');

// Conectar con BD en Mongo 
mongoose.connect('mongodb://127.0.0.1:27017/libros');

// Inicializar Express
let app = express();

// Configuramos motor Nunjucks
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// Asignación del motor de plantillas
app.set('view engine', 'njk');

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// Configuración de la sesión
app.use(session({
  secret: '1234',
  resave: true,
  saveUninitialized: false,
  expires: new Date(Date.now() + (30 * 60 * 1000))
}));
// Middleware para procesar otras peticiones que no sean GET o POST
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method;
    delete req.body._method;
    return method;
  } 
}));
app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
app.use('/auth', auth);
app.use('/libros', libros);
app.use('/autores', autores) 

// Ruta para redirigir a los libros desde la raíz
app.get('/', (req, res) => {
  res.redirect('/libros');
});

// Puesta en marcha del servidor
app.listen(8080);