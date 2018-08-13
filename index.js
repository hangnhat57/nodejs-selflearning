
// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const port = 3000;

// Server should response all to all request to http string
const server = http.createServer(((req,res)=>{
    //Get time request from client
    let time =  new Date();
    // Get the url and parse
    let parseUrl = url.parse(req.url,true);
    // Get path of url
    let pathName = parseUrl.pathname.replace(/^\/+|\/=$/g,'');
    // Get method of request
    let method = req.method.toUpperCase();
    // Get query string
    let queryString = parseUrl.query;
    // Get request header 
    let reqHeader = req.headers;
    //Send respone
    
    
    //Get the payload 
    let decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data',(data)=>{
        buffer += decoder.write(data)
    });
    req.on('end',()=>{
        buffer += decoder.end();
        let data = {
            'pathName' : pathName,
            'query':queryString,
            'headers':reqHeader,
            'payload':buffer
        };
        let choooseHandler = router[pathName]?router[pathName]:handlers.notFound;
        choooseHandler(data,(statusCode="",payload)=>{
            statusCode = typeof (statusCode) === 'number'?statusCode:200;
            payload = payload?payload:{};
            let payloadString = JSON.stringify(payload);
            let head = JSON.stringify(data.headers);
            res.writeHead(statusCode);
            res.write(head);
            res.write(`
            ${data.payload}`)
            res.end(`
            ${payloadString}`)
        });
        //Log request
        console.log(`${time}: User sent a request for ${pathName} with method: ${method}`);
        console.log(queryString);
        console.log("buffer is "+buffer);

    })
    

    //console.log(reqHeader)
}));
server.listen(port,()=>{
    let time =  new Date();
    console.log(`${time} - Server is started at port ${port}`)
});

var handlers = {};
handlers.notFound = function(data,callback){
    callback(404);
};
handlers.sample = function (data,callback) {
    callback(406,{'name':'sample handler'});
};
handlers.hello  = function (data,callback) {
    callback("",{'name':'chomeo'})
};

let router ={
    'sample':handlers.sample,
    'hello':handlers.hello
};

