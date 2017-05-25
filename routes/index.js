var express = require('express');
var request = require('request');
var path = require('path');
var router = express.Router();
var fs = require('fs');
var addDb = require('../aggregation');

/* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

  router.post('/', function(req, res, next) {
    var url, fileName, sortOrAggregate, sqlOrCsv,
     delimiter, fieldName1, fieldName2, fieldName3, fieldName4, dBName;
    
    var values = JSON.stringify(req.body);
    JSON.parse(values,(key, val)=>{
      
      switch(key){

        case'url':
        
          url = val;
          break;
        case'filename':
          fileName = val;
          break;
        case'format':
          sqlOrCsv = val;
          break;
        case'sort':
          sortOrAggregate = val;
          break;
        case'delimiter':
          delimiter = val;
          break;
        case'filed1':
          fieldName1 = val;
          break;     
        case'filed2':
          fieldName2 = val;
          break;
        case'filed3':
          fieldName3 = val;
          break;         
        case'filed4':
          fieldName4 = val;
          break;
        case'dBName':
          dBName = val;
          break;   
        default:    
      }
    });
    
      
    
    var promise = new Promise((resolve, reject)=>{
      console.log(url);
    request({
        url: url,
        json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
          var obj = JSON.stringify(body);

          resolve(JSON.parse(obj));
          
        }else{
          reject(error);
        }
    });
  });
  promise.then((data)=>{

    addDb(dBName, fileName, sqlOrCsv, data, sortOrAggregate, delimiter, fieldName1, fieldName2, fieldName3, fieldName4).then((result)=>{
        
        fs.writeFileSync(fileName+'.'+sqlOrCsv, result, 'utf-8');
        res.download(fileName+'.'+sqlOrCsv);

      }, (err)=>{
      
    });
  }, (err)=>{
    
  });
  
  
 // console.log(req.body);
  
 

});

module.exports = router;
