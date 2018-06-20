const HTTP = require("http"),URL = require('url'), HTTPS = require("https");

HTTP.createServer(function(request, response) {
  
	var imgUrl = URL.parse(request.url).query;
	var req = null;
	if(imgUrl.startsWith("http:")){
		req =HTTP.request(imgUrl, function(res){
			response.writeHead(200, {'Access-Control-Allow-Origin': '*'});
			res.on('data', (chunk) => {
				response.write(chunk);
			});
			res.on('end', () => {
				response.end();
			});
		});
	}else{
		req = HTTPS.request(imgUrl, function(res){
			response.writeHead(200, {'Access-Control-Allow-Origin': '*'});
			res.on('data', (chunk) => {
				response.write(chunk);
			});
			res.on('end', () => {
				response.end();
			});
		});
		req.on('error', (e) => {
			console.error(e);
		});
	}
	req.end();

}).listen(8888);
