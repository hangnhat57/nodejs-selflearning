# Node JS 
## Build API 


- Using url.parse() to get url information

- url.parse with second parameter is true would get url query string as an object 

- url.parse.pathname will get url path
- To get payload from request, use Decoder ( string_decoder, image .. ) to decoder data from event 'data' of request ` req.on('data',(data)=>{})`
 
 - Payload will be read fully after event data, then we write response in event `end`

 - To run on multiple environments, use this command `NODE_ENV=environmennt node file.js`

 
