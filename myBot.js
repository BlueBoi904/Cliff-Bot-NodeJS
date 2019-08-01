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
  // Write "Hello World " to general channel or send attachment
  let generalChannel = client.channels.get("216246550253273089");
  const attachment = new Discord.Attachment(
    "https://ssl.quiksilver.com/static/QS/default/category-assets/marketing-landing/landing/build/img/surf/tiles/surf_featured_1.jpg"
  );
  generalChannel.send(attachment);
});

client.login("NjA2NDgzNTUwNDE3NDUzMDY2.XUL1hw.oCKYxuBkWFc-ybfvaOEfXOO2rgk");
// Bot is now online
