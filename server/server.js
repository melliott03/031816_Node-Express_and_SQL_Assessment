var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');
var animals = require('./routes/animals');

var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/animals', animals);

// GET/POST/PUT CALLS 
var connectionString;

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/animals';
}

pg.connect(connectionString, function(err, client, done){
  if (err) {
    console.log('Error connecting to DB!', err);

  } else {
    var query = client.query('CREATE TABLE IF NOT EXISTS animals (' +
                              'id SERIAL PRIMARY KEY,' +
                              'name varchar(80) NOT NULL,' +
                              'quantity int NOT NULL);'
  );
    query.on('end', function(){
      console.log('Successfully ensured schema exists');
      done();
    });

    query.on('error', function(error) {
      console.log('Error creating schema!', error);

      done();
    });
  }
});






app.get('/*', function(req, res){
  var filename = req.params[0] || 'views/index.html';
  res.sendFile(path.join(__dirname, '/public/', filename));
});

app.listen(port, function(){
  console.log('Listening for requests on port', port);
});
