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
        let stringData = JSON.stringify(data);

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
            console.log(err);
            callback('Could not create new file!');
        }
    });
};

lib.read = function(dir,file,callback){
    fs.readFile(lib.baseDir + dir + '/'+file+'.json','utf8',function(err,data){
        callback(err,data);
    })
};



lib.update = function(dir,file,data,callback){
    fs.open(lib.baseDir+dir+"/"+file+".json",'r+',(err,fd)=>{
        if(!err && fd){
            let stringData = JSON.stringify(data);
            fs.writeFile(fd,stringData,(err)=>{
                if(err){
                    callback(err)
                }else{
                    fs.close(fd,(err)=>{
                        if(err){
                            callback(err);
                        }else{
                            callback(false);
                        }
                    });
                }
            })
        }else{
            callback(err)
        }
    });
};

lib.delete = function(dir,file,callback){
    fs.unlink(lib.baseDir+dir+'/'+file+'.json',(err)=>{
        if(err){
            callback(err);
        }else{
            callback(false);
        }
    })
}


module.exports = lib;