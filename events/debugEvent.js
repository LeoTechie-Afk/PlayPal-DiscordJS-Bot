// Event only for debug purposes
// Uncomment to debug
const { useMasterPlayer } = require("discord-player");
const { EmbedBuilder } = require("discord.js");

const player = useMasterPlayer();

module.exports = player.events.on("debug", async (queue, message) => {
  // Emitted when the player queue sends debug info
  // Useful for seeing what state the current queue is at
  console.log("DEBUG:" + message + "\n");
});
