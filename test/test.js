var fs = require('fs')
  , scriptInjector = require('../lib/script-injector');

fs.createReadStream('./index.html')
  .pipe(scriptInjector(someCode))
  .pipe(process.stdout);

function someCode () {
  console.log("I'm some code to be inserted inline");
}