var yauzl = require('yauzl')

module.exports = function (zipfile, archive, done) {
  if (!done) done = function () {}
  if (zipfile.readEntry) {
    convert(null, zipfile)
  } else if (zipfile instanceof Buffer) {
    yauzl.fromBuffer(zipfile, {lazyEntries: true}, convert)
  } else {
    yauzl.open(zipfile, {lazyEntries: true}, convert)
  }

  function convert (err, zipfile) {
    if (err) return done(err)
    zipfile.readEntry()
    zipfile.on('entry', function (entry) {
      if (/\/$/.test(entry.fileName)) return zipfile.readEntry() // directory
      zipfile.openReadStream(entry, function (err, readStream) {
        if (err) return done(err)
        var writeStream = archive.createFileWriteStream(entry.fileName)
        readStream.pipe(writeStream)
        readStream.on('end', function() {
          zipfile.readEntry()
          writeStream.end()
        })
      })
    })
    zipfile.on('end', done)
    zipfile.on('error', done)
  }
}
