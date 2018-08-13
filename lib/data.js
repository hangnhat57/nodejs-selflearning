const fs = require('fs');
const path = require('path');


var lib ={};

//Base dir of the data folder
lib.baseDir = path.join(__dirname,'/.././data/');

// Write data to a file
lib.create = function(dir,file,data,callback){
    //Open the file for writing

    fs.open(lib.baseDir+'dir'+"/"+file+'.json','wx',function(err,fileDescriptor){
        if(!err && fileDescriptor){
        //Convert data to string
        var stringData = JSON.stringify(data);

        //Write to file and close
        fs.writeFile(fileDescriptor,stringData,function(err){
            if(!err){
                fs.close(fileDescriptor,function(err){
                    if(!err){
                        callback(false);
                    }else{
                        callback('Error closing new file');
                    }
                })
            }else{
                callback('Error writing new file!');
            }
        })
        }else{
            callback('Could not create new file!');
        }
    });
};

lib.read = function(dir,file,callback){
    fs.readFile(lib.baseDir + dir + '/'+file+'.json','utf8',function(err,data){
        callback(err,data);
    })
};



module.exports = lib;