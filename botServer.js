const Discord = require('discord.js');
const client = new Discord.Client();
const clientID = require('./config.json').clientID
let axios = require('axios')
const apexAPIURL = "https://public-api.tracker.gg/apex/v1/standard/profile/5/"
client.on('ready', () => {
  console.log('I am ready!');
});
const headers = {
  'Content-Type': 'application/json',
  'TRN-Api-Key': '832bc712-b0b1-46dd-a1b0-0e2a78c72ca5',
};
// message.reply('pong');
client.on('message', message => {
  if (message.content === 'ping') {
    message.reply('pong');
  }
  if (message.content.startsWith("!apex")) {
    let username =message.content.split(" ")[1]
    if(username){
    let url = apexAPIURL + username
    axios.get(url, { headers })
      .then((response) => {
        console.log(response.data)
        let data = response.data.data;
        let statsFields =[];
        for(let stat of data.children[0].stats){
          let field = {};
          field.name = stat.metadata.name
          field.value = stat.value + " percentile: " + stat.percentile + "%";
          statsFields.push(field)
        }
        message.channel.send({
          embed: {
            color: 3447003,
            author: {
              name: data.metadata.platformUserHandle,
              icon_url: data.children[0].metadata.icon
            },
            title: data.metadata.platformUserHandle,
            description: "Here are some statistics about your character PC ONLY. The lower the percentile the better",
            fields: [{
              name: "Level",
              value: data.metadata.level
            },
            {
              name: "Character",
              value: data.children[0].metadata.legend_name
            }, ...statsFields
            ],
            timestamp: new Date(),
          }
        })
      
      })
      .catch((err) => {
        console.log(err)
        message.channel.send(username + " was not found...")
      })
    }

  }
});

client.login(clientID);

