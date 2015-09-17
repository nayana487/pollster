var express = require("express");
var app = express();
var path = require('path');

var collections = ["precincts"]
var mongojs = require("mongojs")
//db name must be test  and collection name must be precincts in mongo
var db = mongojs("test", ['precincts']);
var mongo = require("mongodb");



app.use("/assets", express.static(path.join(__dirname + "/assets")));
app.set('view engine', 'hbs');



app.get('/', function(req, res) {
  res.render("index");
});

app.get('/yeardata/:year', function(req, res) {
  db.precincts.find({year:req.params.year},function(err, docs){
    res.send(docs);
  });
});

app.get('/precinctdata/:mongoid', function(req, res) {
  db.precincts.find({_id:new mongo.ObjectID(req.params.mongoid)},function(err, docs){
    res.send(docs[0]);
  });
});

app.set('port', (process.env.PORT || 4000));

app.listen(4000, function(){
  console.log("app listening on port 4000")
});
