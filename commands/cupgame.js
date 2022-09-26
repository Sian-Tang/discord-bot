const { currency } = require('../app.js');
const cup = require('./games/cupgame.json');   
const Discord = require('discord.js');
const gif = new Discord.MessageEmbed().setImage('https://media.giphy.com/media/3kzvP0mWv2rGYTJUdz/giphy.gif');

const all = ["Cup1", "1", "Cup2", "2", "Cup3", "3"];

function sleep (time){
    return new Promise((resolve) => setTimeout(resolve,time));
}

module.exports = {
    name: 'cupgame',
    description: "guess where the ball is under 3 cups",
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
        const lösung = cup[Math.floor(Math.random() * cup.length)];
        const bet = args.split(/ +/g);
        if( !(all.some(element => element.toLowerCase() === bet[1].toLowerCase())) ){
            return message.channel.send(`Ungültige Eingabe.\n${message.author}, versuch es mal mit: \`!cupgame\` \`50\` \`Cup3\` - oder \`Cup1/2\``);
        }

        /* sending gif */
        message.channel.send(gif);
        
        /* 5sec delay */
        sleep(2000).then(() => {
            /* delete gif after 5 sec */
            message.channel.bulkDelete(1);
            /* show results */
            sleep(500).then(() => {
                message.channel.send(`${lösung}!`);
            });
            sleep(1500).then(() => {
                if(bet[1].toLowerCase() === lösung.toLowerCase()){
                    currency.add(message.author.id, Math.round(2*betAmount));
                    return message.channel.send(`${message.author}, du hast ${Math.round(2*betAmount)}💰 gewonnen!`);
                } else {
                    currency.add(message.author.id, -betAmount);
                    return message.channel.send(`${message.author}, du hast leider deinen Wetteinsatz verloren!`);
                }
            });
        });
    }
}