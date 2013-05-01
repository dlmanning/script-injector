module.exports = ScriptInjectorStream;

var fs = require('fs')
  , Transform = require('stream').Transform;

if(!Transform) { // shim for node 0.8
  Transform = require('readable-stream/transform');
}

var hp = require('htmlparser2');

function ScriptInjectorStream(script, options) {
  var self = this;
  if(!(self instanceof ScriptInjectorStream)) {
    return new ScriptInjectorStream(script, options);
  }

  Transform.call(self, options);

  self._script = script ? script.toString()
                        : ';(' + function () { console.log("You didn't provide a script to inject") } + ')()';
  self.needToAddScript = true;
  self.htmlParser = new hp.Parser({
    onprocessinginstruction: function (name, data) {
      self.push('<' + data + '>');
    },
    onopentag: function (name, attribs) {
      var output = '';
      if(name === 'script' && self.needToAddScript) {
        self.needToAddScript = false;
        output += '<script type=\"text/javascript\">\n;(' + self._script + ')()\n<\/script>\n';
      }
      output += '<' + name;
      for(var key in attribs) {
        output += ' ' + key + '=\"' + attribs[key] + '\"';
      }
      output += '>';
      self.push(output);
    },
    ontext: function (text) {
      self.push(text);
    },
    onclosetag: function (name) {
      if(name === 'body' && self.needToAddScript) {
        self.needToAddScript = false;
        self.push('<script type=\"text/javascript\">\n;(' + self._script + ')()\n<\/script>\n')
      }
      self.push('<\/' + name + '>');
    }
  });

  self.on('end', function () { self.htmlParser.parseComplete() });

}

ScriptInjectorStream.prototype = Object.create(
  Transform.prototype, { constructor: { value: ScriptInjectorStream }});

ScriptInjectorStream.prototype._transform = function(chunk, encoding, done) {
  this.htmlParser.write(chunk);
  done();
}