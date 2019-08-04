// Load discord module and connect
const { loginInfo } = require("./ignoreFolder/loginInfo");
const { API } = require("./ignoreFolder/coinbaseApi");
const { StockAPI } = require("./ignoreFolder/marketDataApi");
const stockdata = require("stock-data.js");
const { fortunes } = require("./util/data");
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
  } else if (primaryCommand == "stocks") {
    stocksPriceCommand(recievedMessage);
  } else if (primaryCommand == "stock") {
    stockPriceCommand(commandArgs, recievedMessage);
  } else if (primaryCommand == "commands") {
    commandList(commandArgs, recievedMessage);
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
  let randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];

  recievedMessage.channel.send(randomFortune);
}
//Bitcoin price
// API KEY
function bitcoinCommand(args, recievedMessage) {
  //Tell the user the current price of bitcoin
  //Fetch bitcoin price api
  var Client = require("coinbase").Client;

  var client = new Client({
    apiKey: API.API,
    apiSecret: API.APISECRET,
    version: "YYYY-MM-DD"
  });

  let currencyCode; // can also use EUR, CAD, etc.
  if (args[0] === "EUR") {
    currencyCode = "EUR";
  } else if (args[0] === "JPY") {
    currencyCode = "JPY";
  } else if (args[0] === "CAD") {
    currencyCode = "CAD";
  } else {
    currencyCode = "USD";
  }

  // Make the request
  client.getSpotPrice({ currency: currencyCode }, function(err, price) {
    recievedMessage.channel.send(
      "Current bitcoin price in " + currencyCode + ": $" + price.data.amount
    );
  });
  //Return in the proper format
}

//User does stock command followed by ticker
function stocksPriceCommand(recievedMessage) {
  stockdata
    .realtime({
      symbols: ["AAPL", "MSFT", "TSLA", "AMZN", "GOOGL"],
      API_TOKEN: StockAPI
    })
    .then(res => {
      recievedMessage.channel.send(
        `Here are some of the top stocks right now: \n ${
          res.data[0].symbol
        } - $${res.data[0].price} \n ${res.data[1].symbol} - $${
          res.data[1].price
        } \n ${res.data[2].symbol} - $${res.data[2].price} \n ${
          res.data[3].symbol
        } - $${res.data[3].price} \n ${res.data[4].symbol} - $${
          res.data[4].price
        } `
      );
    })
    .catch(err => {
      recievedMessage.channel.send(
        "There was an error processing your data. Please check the stock symbol was corrent and try again."
      );
    });
}
function stockPriceCommand(args, recievedMessage) {
  //Check if user sends a ticker
}

function commandList(args, recievedMessage) {
  // Display full command list for user to expore
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
