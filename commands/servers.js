const requests = require('requests');

module.exports = {
    name: "servers",
    description: "Current server status",
    execute(message, args) {
        let url =  `https://api.mozambiquehe.re/servers?auth=${process.env.APEX_TOKEN}`;
        requests(url)
        .on('data', chunk => {
            let data = JSON.parse(chunk);
            if(data.Error) return message.channel.send(data.Error);

            let msg = '';

            for (const region in data) {
                if(region === 'EA_novafusion' || region === 'selfCoreTest') continue;
                msg += `${region.replace('_',' ').toUpperCase()}\n`;
                for (const key in data[region]) {
                    msg += `\t${key}: ${data[region][key].Status} ${data[region][key].ResponseTime ? '| Response Time - ' + data[region][key].ResponseTime : ''}\n`;
                }
            }

            message.channel.send('```' + msg + '```');
        })
        .on('end', (err)=> {
            if (err) {
                message.channel.send("Error Occurred, check logs.");
                return console.log('connection closed due to errors', err);
            }
        });
    }
}