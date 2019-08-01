// Load discord module and connect
const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
  console.log("Connected as " + client.user.tag);
  // After connecting, update bots status to show it's currently playing a game
  client.user.setActivity("with Javascript");

  client.guilds.forEach(guild => {
    console.log(guild.name);
    guild.channels.forEach(channel => {
      console.log(` - ${channel.name} ${channel.type} ${channel.id}`);
    });
    // General channel id: 216246550253273089
  });
});

client.login("NjA2NDgzNTUwNDE3NDUzMDY2.XULxog.qRzZEQOhpmpY1yj8a94s1Fo2nGs");
// Bot is now online
