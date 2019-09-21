var express = require("express");
var app = express();
var server = require("http").Server(app);
var fs = require("fs");
var io = require("socket.io")(server);
var mp3Duration = require("mp3-duration");
var temporal = require("temporal");
var generate_track = require("./music/generate_track.js");

app.use(express.static(`${__dirname}/html`));

server.listen(8000, function() {
  console.log('Listening at "/song" on port 8000\n');
});

var files = fs
  .readdirSync("./music/tracks/")
  .filter(item => item.split(".").pop() === "mp3" && item !== "drums.mp3")
  .reverse();

function loop(res, previous, second_prev) {
  console.log(res.socket._readableState.ended);
  if (res.socket._readableState.ended) {
    return;
  }

  // Generate a track so there is always a track to be played.
  generate_track();

  // If there was a track that was just played, we don't
  // need to keep the file around anymore, so delete it.
  if (second_prev !== null) {
    try {
      fs.unlink("./music/tracks" + second_prev, () => {
        console.log("Deleting " + second_prev);
      });
    } catch (err) {
      console.log("Couldn't delete " + second_prev);
      console.log(err);
      console.log();
    }
  }

  var current = files.shift();

  if (current === undefined) {
    files = fs
      .readdirSync("./music/tracks/")
      .filter(item => item.split(".").pop() === "mp3" && item !== "drums.mp3")
      .reverse();
    current = files.shift();
  }

  var filename = __dirname + "/music/tracks/" + current;
  var stream = fs.createReadStream(filename);

  mp3Duration(filename, function(err, duration) {
    if (err) return console.log(err.message);

    stream.pipe(res, { end: false, highWaterMark: 1024 * 1024 * 1024 });
    console.log(
      "Playing: " +
        current +
        "\tWaiting\t" +
        parseInt(duration * 1000 * 0.75) +
        " before playing next track"
    );

    temporal.delay(parseInt(duration * 1000 * 0.75), function() {
      console.log("going to next song");
      loop(res, current, previous);
    });
  });
}

app.get("/song", function(req, res) {
  console.log("Got request for song");
  res.setHeader("content-type", "audio/mpeg");
  loop(res, null, null);
});
