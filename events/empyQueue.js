const { useMasterPlayer } = require("discord-player");
const player = useMasterPlayer();
const { ActivityType } = require("discord.js");

module.exports = player.events.on("emptyQueue", (queue) => {
  try {
    // Emitted when the player queue has finished
    player.client.user.setActivity(`to nothing`, {
      type: ActivityType.Listening,
    });
    queue.metadata.channel.send("Queue finished 😽!");
  } catch (error) {
    console.log(error);
  }
});
