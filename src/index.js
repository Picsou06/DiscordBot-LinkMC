const { ShewenyClient } = require("sheweny");
const config = require("../config.json");

const client = new ShewenyClient({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
  managers: {
    commands: {
      directory: "./commands",
      autoRegisterApplicationCommands: true,
      prefix: "!",
    },
    events: {
      directory: "./events",
    },
    buttons: {
      directory: "./interactions/buttons",
    },
    selectMenus: {
      directory: "./interactions/selectmenus",
    },
  },
  mode : "development", // Change to production for production bot
});

client.login(config.DISCORD_TOKEN);
