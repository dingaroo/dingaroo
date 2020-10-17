 /*
  * create and export configuration variables
  * to start: 
  * $ NODE_ENV=staging node index.js
  *  - or -
  * $ NODE_ENV=production node index.js
  *
  */

 var environments = {};

// staging (default) environment
 environments.staging = {
    'port' : 3000,
    'envName' : 'staging'
 };


 // production environment
 environments.production = {
    'port' : 5000,
    'envName' : 'production'
 };

 // determine which environment was passed as a command-line argument
 var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

 // checkthat the current environment is one of the environments above. if not, default ot staging
 var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

 // export the module
 module.exports = environmentToExport;