const { currency } = require('../app.js');
const münze = require('./games/munzwurf.json');
const Discord = require('discord.js');
const gif = new Discord.MessageEmbed().setImage('https://media.giphy.com/media/afYKFBzlCLx8rmqzFM/giphy.gif');

const all = ["Kopf","Zahl"];

function sleep (time){
    return new Promise((resolve) => setTimeout(resolve,time));
}

module.exports = {
    name: 'munzwurf',
    description: "flip a coin",
    execute(message,args){

        /* get balance of user */
        const currentAmount = currency.getBalance(message.author.id);
        /* get amount, if valid, from args */
        const betAmount = args.split(/ +/g).find(arg => !/<@!?\d+>/g.test(arg));
        
        

        /* check if bet argument is valid */
        if (!betAmount || isNaN(betAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
        /* check if user has enough credit */
        if (betAmount > currentAmount) return message.channel.send(`Sorry ${message.author}, you only have ${currentAmount}.`);
        /* check if negative bet argument was passed */
        if (betAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);

        /* lösung.event is result */
        /* lösung.all is list of all events */
        const lösung = münze[Math.floor(Math.random() * münze.length)];
        const bet = args.split(/ +/g);

        if(bet[1] === undefined) return message.channel.send(`Ungültige Eingabe.\n${message.author}, versuch es mal mit: \`!münzwurf\` \`50\` \`Zahl\` - oder \`Kopf\``);

        if( !(all.some(element => element.toLowerCase() === bet[1].toLowerCase())) ){
            return message.channel.send(`Ungültige Eingabe.\n${message.author}, versuch es mal mit: \`!münzwurf\` \`50\` \`Zahl\` - oder \`Kopf\``);
        }

        /* sending gif */
        message.channel.send(gif);
        
        /* 5sec delay */
        sleep(3200).then(() => {
            /* delete gif after 5 sec */
            message.channel.bulkDelete(1);
            /* show results */
            sleep(500).then(() => {
                message.channel.send(`${lösung}!`);
            });
            sleep(2000).then(() => {
                if(bet[1].toLowerCase() === lösung.toLowerCase()){
                    currency.add(message.author.id, Math.round(betAmount));
                    return message.channel.send(`${message.author}, du hast ${Math.round(betAmount)}💰 gewonnen!`);
                } else {
                    currency.add(message.author.id, -betAmount);
                    return message.channel.send(`${message.author}, du hast leider deinen Wetteinsatz verloren!`);
                }
            });
        });
    }
}