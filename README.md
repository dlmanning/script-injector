#script-injector

1. provides a Transform stream that allows you to inject inline javascript into an html text stream.
2. Uses Stream.Transform, but shims in [`readable-stream`](https://github.com/isaacs/readable-stream) if you're on node 0.8
3. Should only be used for good, never for evil

## Installation

`npm install script-injector`


## How to use

Just pipe a stream of html through script-injector. You can pass in either some stringified or a function object. What could be easier?

```javascript
scriptInjector = require('script-injector);

\\ Then do something like this somewhere else

fs.createReadStream('anHTMLFile')
  .pipe(scriptInjector(aFunction))
  .pipe(someOtherPlace);
```

`script-injector` will insert the provided code *before* your first script tags, or just before `</body>` if you don't have any other scripts.