// Load discord module and connect
const { loginInfo } = require("./ignoreFolder/loginInfo");
const { API } = require("./ignoreFolder/coinbaseApi");
const { StockAPI } = require("./ignoreFolder/marketDataApi");
const { capitalizeFirstLetter } = require("./util/capitalize");
const stockdata = require("stock-data.js");
const { fortunes } = require("./util/data");
const { animalFacts } = require("./util/animalData");
const Discord = require("discord.js");
const client = new Discord.Client();
const { Translate } = require("@google-cloud/translate");
const fetch = require("node-fetch");
const axios = require("axios");
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
  const botCommandChannel = client.channels.get("581132581664194560");
  botCommandChannel.send("Sup guys, i'm ready!");
});

client.on("message", recievedMessage => {
  if (recievedMessage.author == client.user) {
    return;
  }
  // recievedMessage.channel.send(
  //   "Message recieved, : " +
  //     recievedMessage.author.toString() +
  //     ": " +
  //     recievedMessage.content
  // );
  // recievedMessage.react("552556099077931018");

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
    case "dogs":
      dogsCommand(commandArgs, recievedMessage);
      break;
    case "meme":
      memeCommand(recievedMessage);
      break;
    case "animalfact":
      animalFactCommand(recievedMessage);
      break;
    case "panda":
      pandaCommand(recievedMessage);
      break;
    case "chat":
      chatCommand(commandArgs, recievedMessage);
      break;
    case "server":
      serverCommand(recievedMessage);
      break;
    case "lyrics":
      lyricsCommand(commandArgs, recievedMessage);
      break;
    case "pokemon":
      pokemonCommand(commandArgs, recievedMessage);
      break;
    default:
      recievedMessage.channel.send(
        "Unknow command. Try `!commands` for a list of commands"
      );
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
  } else if (args[0] === "stock" || args[0] === "stocks") {
    recievedMessage.channel.send(
      `It looks like you need help with ${
        args[0]
      }.\n\nSimply type '!stock' follwed by the stock symbol you want more information about.\n\nEx '!stock AMD'`
    );
  } else if (
    args[0] === "translate" ||
    args[0] === "translation" ||
    args[0] === "language"
  ) {
    recievedMessage.channel.send(
      ` It looks like you need help with the !translate command.\n\nPlease type the language code of the language you would like to translate to, followed by the text.\n\nExample: '!translate ko hello world' => Translation: 안녕하세요 월드\n\nFor a list of language codes supported, visit: https://cloud.google.com/translate/docs/languages`
    );
  } else if (args[0] === "dogs" || args[0] === "dog") {
    recievedMessage.channel.send(
      ` It looks like you need help with the !dogs command.\n\nPlease type the '!dogs' command followed by the breed of dog you like most!\n\nExample: '!dogs boxer'`
    );
  } else if (args[0] === "chat") {
    recievedMessage.channel.send(
      " It looks like you need help with the !dogs command.\n\nExample: `!chat How are you?`"
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
  const Client = require("coinbase").Client;

  const client = new Client({
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
      symbols: ["AMD", "MSFT", "F", "AMZN", "GOOGL"],
      API_TOKEN: StockAPI
    })
    .then(res => {
      recievedMessage.channel.send(
        `Here are some of the top stocks right now:\n${res.data[0].symbol} - $${res.data[0].price}\n${res.data[1].symbol} - $${res.data[1].price}\n${res.data[2].symbol} - $${res.data[2].price}\n${res.data[3].symbol} - $${res.data[3].price}\n${res.data[4].symbol} - $${res.data[4].price} `
      );
    })
    .catch(() => {
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
          `Name: ${res.data[0].name}\nTicker: ${res.data[0].symbol}\nCurrent Price: $${res.data[0].price}`
        );
      })
      .catch(() => {
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
    "!ping",
    "!translate",
    "!languages",
    "!dogs",
    "!animalfact",
    "!panda",
    "!meme",
    "chat",
    "server",
    "pokemon"
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

    const [translation] = await translate
      .translate(text, target)
      .catch(err =>
        recievedMessage.channel.send(
          'Uh oh, looks like there was an error with your input format.\n\nMake sure you properly formatted your input like so\n\nExample: "!translate ko hello world" => Translation: 안녕하세요 월드\n\nFor a list of language codes supported, visit: https://cloud.google.com/translate/docs/languages'
        )
      );
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
function dogsCommand(args, recievedMessage) {
  if (args.length === 0) {
    fetch("https://dog.ceo/api/breeds/image/random")
      .then(res => {
        return res.json();
      })
      .then(data => {
        const webAttachment = new Discord.Attachment(data.message);
        recievedMessage.channel.send(webAttachment);
      })
      .catch(() => {
        recievedMessage.channel.send("Oops, something went wrong...");
      });
  } else if (args[0]) {
    const breed = args[0];
    // for (let i = 0; i < args.length; i++) {
    //   breed += args[i];
    // }
    // breed = breed.replace(/\s/g, "").trim();
    fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
      .then(res => res.json())
      .then(data => {
        const webAttachment = new Discord.Attachment(data.message);
        recievedMessage.channel.send(webAttachment);
      })
      .catch(() => {
        recievedMessage.channel.send(
          "Oops, something went wrong... Please make sure you entered the breed name correctly\n\nExample '!dogs boxer'\n\n Sub breeds are not supported... i.e golden retriever"
        );
      });
  }
}

function memeCommand(recievedMessage) {
  fetch("https://some-random-api.ml/meme")
    .then(res => {
      return res.json();
    })
    .then(data => {
      const webAttachment = new Discord.Attachment(data.image);
      recievedMessage.channel.send(webAttachment);
    })
    .catch(() => {
      recievedMessage.channel.send("Oops, something went wrong...");
    });
}

function animalFactCommand(recievedMessage) {
  const randomFactEndpoint =
    animalFacts[Math.floor(Math.random() * animalFacts.length)];

  fetch(randomFactEndpoint)
    .then(res => {
      return res.json();
    })
    .then(data => {
      recievedMessage.channel.send(data.fact);
    })
    .catch(() => {
      recievedMessage.channel.send("Oops, something went wrong...");
    });
}

function pandaCommand(recievedMessage) {
  const pandaEndpoints = [
    "https://some-random-api.ml/img/red_panda",
    "https://some-random-api.ml/img/panda"
  ];
  const randomPandaEndpoint =
    pandaEndpoints[Math.floor(Math.random() * pandaEndpoints.length)];
  fetch(randomPandaEndpoint)
    .then(res => {
      return res.json();
    })
    .then(data => {
      const webAttachment = new Discord.Attachment(data.link);
      recievedMessage.channel.send(webAttachment);
    })
    .catch(() => {
      recievedMessage.channel.send("Oops, looks like something went wrong");
    });
}
function chatCommand(args, recievedMessage) {
  if (args.length > 0) {
    let userMessage = "";
    for (let i = 0; i < args.length; i++) {
      userMessage += args[i];
    }
    axios
      .get("https://some-random-api.ml/chatbot", {
        params: {
          message: userMessage
        }
      })
      .then(res => {
        recievedMessage.channel.send(res.data.response);
      })
      .catch(() => {
        recievedMessage.channel.send("Oops, looks like something went wrong.");
      });
  } else {
    recievedMessage.channel.send(
      "Make sure you send a message to chat after the command.\n\nExample: `!chat How are you?`"
    );
  }
}

function serverCommand(recievedMessage) {
  recievedMessage.channel.send(
    `Server name: ${recievedMessage.guild.name}\n\nTotal members: ${recievedMessage.guild.memberCount}`
  );
}

function lyricsCommand(args, recievedMessage) {
  if (args.length > 0) {
    let userMessage = "";
    for (let i = 0; i < args.length; i++) {
      userMessage += args[i];
    }
    userMessage = userMessage.split("").join(" ");

    axios
      .get("https://some-random-api.ml/lyrics", {
        params: {
          title: userMessage
        }
      })
      .then(res => {
        recievedMessage.channel.send(
          `Title: ${res.data.title}\nArtist: ${res.data.author}\nLink: ${res.data.links.genius}`
        );
      })
      .catch(() => {
        recievedMessage.channel.send("Oops, looks like something went wrong.");
      });
  }
}

function pokemonCommand(args, recievedMessage) {
  if (args.length > 0) {
    axios
      .get("https://some-random-api.ml/pokedex", {
        params: {
          pokemon: args[0]
        }
      })
      .then(res => {
        let abilities = "";
        if (res.data.abilities.length > 0) {
          for (let i = 0; i < res.data.abilities.length; i++) {
            abilities += `${res.data.abilities[i]}, `;
          }
        }
        let evolutions = "";
        if (res.data.family.evolutionLine.length > 1) {
          for (let i = 0; i < res.data.family.evolutionLine.length; i++) {
            evolutions += `${res.data.family.evolutionLine[i]}, `;
          }
        }

        let name = capitalizeFirstLetter(res.data.name);

        recievedMessage.channel.send(
          `Pokemon: ${name}\n\nType: ${res.data.type[0]}\n\nDescription: ${
            res.data.description
          }\n\nAbilities: ${abilities}\n\nEvolutions: ${evolutions}`
        );

        const webAttachment = new Discord.Attachment(res.data.sprites.animated);
        recievedMessage.channel.send(webAttachment);
      })
      .catch(() => {
        recievedMessage.channel.send(
          "Oops, looks like something went wrong...\n\nMake sure you send the name of a Pokemon to search the pokedex.\n\nExample: `!pokemon pikachu`"
        );
      });
  } else {
    recievedMessage.channel.send(
      "Make sure you send the name of a Pokemon to search the pokedex.\n\nExample: `!pokemon pikachu`"
    );
  }
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
