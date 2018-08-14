let handlers = {

};
const randomString = require('randomstring');
let _data = require('./data');
let helpers = require('./helpers');
handlers.users = function(data,callback){
    let acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._user[data.method](data,callback);
    }else{
        callback(405);
    }
};  
// Container for the users submethods
handlers._user = {};
//USER - POST
handlers._user.post = function(data,callback){
// Data : firstName, lastName,phone, password, tosAgreement
    let firstName = data.payload.firstName?data.payload.firstName.trim():false;
    let lastName = data.payload.lastName?data.payload.lastName.trim():false;
    let phone = data.payload.phone?data.payload.phone.trim():false;
    let password = data.payload.password?data.payload.password.trim():false;
    let ticked = typeof(data.payload.ticked)==='boolean'?data.payload.ticked:false;
    if(firstName && lastName && phone && password && ticked){
        _data.read('users',phone,(err)=>{
            if(!err){
                callback(500,{'Error':'User already existed'})
            }else{
                let hashedPassword = helpers.hash(password);
                let userObject = {
                    firstName:firstName,
                    lastName:lastName,
                    phone:phone,
                    hashedPassword:hashedPassword
                };
                _data.create('users',phone,userObject,(err)=>{
                   if(err){
                       callback(500,{'Error':'Could not create new user - system error'});
                   } else{
                       callback(200,{'Success':'success create new user'})
                   }
                });

            }
        });

    }else{
        callback(400,{'Error' : 'Missing required fields'});
    }
    
};
//USER - GET
handlers._user.get = function(data,callback){
    let query = data.query?data.query:false;
    let file = query.q?query.q:false;
    console.log(file);
    if(!file){
        console.log("Query error");
        callback(400,{'Error':'Syntax not found'});
    }else{
        _data.read('users',file,(err,data)=>{
            if(err){
                callback(400,{'Error':'Could not read user'});
            }else{
                data = JSON.parse(data);
                delete data.hashedPassword;
                callback(200,data);
            }
        })
    }
};
//USER - PUT
handlers._user.put = function(data,callback){
    let firstName = data.payload.firstName?data.payload.firstName.trim():false;
    let lastName = data.payload.lastName?data.payload.lastName.trim():false;
    let phone = data.payload.phone?data.payload.phone.trim():false;
    let password = data.payload.password?data.payload.password.trim():false;
    if(!phone){
        callback(400,{'Error':'Missing User phone'});
    }else{
        _data.read('users',phone,(err,userObject)=>{
            if (err){
                callback(404,{'Error':'User not found'});
            } else {
                userObject = JSON.parse(userObject);
                if(firstName){
                    userObject.firstName = firstName;
                }
                if(lastName){
                    userObject.lastName = lastName;
                }
                if (password){
                    userObject.hashedPassword = helpers.hash(password);
                }
                _data.update('users',phone,userObject,(err)=>{
                    if(err){
                        callback(500,{'Error':'Could not update user'});
                    }else {
                        callback(200,{'Success':'Success'});
                    }
                })
            }
        });

    }
};
//USER - DELETE
handlers._user.delete = function(data,callback){
    let query = data.query?data.query:false;
    let file = query.q?query.q:false;
    console.log(file);
    if(!file){
        console.log("Query error");
        callback(400,{'Error':'Syntax not found'});
    }else{
        _data.delete('users',file,(err)=>{
            if(err){
                callback(400,{'Error':'Could not read user'});
            }else{
                callback(200,{'Success':'Deleted!'});
            }
        })
    }
};

handlers.tokens = function (data, callback) {
    let acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for tokens
handlers._tokens = {};
//TOKEN-GET
handlers._tokens.get = (data, callback) => {
};
//tokens POST
handlers._tokens.post = (data, callback) => {
    let phone = data.payload.phone ? data.payload.phone.trim() : false;
    let password = data.payload.password ? data.payload.password.trim() : false;
    if (phone && password) {
        _data.read('users', phone, (err, userData) => {
            if (!err && userData) {
                userData = JSON.parse(userData);
                let hashedPassword = helpers.hash(password);
                if (hashedPassword === userData.hashedPassword) {
                    let tokenId = randomString.generate(20);
                    let expires = Date.now() + 1000 * 60 * 60;
                    let tokenObject = {
                        'phone': phone,
                        'id': tokenId,
                        'expires': expires
                    };
                    _data.create('tokens', tokenId, tokenObject, (err) => {
                        if (err) {
                            callback(500, {'Error': 'Could not generate new token'})
                        } else {
                            callback(200, tokenObject)
                        }
                    })
                } else {
                    callback(400, {'Error': 'Password incorrect!'})
                }
            } else {
                callback(400, {'Error': 'Could not find user data'});
            }
        })
    } else {
        callback(400, {'Error': 'Missing credential'})
    }
};



handlers.notFound= function(data,callback){
    callback(404);
};
handlers.greeting = function (data,callback) {
    callback(406,{'message':'hello'});
};
handlers.ping = (data,callback)=>{
    callback(200)
};
handlers.jso = (data,callback)=>{
    callback(200,{"json":"no content"})
};

module.exports = handlers;