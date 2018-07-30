
// Dependencies
const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder;
const port = 3000;

// Server should response all to all request to http string
const server = http.createServer(((req,res)=>{
    //Get time request from client
    let time =  new Date();
    // Get the url and parse
    var parseUrl = url.parse(req.url,true);
    // Get path of url
    var pathName = parseUrl.pathname.replace(/^\/+|\/=$/g,'');
    // Get method of request
    var method = req.method.toUpperCase();
    // Get query string
    var queryString = parseUrl.query;
    // Get request header 
    var reqHeader = req.headers;
    //Send respone
    
    
    //Get the payload 
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data',(data)=>{
        buffer += decoder.write(data)
    })
    req.on('end',()=>{
        buffer += decoder.end();
        //Log request
        console.log(`${time}: User sent a request for ${pathName} with method: ${method}`)
        console.log(queryString)
        console.log("buffer is "+buffer)
        res.end("Hello \n")
    })
    

    //console.log(reqHeader)
}));
server.listen(port,()=>{
    let time =  new Date();
    console.log(`${time} - Server is started at port ${port}`)
    });

