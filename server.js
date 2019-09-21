var express = require('express');
var http = require('http');
var app = express();
var httpServer = http.createServer(app);
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database'); // get db config file
var User = require('./app/models/user');
var Employee = require('./app/models/employee'); // get the mongoose model
var Location = require('./app/models/location'); // get the mongoose model
var Sections = require('./app/models/sections'); // get the mongoose model
var Tables = require('./app/models/tables'); // get the mongoose model
var port = 3000;
var jwt = require('jwt-simple');
var uri = process.env.MONGODB_URI || process.env.MONGOHQ_URL || process.env.MONGOLAB_URI ||
  config.database.database;

app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'html');
app.use(express.static(__dirname + '/assets'));

// get our request parameters
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// log to console
app.use(morgan('dev'));

// Use the passport package in our application
app.use(passport.initialize());

// demo Route (GET http://localhost:3000)
app.get('/', function(req, res) {
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});


// connect to database
mongoose.connect(uri);

var db = mongoose.connection;

db.on('error', function(err) {
  console.log('mongodb connection error: %s', err);
  process.exit();
});
db.once('open', function() {
  console.log('Successfully connected to mongodb');
  app.emit('dbopen');
});
// pass passport for configuration
require('./config/passport')(passport);

// bundle our routes
var apiRoutes = express.Router();

// create a new user account (POST http://localhost:3000/api/signup)
apiRoutes.post('/signup', function(req, res) {
  if (!req.body.name || !req.body.password) {
    res.json({
      success: false,
      msg: 'Please pass name and password.'
    });
  } else {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({
          success: false,
          msg: 'Username already exists.'
        });
      }
      res.json({
        success: true,
        msg: 'Successful created new user.'
      });
    });
  }
});
//Start of Employee Module Service Calls

apiRoutes.post('/addEmployee', function(req, res) {
  if (!req.body.employeeInfo[0]) {
    res.json({
      success: false,
      msg: 'Please pass name and password.'
    });
  } else {
    var newEmployee = new Employee({
      name: req.body.employeeInfo[0].name,
      phoneNumber: req.body.employeeInfo[0].phoneNumber,
      email: req.body.employeeInfo[0].email,
      locationId: req.body.employeeInfo[0].locationId,
      locationName: req.body.employeeInfo[0].locationName,
      sectionName: req.body.employeeInfo[0].sectionName,
      role: req.body.employeeInfo[0].role
    });
    // save the user
    newEmployee.save(function(err) {
      if (err) {
        return res.json({
          success: false,
          msg: 'Employee already exists.'
        });
      }
      res.json({
        success: true,
        msg: 'Successfully created employee.'
      });
    });
  }
});

apiRoutes.get('/getAllEmployees', passport.authenticate('jwt', {
  session: false
}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    Employee.find({}, function(err, employee) {
      if (err) throw err;

      if (!employee) {
        return res.status(403).send({
          success: false,
          msg: 'Authentication failed. employee not found.'
        });
      } else {
        var employeeMap = {};
        console.log("employee Id:", employee);
        employeeMap = employee;

        res.json({
          success: true,
          msg: 'Welcome in the member area ' + employeeMap + '!',
          employees: employeeMap
        });
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      msg: 'No token provided.'
    });
  }
});

//End of Employee Module Service Calls

//Start of Location Module Service Calls

apiRoutes.post('/location', function(req, res) {
  if (!req.body.locationInfo[0]) {
    res.json({
      success: false,
      msg: 'Please pass name and password.'
    });
  } else {
    var newLocation = new Location({
      locationId: mongoose.Types.ObjectId(),
      locationName: req.body.locationInfo[0].locationName,
      sectionName: req.body.locationInfo[0].sections,
      orders: req.body.locationInfo[0].orders
    });
    // save the user
    newLocation.save(function(err) {
      if (err) {
        return res.json({
          success: false,
          msg: 'Location already exists.'
        });
      }
      res.json({
        success: true,
        msg: 'Successfully added Location.'
      });
    });
  }
});

apiRoutes.get('/getAllLocations', passport.authenticate('jwt', {
  session: false
}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    Location.find({}, function(err, location) {
      if (err) throw err;

      if (!location) {
        return res.status(403).send({
          success: false,
          msg: 'Authentication failed. location not found.'
        });
      } else {
        var locationMap = {};
        locationMap = location;

        res.json({
          success: true,
          msg: 'Welcome in the member area ' + locationMap + '!',
          location: locationMap
        });
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      msg: 'No token provided.'
    });
  }
});

//End of Location Module Service Calls

//Start of Section Module Service Calls

