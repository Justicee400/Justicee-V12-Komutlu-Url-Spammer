const Discord = require('discord.js');
const client = new Discord.Client()
const moment = require("moment-timezone");
const fetch = require('node-fetch');
const cfg = require("./config.json");

client.on("ready", async () => {
    client.user.setActivity(cfg.status)
    console.log("Hadi url çalak aq")
})

class Justicee {
    constructor() {
        this.justiceeInterval;
    }

    async setVanityURL(url, guild) {
        const time = moment.tz(Date.now(), "Europe/Istanbul").format("HH:mm:ss");
        console.log(`[${time}] [${url}] bunu almayı denioz `);
        return await fetch(`https://discord.com/api/v8/guilds/${guild.id}/vanity-url`, {
            "credentials": "include",
            "headers": {
                "accept": "*/*",
                "authorization": "Bot " + client.token,
                "content-type": "application/json",
            },
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": JSON.stringify({
                "code": url
            }),
            "method": "PATCH",
            "mode": "cors"
        });
    }
    async checkVanityURL(url) {
        return await fetch(`https://discord.com/api/v8/guilds/${guild.id}/vanity-url`, {
            "credentials": "include",
            "headers": {
                "accept": "*/*",
                "authorization": "Bot " + client.token,
                "content-type": "application/json",
            },
            "referrerPolicy": "no-referrer-when-downgrade",
            "method": "GET",
            "mode": "cors"
        });
    }

    async startURL(url, guild) {
        this.justiceeInterval = setInterval(async () => {
            await this.setVanityURL(url, guild);
        }, 1*10000);
    }

    stopURL() {
        return clearInterval(this.justiceeInterval);
    }
}

let sex = new Justicee();

client.on('message', async (message) => {
     let messageArray = message.content.split(" ")
     const args = messageArray.slice(1);
     const args1 = message.content.slice(cfg.prefix.length).split(/ +/)
     const command = args1.shift().toLowerCase();

    if (command === "al") {
        if(!cfg.owner.includes(message.author.id)) return

        let url = args[0];
        if(!url) return message.channel.send(`Olm hangi urlyi alıcam aq?`)

        if (!message.guild.features.includes('VANITY_URL')) {
            return message.channel.send("x");
        }

        message.channel.send(` **${url}** bunu deniyorum`);

        console.log(`Çalmaya çalıştığım url discord.gg/${url}`);
        await sex.startURL(url, message.guild);
    } if (command === "duramk") {
        if(!cfg.owner.includes(message.author.id)) return

        sex.stopURL();

        message.channel.send(`Hop kapandım aq`)

        console.log(`Durdum amk`)
    } if (command === "ping") {
        if(!cfg.owner.includes(message.author.id)) return

    message.channel.send(`Pingim **${client.ws.ping}**`)
    };
});

client.login(cfg.token).then(x => console.log("Aktifiz aq")).catch(e => console.error("Token çalındı koş 2 dk res at urller çalınmasın"))
