var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/data';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  var collection = db.collection('documents');
  collection.remove({},(err, result)=>{
    console.log(arguments);
    db.close();
  });
  // insertDocuments(db, function() {
  //   find(db, ()=>{
  //       db.close();
  //   });
  //
  // });

});
var find = function(db, callback){
  var collection = db.collection('documents');
  collection.find().toArray(function(err, res){
    console.log(res);
    callback(res);
  });
}
var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}
