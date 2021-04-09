var express = require ('express')  // name of the module and loads the modules required for exports
var bodyParser = require ('body-parser') // extract the body of an incoming request stream and exposes it
var session = require ('express-session');
var validator = require ('express-validator');
const expressSanitizer = require('express-sanitizer');
const app = express() // module with functions or objects or variables assigned to it
const port = 8000 // access url port number
app.use(bodyParser.urlencoded({ extended: true })) // middleware for parsing bodies from url

var MongoClient = require('mongodb').MongoClient; // retrieves mongo client
var url = "mongodb://localhost/mybookshopdb"; // sets url

MongoClient.connect(url, function(err, db) { // connect to the db
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

///added for session management
app.use(session({
    secret: 'somerandomstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));
////////////

app.use(expressSanitizer());

// Express web server
require('./routes/main')(app);
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.set('design',__dirname + '/design');
app.use(express.static('design'));

//////////////

app.listen(port, () => console.log(`Example app listening on port ${port}!`)) // returns http server instance
