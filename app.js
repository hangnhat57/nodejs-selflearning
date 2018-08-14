const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
let config = require('./config');
const  fs = require('fs');
var handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');


const httpServer = http.createServer((req,res)=>{
    unifiedServer(req,res);
});
// Innit HTTPS server
let httpsServerOptions = {
    'key':fs.readFileSync('./https/key.pem'),
    'cert':fs.readFileSync('./https/cert.pem')
};
const httpsServer = https.createServer(httpsServerOptions,(req,res)=>{

    unifiedServer(req,res);
});



const router ={
    'greeting':handlers.greeting,
    'ping':handlers.ping,
    'jso':handlers.jso,
    'users':handlers.users
};



// Start server HTTP:

httpServer.listen(config.httpPort,()=>{
    console.log(`Server started at ${config.httpPort} on ${config.envName}`)
});

httpsServer.listen(config.httpsPort,()=>{
    console.log(`Server started at ${config.httpsPost} on ${config.envName}`)
});




// Server logic :
let unifiedServer = function (req,res) {
    let urlParse = url.parse(req.url,true);
    let pathName = urlParse.pathname.replace(/^\/+|\/=$/g,'');
    let queryString = urlParse.query;
    let requestHeaders = urlParse.headers;
    let method = req.method.toLowerCase();
    let buffer = '';
    req.on("data",(data)=>{
        buffer += new StringDecoder('utf-8').write(data);
    });

    req.on("end",()=>{
        let data = {
            'path':pathName,
            'query':queryString,
            'headers':requestHeaders,
            'method':method,
            'payload':helpers.bufferToObject(buffer)
        };

        let choosen = router[pathName]?router[pathName]:handlers.notFound;
        choosen(data,(statusCode,object='')=>{
            statusCode = statusCode?statusCode:404;
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            object?res.end(JSON.stringify(object)):res.write('{}');
        });

        console.log(data);
    });
};