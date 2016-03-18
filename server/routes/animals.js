var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var animals = express.Router();
var pg = require('pg');
var randomNumber = require('./customModule.js');

var app = express();


var connectionString;

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/animals';
}


animals.post('/', function(req, res) {

  console.log('body: ', req.body);
  var name = req.body.name;
  var quantity = randomNumber;


  // connect to DB
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];


      var query = client.query('INSERT INTO animals (name, quantity) VALUES ($1,$2) ' +
                                'RETURNING id, name, quantity', [ name, quantity]);

      query.on('row', function(row){
        result.push(row);
      });
      quantity = randomNumber;

      query.on('end', function() {
        done();
        res.send(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});


animals.get('/', function(req, res) {


  // connect to DB
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];


      var query = client.query('SELECT * FROM animals ORDER BY id DESC;');

      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function() {
        done();
        return res.json(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});


module.exports = animals;
