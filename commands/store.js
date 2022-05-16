const requests = require('requests');
const Discord = require('discord.js');

module.exports = {
    name: "store",
    description: "Current store rotation",
    execute(message, args) {
        let url =  `https://api.mozambiquehe.re/store?auth=${process.env.APEX_TOKEN}`;
        requests(url)
        .on('data', chunk => {
            let data = JSON.parse(chunk);
            if(data.Error) return message.channel.send(data.Error);
            
            let embeds = [];

            data.forEach(item => {
                let expiry = new Date(item.expireTimestamp * 1000).toLocaleString('en-GB');
                let contents = [];

                for (const content of item.content) {
                    let c = content.ref.split('_').slice(0,2).join(' ').toUpperCase();
                    contents.push(c);
                }
                
                let embed = new Discord.MessageEmbed()
                .setTitle(`${item.title}`)
                .setColor('BLACK')
                .setFooter({text: `Expires on: ${expiry}`})
                .addField(contents[0] ? contents[0] : '\u200B', contents[0] ? item.content[0].name : '\u200B', true)
                .addField(contents[1] ? contents[1] : '\u200B', contents[1] ? item.content[1].name : '\u200B', true)
                .addField(contents[2] ? contents[2] : '\u200B', contents[2] ? item.content[2].name : '\u200B', true)
                .addField(item.pricing[0] ? item.pricing[0].ref : '\u200B', item.pricing[0] ? `${item.pricing[0].quantity}` : '\u200B', true)
                .addField(item.pricing[1] ? item.pricing[1].ref : '\u200B', item.pricing[1] ? `${item.pricing[1].quantity}` : '\u200B', true)
                .setImage(`${item.asset}`)
                embeds.push(embed)
            });
            
            message.channel.send({embeds: embeds});
        })
        .on('end', (err)=> {
            if (err) {
                message.channel.send("Error Occurred, check logs.");
                return console.log('connection closed due to errors', err);
            }
        });
    }
}