var helpers={};
const config = require('./../config');
const crypto = require('crypto');
helpers.hash = (str)=>{
    var hash = crypto.createHmac('sha256', config.keySecret).update(str).digest('hex');
    console.log(hash);
    return hash;
};

helpers.bufferToObject = (str)=>{
    try{
        return JSON.parse(str);
    }catch (e) {
        return false;
    }
};




module.exports = helpers;