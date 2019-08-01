// Load discord module and connect
const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
  console.log("Connected as " + client.user.tag);
});

client.login("NjA2NDgzNTUwNDE3NDUzMDY2.XULuKg.7VTfHhR3lftMRkRW2nzO2MmaImM");
// Bot is now online
