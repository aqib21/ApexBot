const requests = require('requests');
const Discord = require('discord.js');

module.exports = {
    name: "map",
    description: "Map rotations",
    execute(message, args) {
        let url =  `https://api.mozambiquehe.re/maprotation?auth=${process.env.APEX_TOKEN}`;
        requests(url)
        .on('data', chunk => {
            let data = JSON.parse(chunk);
            if(data.Error) return message.channel.send(data.Error);

            let embed = new Discord.MessageEmbed()
                .setTitle(`${data.current.map}`)
                .setColor('BLACK')
                .setImage(data.current.asset)
                .addField("Start Time", `${data.current.readableDate_start}`,true)
                .addField("End Time", `${data.current.readableDate_end}`,true)
                .addField("Remaining Timer", `${data.current.remainingTimer}`,true)
                .setFooter({text: `Next map: ${data.next.map}`})
            message.channel.send({embeds: [embed]});
        })
        .on('end', (err)=> {
            if (err) {
                message.channel.send("Error Occurred, check logs.");
                return console.log('connection closed due to errors', err);
            }
        });
    }
}