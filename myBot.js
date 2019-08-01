// Load discord module and connect
const { loginInfo } = require("./ignoreFolder/loginInfo");
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
  // Write "Hello World " to general channel or send attachment on bot startup
  let generalChannel = client.channels.get("216246550253273089");
  //   const attachment = new Discord.Attachment(
  //     "https://ssl.quiksilver.com/static/QS/default/category-assets/marketing-landing/landing/build/img/surf/tiles/surf_featured_1.jpg"
  //   );
  //   generalChannel.send("Sup guys, i'm a bot!");
});

client.on("message", recievedMessage => {
  if (recievedMessage.author == client.user) {
    return;
  }
  //   recievedMessage.channel.send(
  //     "Message recieved, : " +
  //       recievedMessage.author.toString() +
  //       ": " +
  //       recievedMessage.content
  //   );
  //   recievedMessage.react("552556099077931018");

  if (recievedMessage.content.startsWith("!")) {
    processCommand(recievedMessage);
  }
});

function processCommand(recievedMessage) {
  let fullCommand = recievedMessage.content.substr(1);
  let splitCommand = fullCommand.split(" ");
  let primaryCommand = splitCommand[0];
  let commandArgs = splitCommand.slice(1);

  if (primaryCommand == "help") {
    helpCommand(commandArgs, recievedMessage);
  } else if (primaryCommand == "multiply") {
    multiplyCommand(commandArgs, recievedMessage);
  } else {
    recievedMessage.channel.send("Unknow command. Try `!help` or `!multiply`");
  }
}

function multiplyCommand(args, recievedMessage) {
  if (args.length < 2) {
    recievedMessage.channel.send("Not enough arguments. Try `!multiply 2 10`");
    return;
  }
  let product = 1;
  args.forEach(val => {
    product *= parseFloat(val);
  });
  recievedMessage.channel.send(
    "The product of  " + args + " is " + product.toString()
  );
}

function helpCommand(args, recievedMessage) {
  if (args.length === 0) {
    recievedMessage.channel.send(
      "I'm not sure what you need help with. Try `!help [topic]`"
    );
  } else {
    recievedMessage.channel.send("It looks like you need help with " + args);
  }
}
//Command ideas
//Fortune cookie command

//Bitcoin price

//Weather takes zipcode, returns local weather
client.login(loginInfo);
// Bot is now online
