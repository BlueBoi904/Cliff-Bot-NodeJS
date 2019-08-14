// Load discord module and connect
const { loginInfo } = require("./ignoreFolder/loginInfo");
const { API } = require("./ignoreFolder/coinbaseApi");
const { StockAPI } = require("./ignoreFolder/marketDataApi");
const stockdata = require("stock-data.js");
const { fortunes } = require("./util/data");
const Discord = require("discord.js");
const client = new Discord.Client();
const { Translate } = require("@google-cloud/translate");
require("dotenv").config();

//Initilize cloud translate API
const projectId = "discord-bot-1565788851899";
const translate = new Translate({ projectId });

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

  switch (primaryCommand) {
    case "help":
      helpCommand(commandArgs, recievedMessage);
      break;
    case "multiply":
      multiplyCommand(commandArgs, recievedMessage);
      break;
    case "fortune":
      fortuneCommand(recievedMessage);
      break;
    case "bitcoin":
      bitcoinCommand(commandArgs, recievedMessage);
      break;
    case "stocks":
      stocksPriceCommand(recievedMessage);
      break;
    case "stock":
      stockPriceCommand(commandArgs, recievedMessage);
      break;
    case "commands":
      commandList(recievedMessage);
      break;
    case "ping":
      pongCommand(recievedMessage);
      break;
    case "translate":
      translateCommand(commandArgs, recievedMessage);
      break;
    case "languages":
      languagesCommand(recievedMessage);
      break;
    default:
      recievedMessage.channel.send(
        "Unknow command. Try `!commands` for a list of commands"
      );
  }

  // if (primaryCommand == "help") {
  //   helpCommand(commandArgs, recievedMessage);
  // } else if (primaryCommand == "multiply") {
  //   multiplyCommand(commandArgs, recievedMessage);
  // } else if (primaryCommand == "fortune") {
  //   fortuneCommand(commandArgs, recievedMessage);
  // } else if (primaryCommand == "bitcoin") {
  //   bitcoinCommand(commandArgs, recievedMessage);
  // } else if (primaryCommand == "stocks") {
  //   stocksPriceCommand(recievedMessage);
  // } else if (primaryCommand == "stock") {
  //   stockPriceCommand(commandArgs, recievedMessage);
  // } else if (primaryCommand == "commands") {
  //   commandList(commandArgs, recievedMessage);
  // } else {
  //   recievedMessage.channel.send(
  //     "Unknow command. Try `!commands` for a list of commands"
  //   );
  // }
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
  } else if (args[0] === "stock" || args[0] === "stocks") {
    recievedMessage.channel.send(
      `It looks like you need help with ${
        args[0]
      }.\n\nSimply type '!stock' follwed by the stock symbol you want more information about.\n\nEx '!stock AMD'`
    );
  }
}
//Command ideas

//Fortune cookie command
function fortuneCommand(recievedMessage) {
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
        `Here are some of the top stocks right now:\n${res.data[0].symbol} - $${
          res.data[0].price
        }\n${res.data[1].symbol} - $${res.data[1].price}\n${
          res.data[2].symbol
        } - $${res.data[2].price}\n${res.data[3].symbol} - $${
          res.data[3].price
        }\n${res.data[4].symbol} - $${res.data[4].price} `
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
  let symbol = args[0];
  if (symbol) {
    stockdata
      .realtime({
        symbols: symbol,
        API_TOKEN: StockAPI
      })
      .then(res => {
        recievedMessage.channel.send(
          `Name: ${res.data[0].name}\nTicker: ${
            res.data[0].symbol
          }\nCurrent Price: $${res.data[0].price}`
        );
      })
      .catch(err => {
        recievedMessage.channel.send(
          "There was an error processing your data.\n\nPlease check you entered the stock symbol correctly and try again."
        );
      });
  } else {
    recievedMessage.channel.send(
      'Make sure you enter the stock symbol after the "!stock" command.\n\nExample: "!stock AMD".\n\nPlease check the formatting was corrent and try again.'
    );
  }
}

function commandList(recievedMessage) {
  // Display full command list for user to expore
  let commandList = "Here is a list of commands you can try:";
  const commands = [
    "!help",
    "!multiply",
    "!bitcoin",
    "!fortune",
    "!stock",
    "!stocks",
    "!ping"
  ];
  for (let i = 0; i < commands.length; i++) {
    commandList += `\n${commands[i]}`;
  }

  recievedMessage.channel.send(commandList);
}

function pongCommand(recievedMessage) {
  recievedMessage.channel.send("Pong");
}

async function translateCommand(args, recievedMessage) {
  //Check if the user imput correct arguments
  // The text to translate
  if (args.length === 0) {
    recievedMessage.channel.send(
      `Please type the language code of the language you would like to translate to, followed by the text.\n\nExample: '!translate ko hello world => Translation: 안녕하세요 월드\n\nFor a list of language codes supported, visit: https://cloud.google.com/translate/docs/languages`
    );
    // The target language
  } else {
    const target = args[0].toLowerCase();
    const textArr = args.slice(1);
    const text = textArr.join(" ");
    for (let i = 0; i < args.length; i++) {}

    const [translation] = await translate.translate(text, target);
    recievedMessage.channel.send(`Translation: ${translation}`);
  }

  // Translates some text into target language

  //If not, ask them to enter correctly showing them an example
}

function languagesCommand(recievedMessage) {
  recievedMessage.channel.send(
    "https://cloud.google.com/translate/docs/languages"
  );
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
