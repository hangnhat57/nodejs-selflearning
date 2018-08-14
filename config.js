// Container for all envs


let environments = {};


// Create staging env

environments.staging ={
    'httpPort' :3000,
    'httpsPort':3001,
    'envName':'staging',
    'keySecret':'daylamatma'
};



// Create prod env

environments.production ={
    'httpPort':5000,
    'httpsPort':5001,
    'envName':'production',
    'keySecret':'daylamatma'
};

let currentEnvironment = process.env.NODE_ENV?process.env.NODE_ENV.toLowerCase():'';
let environmentToExport = environments[currentEnvironment]? environments[currentEnvironment]:environments.staging;

module.exports = environmentToExport;

