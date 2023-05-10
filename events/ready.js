const { useMasterPlayer } = require("discord-player");
const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    await useMasterPlayer().extractors.loadDefault();
  },
};
