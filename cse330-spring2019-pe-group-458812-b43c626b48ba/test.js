	let http = require('http');
let app = http.createServer(function(req, res){
	    let loop=10000000;
	    while(loop>0){
	        loop--;
    }
    res.writeHead(200);
    res.end('10000000');
});
app.listen(3456);
