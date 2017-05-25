var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,

    assert = require('assert');
    var fs = require('fs');
    var events = require('events').EventEmitter;
     var eventEmitter = new events();
     String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
     };
     
     Date.prototype.toLocaleFormat = function(format) {
     	var f = {y : this.getYear() + 1900,m : this.getMonth() + 1,d : this.getDate(),H : this.getHours(),M : this.getMinutes(),S : this.getSeconds()}
     	for(k in f)
     		format = format.replace('%' + k, f[k] < 10 ? "0" + f[k] : f[k]);
     	return format;
     };


var addDb = function (dBName, tableName, sqlOrCsv, data, sortOrAggregation, delim, field1, field2, field3, field4){
    var db = new Db(dBName, new Server('localhost', 27017));  
  
   
  return new Promise((resolve, reject)=>{
  var stringSql;
  var stringCsv;
  if(sortOrAggregation === 'sorting'){
      stringSql = 'CREATE TABLE '+ tableName +'(\n'+
              '\t'+field1+' CHAR(250) NOT NULL,\n'+
              '\t'+field2+' TEXT NOT NULL,\n'+
              '\t'+field3+' TIMESTAMP NOT NULL,\n'+
              '\t'+field4+' INT NOT NULL );\n';
        stringSql += ' INSERT INTO '+ tableName +' ( '+field1+','+field2+','+field3+','+field4+' ) VALUES\n';
        stringCsv = field1+delim+field2+delim+field3+delim+field4+'\n';
  }else if(sortOrAggregation === 'aggregation'){
    stringSql = 'CREATE TABLE '+ tableName +'(\n'+
            '\t'+field1+' CHAR(250) NOT NULL,\n'+
            '\t'+field2+' INT NOT NULL,\n'+
            '\t'+field3+' INT NOT NULL);\n';
      stringSql += ' INSERT INTO '+ tableName +' ( '+field1+','+field2+','+field3+' ) VALUES\n';
      stringCsv = field1+delim+field2+delim+field3+'\n';

  }

  db.open(function(err, db) {
  

  var collection = db.collection(tableName);
  
   collection.remove();
  

  collection.insertMany([data], function(err, result) {
    assert.equal(null, err);
    
    var aggregationResult;
    if(sortOrAggregation === 'aggregation'){
        aggregationResult = collection.aggregate([

            { "$unwind": "$data.children"},
            { "$group": {
               "_id": {

                   "domain": "$data.children.data.domain"

               },"count":{"$sum":1},

               "scoreSum": { "$sum": "$data.children.data.score" },

           }},{$sort:{count:-1}}

        ]);
   }else if(sortOrAggregation === 'sorting') {
     aggregationResult = collection.aggregate([

         { "$unwind": "$data.children"},
         { "$group": {
            "_id": {

                "id": "$data.children.data.id",
                "title": "$data.children.data.title",
                "date": "$data.children.data.created_utc",
                "score": "$data.children.data.score"

              }
        }},{$sort:{"_id.score":-1}}

     ]);
   }
   
    aggregationResult.each((err, docs)=>{

      if(docs !== null){
          JSON.stringify(docs, (key, val)=>{
              
            switch (key) {
              case 'domain':
                if(sqlOrCsv === 'sql'){
                    stringSql+='\t( '+val+', ';
                }else if(sqlOrCsv === 'csv'){
                    stringCsv+= '"'+val+'"'+delim;
                }
                break;
              case 'count':
                if(sqlOrCsv === 'sql'){
                    stringSql+= val+', ';
                }else if(sqlOrCsv === 'csv'){
                    stringCsv+= val+delim;
                }
                break;
              case 'scoreSum':
                if(sqlOrCsv === 'sql'){
                    stringSql+= val+'),\n';
                }else if(sqlOrCsv === 'csv'){
                    stringCsv+= val+"\n";
                }
                break;
              case 'id':
                if(sqlOrCsv === 'sql'){
                    stringSql+='\t( '+val+', ';
                }else if(sqlOrCsv === 'csv'){
                    stringCsv+= '"'+val+'"'+delim;
                }
                break;
              case 'title':
                if(sqlOrCsv === 'sql'){
                    stringSql+= '"'+val.replaceAll('"',"'")+'"'+', ';
                    
                }else if(sqlOrCsv === 'csv'){
                    stringCsv+= '"'+val.replaceAll('"',"'")+'"'+delim;
                }
                break;
              case 'date':
                if(sqlOrCsv === 'sql'){
                    stringSql+= new Date(val*1000).toLocaleFormat('%y-%m-%d %H:%M:%S')+', ';
                }else if(sqlOrCsv === 'csv'){
                    stringCsv+= '"'+new Date(val*1000).toLocaleFormat('%y-%m-%d %H:%M:%S')+'"'+delim;
                }
                break;
              case 'score':
                if(sqlOrCsv === 'sql'){
                    stringSql+= val+'),\n';
                }else if(sqlOrCsv === 'csv'){
                    stringCsv+= val+"\n";
                }

                break;
              default:

            }

            return val;
          });
      }
      if(docs == null) {
        
        
        resolve(sqlOrCsv === 'sql'? stringSql.substring(0, (stringSql.length-2))+';' : stringCsv);
        
        db.close();

      }

    });

    });


});

});}

module.exports = addDb;