apiRoutes.post('/section', function(req, res) {
  if (!req.body.sectionInfo[0]) {
    res.json({
      success: false,
      msg: 'Please pass name and password.'
    });
  } else {
    var newSection = new Sections({
      sectionId: mongoose.Types.ObjectId(),
      locationId: req.body.sectionInfo[0].locationId,
      locationName: req.body.sectionInfo[0].locationName,
      sectionName: req.body.sectionInfo[0].sectionName,
      tables: req.body.sectionInfo[0].tables
    });
    // save the user
    newSection.save(function(err) {
      if (err) {
        return res.json({
          success: false,
          msg: 'Section already exists.'
        });
      } else {
        var query = {
          locationId: req.body.sectionInfo[0].locationId
        };
        var update = {
          sectionName: req.body.sectionInfo[0].sectionName,
        };
        var options = {
          new: true,
          upsert: true
        };
        Location.findOneAndUpdate(query, update, options, function(err,
          location) {
          if (err) {
            throw err;
            console.log("location not found");
          }
          if (!location) {
            return res.status(403).send({
              success: false,
              msg: 'Authentication failed. location not found.'
            });
          } else {
            var locationMap = {};
            console.log("Location Id:", location);
            locationMap = location;

            res.json({
              success: true,
              msg: 'Section Added and location table has been updated',
              location: locationMap
            });
          }
        });
      }
    });
  }
});

apiRoutes.get('/getAllSections', passport.authenticate('jwt', {
  session: false
}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    Sections.find({}, function(err, section) {
      if (err) throw err;

      if (!section) {
        return res.status(403).send({
          success: false,
          msg: 'Authentication failed. section not found.'
        });
      } else {
        var sectionMap = {};
        sectionMap = section;

        res.json({
          success: true,
          msg: 'Welcome in the member area ' + sectionMap + '!',
          section: sectionMap
        });
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      msg: 'No token provided.'
    });
  }
});

//End of Section Module Service Calls

//Start of Table Module Service Calls
apiRoutes.post('/tables', function(req, res) {
  if (!req.body.tableInfo[0]) {
    res.json({
      success: false,
      msg: 'Please pass name and password.'
    });
  } else {
    var newTable = new Tables({
      locationId: req.body.tableInfo[0].locationId,
      locationName: req.body.tableInfo[0].locationName,
      sectionId: req.body.tableInfo[0].sectionId,
      sectionName: req.body.tableInfo[0].sectionName,
      tables: [{
        tableId: mongoose.Types.ObjectId(),
        tableName: req.body.tableInfo[0].tables[0].tableName
      }]
    });
    // save the user
    newTable.save(function(err) {
      if (err) {
        return res.json({
          success: false,
          msg: 'Section already exists.'
        });
      } else {
        var query = {
          sectionId: req.body.tableInfo[0].sectionId
        };
        var update = {
          tables: req.body.tableInfo[0].tables[0].tableName
        };
        var options = {
          new: true,
          upsert: true
        };
        Sections.findOneAndUpdate(query, update, options, function(err,
          section) {
          if (err) {
            throw err;
            console.log("location not found");
          }
          if (!section) {
            return res.status(403).send({
              success: false,
              msg: 'Authentication failed. location not found.'
            });
          } else {
            var sectionMap = {};
            console.log("Location Id:", section);
            sectionMap = section;

            res.json({
              success: true,
              msg: 'Section Added and location table has been updated',
              section: sectionMap
            });
          }
        });
      }
    });
  }
});

apiRoutes.get('/getAllTables', passport.authenticate('jwt', {
  session: false
}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    Tables.find({}, function(err, table) {
      if (err) throw err;

      if (!table) {
        return res.status(403).send({
          success: false,
          msg: 'Authentication failed. section not found.'
        });
      } else {
        var sectionMap = {};
        tableMap = table;

        res.json({
          success: true,
          msg: 'New Table Added ' + tableMap + '!',
          table: tableMap
        });
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      msg: 'No token provided.'
    });
  }
});

//End of Table Module Service Calls

// route to authenticate a user (POST http://localhost:3000/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {
  console.log("Authentication Details : " + req.body.userDetails.username);
  User.findOne({
    name: req.body.userDetails.username
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.send({
        success: false,
        msg: 'Authentication failed. User not found.'
      });
    } else {
      // check if password matches
      user.comparePassword(req.body.userDetails.password, function(err,
        isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({
            success: true,
            token: 'JWT ' + token
          });
          console.log("token : " + token);
        } else {
          res.send({
            success: false,
            msg: 'Authentication failed. Wrong password.'
          });
          console.log("failed");
        }
      });
    }
  });
});

// route to a restricted info (GET http://localhost:3000/api/memberinfo)
apiRoutes.get('/memberinfo', passport.authenticate('jwt', {
  session: false
}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
      if (err) throw err;

      if (!user) {
        return res.status(403).send({
          success: false,
          msg: 'Authentication failed. User not found.'
        });
      } else {
        res.json({
          success: true,
          msg: 'Welcome in the member area ' + user.name + '!',
          username: user.name,
          id: user._id
        });
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      msg: 'No token provided.'
    });
  }
});

getToken = function(headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

// connect the api routes under /api/*
app.use('/api', apiRoutes);

// Start the server
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
