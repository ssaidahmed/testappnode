var http = require('http');
var request = require('request');
var fs = require('fs');
var url = require('url');
var addDb = require('./aggregation');
var server = http.Server();
var events = require('events').EventEmitter;
 var eventEmitter = new events();
 //делал без монго Дб, но не доделал, потому что решил сделать с помощью монго. Да и этот вариант легче. Тут и так почти все сделано 
// var eventEmitter = require('events');
//https://www.reddit.com/r/javascript/.json
Date.prototype.toLocaleFormat = function(format) {
	var f = {y : this.getYear() + 1900,m : this.getMonth() + 1,d : this.getDate(),H : this.getHours(),M : this.getMinutes(),S : this.getSeconds()}
	for(k in f)
		format = format.replace('%' + k, f[k] < 10 ? "0" + f[k] : f[k]);
	return format;
};
var url = "https://www.reddit.com/r/javascript/.json"
var map = {
	id:[],
	title:[],
	created_utc:[],
	score:[],
	domain:[]

};
var jsonData = 1;

var promise = new Promise((resolve, reject)=>{
  request({
      url: url,
      json: true
  }, function (error, response, body) {

      if (!error && response.statusCode === 200) {
        var obj = JSON.stringify(body);

  			jsonData = obj;
        resolve(JSON.parse(obj));
        JSON.parse(obj, (key, value) =>{

  				switch (key) {
  					case 'id':
  					  map.id.push(value);
  						break;
  					case'title':
  					  map.title.push(value);
  						break;
  					case'created_utc':
  						map.created_utc.push(value);
  						break;
  					case'score':
  						map.score.push(value);
  						break;
  					case'domain':
  						map.domain.push(value);
  						break;
  					default:

  				}

        })

      }else{
        reject(error);
      }
  });
});

function sortedData(revers, obj){
	var mass = [];
	function csvFormat(delimiter, mass){
		var csvContent = "data:text/csv;charset=utf-8 \n";
		mass.forEach((itemMass, index)=>{
			dataString = itemMass.join(delimiter);
			csvContent += index < mass.length ? dataString+"\n":dataString;
		});
		return csvContent;

	}
	for (var i = 0; i < map.id.length; i++) {
		mass[i] = [map.id[i], map.title[i], new Date(map.created_utc[i]*1000).toLocaleFormat('%d.%m.%y %H:%M:%S'), map.score[i]];
	}
	console.log(csvFormat(",", mass.sort((a, b)=>{
		if(revers){

			if (a[3] > b[3]) {
				return 1;
			}else if(a[3] < b[3]) {
				return -1;
			}else {
				return 0;
			}
		}else {
			if (a[3] > b[3]) {
				return -1;
			}else if(a[3] < b[3]) {
				return 1;
			}else {
				return 0;
			}
		}

	})));
}
function agregation(revers, obj){
	function csvFormat(delimiter, mass){
		var csvContent = "data:text/csv;charset=utf-8 \n";
		mass.forEach((itemMass, index)=>{
			dataString = itemMass.join(delimiter);
			csvContent += index < mass.length ? dataString+"\n":dataString;
		});
		return csvContent;

	}

	let arrDomain = map.domain.slice(0);

	let arraySet = [];

	for (var i = 0; i < map.id.length; i++) {
		let count = 0;
		let countScore = 0;
		for (var j = 0; j < arrDomain.length; j++) {
			if(arrDomain[j] === map.domain[i]){
				count++;
				countScore += map.score[j];
				arraySet[i] = [arrDomain[j], count, countScore];
				arrDomain[j] = null;
		  }
		}



	}

	console.log(csvFormat(",", arraySet.sort((a, b)=>{
		if(revers){

			if (a[1] > b[1]) {
				return 1;
			}else if(a[1] < b[1]) {
				return -1;
			}else {
				return 0;
			}
		}else {
			if (a[1] > b[1]) {
				return -1;
			}else if(a[1] < b[1]) {
				return 1;
			}else {
				return 0;
			}
		}

	})));
}
promise.then((data)=>{
    addDb('maps','SQL', data, 'Sorting', ',', 'id', 'title', 'dateee', 'score').then((result)=>{
    console.log(result);
  },(err)=>{
    console.log(err);
  });

},(error)=>{
  console.log(error);
});

