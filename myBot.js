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
  } else if (primaryCommand == "fortune") {
    fortuneCommand(commandArgs, recievedMessage);
  } else if (primaryCommand == "bitcoin") {
    bitcoinCommand(commandArgs, recievedMessage);
  } else if (primaryCommand == "weather") {
    bitcoinCommand(commandArgs, recievedMessage);
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
function fortuneCommand(args, recievedMessage) {
  let fortunes = [
    "The fortune you seek is in another cookie.",
    "A foolish man listens to his heart. A wise man listens to cookies.",
    "An alien of some sort will be appearing to you shortly.",
    "Do not mistake temptation for opportunity.",
    "He who laughs at himself never runs out of things to laugh at.",
    "Some men dream of fortunes, others dream of cookies.",
    "The greatest danger could be your stupidity.",
    "You will be hungry again in one hour.",
    "Because of your melodic nature, the moonlight never misses an appointment.",
    "Help! I am being held prisoner in a fortune cookie factory.",
    "It's about time I got out of that cookie.",
    "Only listen to the fortune cookie; disregard all other fortune telling units.",
    "It is a good day to have a good day.",
    "All fortunes are wrong except this one.",
    "Someone will invite you to a Karaoke party.",
    "That wasn't chicken.",
    "There is no mistake so great as that of being always right.",
    "No snowflake feels responsible in an avalanche.",
    "This cookie contains 117 calories.",
    "You think it's a secret, but they know.",
    "Change is inevitable, except for vending machines.",
    "Don't let statistics do a number on you.",
    "Never forget a friend. Especially if he owes you.",
    "Never wear your best pants when you go to fight for freedom.",
    "You love Chinese food.",
    "I am worth a fortune.",
    "A good way to keep healthy is to eat more Chinese food.",
    "Change can hurt, but it leads a path to something better.",
    "Hidden in a valley beside an open stream- This will be the type of place where you will find your dream.",
    "You learn from your mistakes... You will learn a lot today.",
    "A fanatic is one who can't change his mind, and won't change the subject.",
    "If you look back, you'll soon be going that way.",
    "You will live long enough to open many fortune cookies.",
    "Flattery will go far tonight.",
    "We don't know the future, but here's a cookie."
  ];

  let randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];

  recievedMessage.channel.send(randomFortune);
}
//Bitcoin price
// API KEY
function bitcoinCommand(args, recievedMessage) {
  //Tell the user the current price of bitcoin
  //Fetch bitcoin price api
  //Return in the proper format
}

//Weather takes zipcode, returns local weather
function weatherCommand(args, recievedMessage) {
  //
}

client.login(loginInfo);
// Bot is now online

/*
Server list:
 - general text 216246550253273089
 - General voice 216246550253273090
 - FUCK BRO voice 232257632935608321
 - Overwatch voice 286339889455431681
 - bot_commands text 581132581664194560
*/
