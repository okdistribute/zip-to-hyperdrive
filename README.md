# zip-to-hyperdrive

Add files from a zip archive to a hyperdrive archive.

[![Travis](https://api.travis-ci.org/karissa/zip-to-hyperdrive.svg)](https://travis-ci.org/karissa/zip-to-hyperdrive)

```
npm install zip-to-hyperdrive
```

## Example

```js
var hyperzip = require('zip-to-hyperdrive')
var hyperdrive = require('hyperdrive')
var memdb = require('memdb')

var drive = hyperdrive(memdb())
var archive = drive.createArchive()

function done (err) {
  console.log('files added!')
}

hyperzip('/path/to/zipfile.zip', archive, done)
```

## API

#### hyperzip(zipfile, archive, [cb])

Adds files to the given archive. The `cb`  will be called once all files have been read and their contents added to the hyperdrive archive.

`zipfile` can be a path to a file on the local filesystem, a `yauzl` zipfile object, or a Buffer.
