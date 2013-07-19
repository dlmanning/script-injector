var trumpet = require('trumpet')
  , through = require('through');

function scriptInjector (script) {
  var tr = trumpet()
    , needToAddScript = true;

  script = script ? '<script type=\"text/javascript\">\n;(' + script + ')()\n<\/script>\n'
                  : ';(' + "function () { console.log('You didn\'t provide a script to inject') }" + ')()';

  firstScriptTag = tr.createStream('script', { outer: true });
  bodyTag = tr.createStream('body');

  firstScriptTag // Inject the new script before the first existing <script>
    .pipe(through(
      function (data) {
        if (needToAddScript) {
          this.queue(script);
          needToAddScript = false;
        }
        this.queue(data);
      }))
    .pipe(firstScriptTag);

  bodyTag // If there were no <script>'s, insert the script right before </body>
    .pipe(through(
      null,
      function () {
        if (needToAddScript) {
          this.queue(script);
        }
        this.queue(null);
      }))
    .pipe(bodyTag);

  return tr;
}

module.exports = scriptInjector;