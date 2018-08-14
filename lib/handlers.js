let handlers = {

};
let _data = require('./data');

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
    let tosAgreement = typeof(data.payload.tosAgreement)=='boolean'?data.payload.tosAgreement:false;
    if(firstName&&lastName&&phone&&password&&tosAgreement){
        _data.read('user',phone,(err,data=>{
            if(err){

            }else{
                
            }
        }))
    }else{
        callback(400,{'Error':'Missing required field'})
    }
    
}
//USER - GET
handlers._user.get = function(data,callback){

}
//USER - PUT
handlers._user.put = function(data,callback){

}
//USER - DELETE
handlers._user.delete = function(data,callback){

}


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
}

module.exports = handlers;