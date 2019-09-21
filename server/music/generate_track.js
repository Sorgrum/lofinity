var generate_midi = require("./generate_midi.js");
var generate_mp3 = require("./generate_mp3.js");

module.exports = function() {
  console.log("Generating new track");

  const generate = () => {
    try {
      generate_midi();
      generate_mp3();
    } catch (err) {
      console.log(err);
      console.log("trying again");
      generate();
    }
  };
  generate();
};
