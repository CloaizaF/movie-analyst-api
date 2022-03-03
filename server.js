// Get our dependencies
var express = require('express');
var app = express();
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: process.env.DB_HOST || '10.0.0.9',
  port: process.env.DB_PORT || '3306',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'root',
  database: process.env.DB_NAME || 'movie_db'
});

// Connect to the DB
connection.connect();

// Get the movies from the DB
function getMovies(callback) {
  connection.query( "SELECT moviereview.title, moviereview.release, moviereview.score, moviereview.reviewer, reviewer.name, reviewer.publication " + 
                    "FROM movie_db.moviereview " + 
                    "INNER JOIN movie_db.reviewer ON moviereview.reviewer = reviewer.name;",
    function (err, rows) {
      callback(err, rows);
    }
  );
}

// Get the reviewers from the DB
function getReviewers(callback) {
  connection.query("SELECT * FROM movie_db.reviewer;",
    function (err, rows) {
      callback(err, rows);
    }
  );
}

// Get the publications from the DB
function getPublications(callback) {
  connection.query("SELECT * FROM movie_db.publication;",
    function (err, rows) {
      callback(err, rows);
    }
  );
}

// Get the pending reviews from the DB
function getPending(callback) {
  connection.query( "SELECT moviereview.title, moviereview.release, moviereview.score, moviereview.reviewer, reviewer.publication " +
                    "FROM movie_db.moviereview " + 
                    "INNER JOIN movie_db.reviewer ON moviereview.reviewer = reviewer.name;",
    function (err, rows) {
      callback(err, rows);
    }
  );
}

// Implement the testing API endpoint
app.get('/', function (req, res) {
  var response = [{ response: 'hello' }, { code: '200' }]
  res.json(response);
})

// Implement the movies API endpoint
app.get('/movies', function (req, res, next) {
  //now you can call the get-driver, passing a callback function
  getMovies(function (err, moviesResult) {
    //you might want to do something is err is not null...      
    res.json(moviesResult);

  });
});

// Implement the reviewers API endpoint
app.get('/reviewers', function (req, res, next) {
  getReviewers(function (err, reviewersResult) {
    res.json(reviewersResult);
  });
})

// Implement the publications API endpoint
app.get('/publications', function (req, res, next) {
  getPublications(function (err, publicationsResult) {
    res.json(publicationsResult);
  });
})

// Implement the pending reviews API endpoint
app.get('/pending', function (req, res, next) {
  getPending(function (err, pendingResult) {
    res.json(pendingResult);
  });
})

console.log("server listening through port: " + process.env.PORT);
// Launch our API Server and have it listen on port 3000.
app.listen(process.env.PORT || 3000);
module.exports = app;
