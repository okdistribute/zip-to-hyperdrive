var test = require('tape')
var hyperdrive = require('hyperdrive')
var memdb = require('memdb')
var concat = require('concat-stream')
var yazl = require('yazl')
var BufferList = require('bl')
var hyperzip = require('./')

test('get zip from url with multiple files', function (t) {
  var zipfile = new yazl.ZipFile()
  zipfile.addBuffer(new Buffer("hello contents"), "hello", {
    mtime: new Date(),
    mode: parseInt("0100664", 8), // -rw-rw-r--
  })

  zipfile.addBuffer(new Buffer("world contents"), "world", {
    mtime: new Date(),
    mode: parseInt("0100664", 8), // -rw-rw-r--
  })

  zipfile.end()
  var drive = hyperdrive(memdb())
  var archive = drive.createArchive()
  zipfile.outputStream.pipe(new BufferList(function (err, data) {
    t.ifError(err, 'no error')
    hyperzip(data, archive, done)
  }))

  var files = {}

  var listStream = archive.list()
  listStream.on('data', function (entry) {
    files[entry.name] = 1
    var stream = archive.createFileReadStream(entry)
    stream.on('data', function (data) {
      t.same(data.toString(), entry.name + ' contents', 'file should contain correct contents')
    })
  })
  function done (err) {
    t.ifError(err, 'no error')
    t.end()
  }
})
