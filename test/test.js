var fs = require('fs')
  , scriptInjector = require('../index');

fs.createReadStream('./index.html')
  .pipe(scriptInjector(someCode))
  .pipe(process.stdout);

function someCode () {
  console.log("I'm some code to be inserted inline");
}