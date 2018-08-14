const http = require('http');
const https = require('https');
const url = require('url');
const StrignDecoder = require('string_decoder').StringDecoder;
let config = require('./config');
const  fs = require('fs');
var _data = require('./lib/data');
var handlerss = require('./lib/handlers');

_data.delete('dir','newfile',function (err) {
    if(err){
    console.log("Error is "+err);
    }else{
    console.log("deleted!");
    }
});

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
    'greeting':handlerss.greeting,
    'ping':handlerss.ping,
    'jso':handlerss.jso
};



// Start server HTTP:

httpServer.listen(config.httpPort,()=>{
    console.log(`Server started at ${config.httpPort} on ${config.envName}`)
});

httpsServer.listen(config.httpsPost,()=>{
    console.log(`Server started at ${config.httpsPost} on ${config.envName}`)
});




// Server logic :
let unifiedServer = function (req,res) {
    let urlParse = url.parse(req.url,true);
    let pathName = urlParse.pathname.replace(/^\/+|\/=$/g,'');
    let queryString = urlParse.query;
    let requestHeaders = urlParse.headers;
    let buffer = '';
    req.on("data",(data)=>{
        buffer += new StrignDecoder('utf-8').write(data);
    });

    req.on("end",()=>{
        let data = {
            'path':pathName,
            'query':queryString,
            'headers':requestHeaders,
            'payload':buffer
        };

        let choosen = router[pathName]?router[pathName]:handlerss.notFound;
        choosen(data,(statusCode,object='')=>{
            statusCode = statusCode?statusCode:404;
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.write(`Path name is : ${data.path}`);
            res.write(`
            Query is : ${JSON.stringify(data.query)}`);
            res.write(`
            Payload is : ${data.payload}
            `);
            object?res.write(JSON.stringify(object)):'';
        });

        console.log(data);
    });
};