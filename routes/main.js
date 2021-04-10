 module.exports = function (app) // this file has been exported as a function

{
  const { check, validationResult } = require('express-validator'); // validate the inputs and report any before errors anything is run
  const redirectLogin = (req, res, next) => { // route redirect which checks if user is/isn't logged in - pages with access control will require users to login before viewing them
    if (!req.session.userId) { // if user is not logged in, server will redirect them to the login page
      res.redirect('./login')
    } else { next(); } // otherwise continue as normal
  }

  //get requests to the pages and res.render creates html output
  app.get('/', function (req, res) {
    res.render('index.html')
  });

  app.get('/about', function (req, res) {
    res.render('about.html');
  });

  app.get('/search', function (req, res) {
    res.render("search.html")
  });

  app.get('/search-result', function (req, res) { // get route for search results
    var MongoClient = require('mongodb').MongoClient; //retrieve
    var url = 'mongodb://localhost'; // set url
    MongoClient.connect(url, function (err, client) { //connect to the db
      if (err) throw err; // error handling
      var db = client.db('caloriebuddydb'); // name of db
      db.collection('food').find({ name: { $regex: new RegExp(req.query.keyword, "i") } }).toArray((findErr, results) => { // finds name of foods with specific key words - uses regular expressions for
	//matching the text

        if (findErr) throw findErr; // error handling
        if (results == false) { // if item is not in the database, then produce this output
          res.send(' Your food item doesnt exist, please try again or return to the home page ' + '<br />' + '<a href=' + './' + '>Home</a>');
        }
        else
          res.render('searchList.ejs', { availablefoods: results }); // otherwise produce ejs file
        client.close(); // closes all open connections
      });
    });
  });

  app.get('/updatefood', redirectLogin, function (req, res) { // get route for update food
    res.render("updatefood.html"); // outputs update food page
  });

  app.get('/updatingfood', function (req, res) { // get route for updating food
    var MongoClient = require('mongodb').MongoClient; //retrieve
    var url = 'mongodb://localhost'; // set url
    MongoClient.connect(url, function (err, client) { //connect to the db
      if (err) throw err; // error handling
      var db = client.db('caloriebuddydb'); // name of db
      db.collection('food').find({ name: { $regex: new RegExp(req.query.keyword, "i") } }).toArray((findErr, results) => { // finds name of foods with specific key words
        if (findErr) throw findErr;
        if (results == false) { // if statement to check if food in database
          res.send(' Your food item doesnt exist, please try again or return to the home page ' + '<br />' + '<a href=' + './' + '>Home</a>');
        }
        else {
          res.render('updatingfood.ejs', { availablefoods: results }); // otherwise produce output
          client.close(); // closes all open connections
        }
      });
    });
  });

  app.post('/updatedfood', [
    check('name').not().isEmpty(),  // this ensures name value is not empty
    check('value').isNumeric(), // isInt ensures only a numnber is inputted
    check('unit').not().isEmpty(),
    check('calories').isNumeric(),
    check('carbs').isNumeric(),
    check('fat').isNumeric(),
    check('protein').isNumeric(),
    check('salt').isNumeric(),
    check('sugar').isNumeric(),
  ], function (req, res) {
    var MongoClient = require('mongodb').MongoClient; //retrieve
    var url = 'mongodb://localhost'; // set url
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.redirect('./updatefood');
    }
    else {
      MongoClient.connect(url, function (err, client) { //connect to the db
        if (err) throw err; // error handling
        var db = client.db('caloriebuddydb');
        db.collection('food').findOne({ name: req.body.name } // finds the one document according to the condition aswell as match mutiple others
          , function (findErr, result) {
            if (findErr) throw findErr;
            if (result != null) {
              if (result.username == req.session.userId) {
                db.collection('food').updateOne( // updateOne updates the food item
                  { name: req.sanitize(req.body.name) },
                  {
                    $set: {
                      value: req.sanitize(req.body.value), // $set updates the values and then stores into the variables                                                                                    
                      unit: req.sanitize(req.body.unit),     // sanitize ensures nothing unnecessary is entered  
                      calories: req.sanitize(req.body.calories),
                      carbs: req.sanitize(req.body.carbs),
                      fat: req.sanitize(req.body.fat),
                      protein: req.sanitize(req.body.protein),
                      salt: req.sanitize(req.body.salt),
                      sugar: req.sanitize(req.body.sugar)
                    }
                  })
                res.send('The details of this food item has been updated in the database. Please check the list page to confirm the information is correct. ' +
                  '<br />' + '<a href=' + './' + '>Home</a>'); // sends response to user
              }
              else {
                res.send('Error: You are not able to update this item as you are not the user who added the item' + '<br />' + '<a href=' + './' + '>Home</a>')
              }
            }
            else {
              res.send('This food item cannot be found in the database.' + '<br />' + '<a href=' + './' + '>Home</a>')
            }
          });
      });
    }
  });

  app.post('/deletedfood', [
    check('name').not().isEmpty(),  // this ensures name value is not empty
  ], function (req, res) {
    var MongoClient = require('mongodb').MongoClient; //retrieve
    var url = 'mongodb://localhost'; // set url
    const errors = validationResult(req); // gets the validation errors from a request and makes them available in an obejct
    if (!errors.isEmpty()) {
      res.redirect('./updatingfood') // redirects to updatingfood page
    }
    else {
      MongoClient.connect(url, function (err, client) { //connect to the db
        if (err) throw err; // error handling
        var db = client.db('caloriebuddydb'); // searches through the database
        db.collection('food').findOne({ name: req.body.name }
          , function (findErr, result) {
            if (findErr) throw findErr;
            if (result != null) { // multiple conditions for user login checking - // if results are true and username isnt the same as the person who added the item, then user cannot delete the item and                                      vice versa
              if (result.username == req.session.userId) {
                db.collection('food').remove({ // deletes food item from the collection
                  name: req.sanitize(req.body.name) // sanitizing here again to ensure nothing unnecessary is entered
                });
                res.send(' The food item ' + req.body.name + ' has been deleted from the database' + '<br />' + '<a href=' + './' + '>Home</a>'); // confirms deletion
              }
              else {
                res.send('Error: You are not able to delete this item as you are not the user who added the item' + '<br />' + '<a href=' + './' + '>Home</a>')
              }
            }
            else {
              res.send('This food item cannot be found in the database.' + '<br />' + '<a href=' + './' + '>Home</a>')
            }
          });
      });
    }
  });

  app.get('/list', function (req, res) { // get request to list page
    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://localhost';
    MongoClient.connect(url, function (err, client) {
      if (err) throw err;
      var db = client.db('caloriebuddydb');
      db.collection('food').find().toArray((findErr, results) => { // produces all available food using find()
        if (findErr) throw findErr; // error handling
        else
          res.render('list.ejs', { availablefoods: results });
        client.close();
      });
    });
  });

  app.get('/addfood', redirectLogin, function (req, res) { //get request to addfood page         
    res.render("addfood.html");
  });

  app.post('/foodadded', [
    check('name').not().isEmpty(), // form validation
    check('value').isInt(),
    check('unit').not().isEmpty(),
    check('calories').isInt(),
    check('carbs').isInt(),
    check('fat').isInt(),
    check('protein').isInt(),
    check('salt').isInt(),
    check('sugar').isInt(),
  ], function (req, res) { // POST method route
    const errors = validationResult(req); // gets errors
    if (!errors.isEmpty()) {
      res.redirect('./addfood');
    }
    else {
      var MongoClient = require('mongodb').MongoClient;
      var url = 'mongodb://localhost';
      MongoClient.connect(url, function (err, client) {
        check
        if (err) throw err; // error handling
        var db = client.db('caloriebuddydb');
        db.collection('food').insertOne({ // inserts values into collection
          name: req.sanitize(req.body.name), // stores user inputs
          value: req.sanitize(req.body.value),
          unit: req.sanitize(req.body.unit),
          calories: req.sanitize(req.body.calories),
          carbs: req.sanitize(req.body.carbs),
          fat: req.sanitize(req.body.fat),
          protein: req.sanitize(req.body.protein),
          salt: req.sanitize(req.body.salt),
          sugar: req.sanitize(req.body.sugar),
          username: req.session.userId
        });
        client.close();
        res.send('The details of this food item has been stored in the database. Please check the list page to confirm the information is correct. ' +
          '<br />' + '<a href=' + './' + '>Home</a>'); // sends response to user
      });
    }
  });

  app.get('/register', function (req, res) { // get request to register page  
    res.render("register.html");
  });

  app.post('/registered', [
    check('email').isEmail(), // checks if email is an email using validation rules
    check('password').isLength({ min: 8 }), // checks if the minimum password length is 8
    check('first').not().isEmpty(), // checks name values if empty or not
    check('last').not().isEmpty(),
    check('name').not().isEmpty(),
  ], function (req, res) { // POST method route
    const errors = validationResult(req); // gets the validation errors from a request and makes them available in an obejct
    if (!errors.isEmpty()) { // if it is empty, redirects to register again
      res.redirect('./register');
    }
    else { // otherwise continue with registering
      // saving data in database
      var MongoClient = require('mongodb').MongoClient; var url = 'mongodb://localhost';
      const bcrypt = require('bcrypt'); // hashing password
      const saltRounds = 10; // random values
      const plainPassword = req.sanitize(req.body.password); // stores and sanitizes password
      bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) { // method for all const
        // Store hashed password in your database.
        MongoClient.connect(url, function (err, client) {
          if (err) throw err;
          var db = client.db('caloriebuddydb');
          db.collection('users').insertOne({ // collection and documents
            first: req.sanitize(req.body.first),
            last: req.sanitize(req.body.last),
            email: req.sanitize(req.body.email),
            name: req.sanitize(req.body.name),
            password: hashedPassword
          });
          res.send('You are now registered, Your user name is: ' + req.body.name + ' your password is: ' + req.body.password + ' and your hashed password is: ' + hashedPassword +
            '<br />' + '<a href=' + './' + '>Home</a>');  //sends response to user
          client.close();
        })
      })
    }
  });

  app.get('/login', function (req, res) { // get request to login page
    res.render("login.html");
  });

  app.post('/loggedin', function (req, res) { // POST method route
    // saving data in database
    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://localhost';
    const plainPassword = req.body.password // stores as plain password
    const bcrypt = require('bcrypt'); // hashing function from node js library
    MongoClient.connect(url, function (err, client) { // storing hashed password in database
      if (err) throw err;
      var db = client.db('caloriebuddydb');
      db.collection('users').find({ name: req.body.name }).toArray((findErr, user) => { // finds if the user is in the database
        if (findErr) throw findErr; // error handling
        if (!user[0]) { // if not then invalid
          res.send("Login unsuccessful, invalid username or password." + '<br />' + '<a href=' + './' + '>Home</a>');
        }
        else {
          hashedPassword = user[0].password; // sets hashed password as the user password
          bcrypt.compare(plainPassword, hashedPassword, function (err, result) { // pulls the salt out of the hash and then uses it to hash the password and perform the comparison
            if (err) throw err; // error handling 
            if (result == true) { // if true then set userID as the user login name
              req.session.userId = req.body.name;
              res.send("Logged in" + '<br />' + '<a href=' + './' + '>Home</a>'); // sends logged in message
            }
            else {
              res.send("Invalid password" + '<br />' + '<a href=' + './' + '>Home</a>'); // sends if the password is invalid
            }
          });
        }
      });
      client.close();
    });
  });

  app.get('/logout', redirectLogin, (req, res) => { // logout route
    req.session.destroy(err => { // unset req session property
      if (err) {
        return res.redirect('./') // redirect to home page
      }
      res.send('You are now logged out. <a href=' + './' + '>Home</a>');
    })
  });

  app.get('/api', function (req, res) { // api route
    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://localhost';
    MongoClient.connect(url, function (err, client) {
      if (err) throw err
      var db = client.db('caloriebuddydb');
      db.collection('food').find().toArray((findErr, results) => {  // finds the name of the food using toArray again                                                                                       
        if (findErr) throw findErr;
        else
          res.json(results);  // ouputs as a json                                                                                                                                           
        client.close();
      });
    });
  });

  // to get the food: curl -i www.doc.gold.ac.uk/usr/421/api/foodName
  app.get('/api/:food', function (req, res) { // api single food name route
    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://localhost';
    MongoClient.connect(url, function (err, client) {
      if (err) throw err
      var db = client.db('caloriebuddydb');
      var food = req.params.food; // gets name of the route parameter specified in the path
      db.collection('food').find({ name: food }).toArray((findErr, results) => { // find food name using the parameter
        if (findErr) throw findErr;
        else
          res.json(results);
        client.close();
      });
    });
  });

  // to acesss delete use: curl -X DELETE http://www.doc.gold.ac.uk/usr/421/api/food (replace food with item to be deleted).
  app.delete('/api/:food', function (req, res) { // delete method for food api
    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://localhost';
    MongoClient.connect(url, function (err, client) {
      if (err) throw err
      var db = client.db('caloriebuddydb');
      var food = req.params.food;
      db.collection('food').remove({ //deletes food from the collection
        name: food
      }, function (findErr, result) {
        if (findErr) throw findErr;
        else
          res.json(result);
        client.close();
      });
    });
  });

}
