// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cookieParser = require('cookie-session');

// PG database client/connection setup
// const { Pool } = require('pg');
// const dbParams = require('../lib/db.js');
// const db = new Pool(dbParams);
// db.connect();

const db = require('../db/queries/queries');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.use(cookieParser({ signed: false }));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "../styles",
  dest: __dirname + "../public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("../routes/users");
const widgetsRoutes = require("../routes/widgets");
const loginRoutes = require('../routes/loginRoutes');
const registerRoutes = require('../routes/registerRoutes');
const logoutRoutes = require('../routes/logoutRoutes');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
app.use('/', loginRoutes(db));
app.use('/', registerRoutes(db));
app.use('/', logoutRoutes());
// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {

  if (req.session.username) {
    res.render("index");
  } else {
    res.render('login', {loginAttempt: true});
  }
});

server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
