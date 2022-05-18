require('dotenv').config()
const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const prefix = process.env.PREFIX
const fs = require('fs');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("Dropping hot", {
        type: "STREAMING",
        url: "https://www.youtube.com/watch?v=XG1Y3ywb8ms"
    });
})

client.on('messageCreate', async message =>{
    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    switch(command){
        case 'map':
            client.commands.get('map').execute(message, args);
            break;
        case 'player':
            client.commands.get('player').execute(message, args);
            break;
        case 'craft':
        case 'crafting':
            client.commands.get('craft').execute(message, args);
            break;
        case 'store':
            client.commands.get('store').execute(message, args);
            break;
        case 'news':
            client.commands.get('news').execute(message, args);
            break;
        case 'servers':
            client.commands.get('servers').execute(message, args);
            break;
        case 'chat':
            client.commands.get('chat').execute(message, args);
            break;
        case 'help':
            client.commands.get('help').execute(message, args);
            break;
        default:
            message.channel.send('Invalid command. Type ;help to find out more.');
    }
})

client.login(process.env.DISCORD_TOKEN);