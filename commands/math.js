const { currency } = require('../main.js');
const Discord = require('discord.js');
const symb = ['+','-','*'];
const t = 5;
var n = 0;
var gain = 0;
var date;

module.exports = {
    name: 'math',
    description: 'generate random math equation to solve',
    execute(message,args){

        /* assign mult depending on author role */
        if (message.author.id === '285408802096939008' || message.author.id === '526199220898889758'){
            var mult = 1.5;
        } else if (message.member.roles.cache.has('838118207083511869')){
            var mult = 1.5;
        } else {
            var mult = 1;
        }

        /* get argument value */
        var dif = args.split(/ +/g).find(arg => !/<@!?\d+>/g.test(arg) );

        if(!dif || isNaN(dif) || dif <= 1){
            n = 3 + 1;
        } else if(dif >= 50) {
            n = 50 + 1;
        } else {
            n = parseInt(dif) + 1;
        }

        var gain = new Array(n);
        var variable = new Array(n);
        var op = new Array(n);
        var count = 0;

        var equ_string = "";

        for(i = 0; i < n; i++){
            variable[i] = Math.floor(Math.random() * 15 ) + 1;

            if(i !== n) op[i] = symb[ Math.floor( Math.random() * 3) ];
            if(op[i] === '*'){
                count++; 
            } 
            if(i === 0){

                gain = 6;
                equ_string = "" + `${variable[i]}`;

            } else {
    
                gain = gain * 2;
                equ_string = equ_string + ' ' + op[i-1] + ` ${variable[i]}`;

            }
            
        }

        const filter = m => {
            return (m.author.id === message.author.id && parseInt(m.content) === parseInt(eval(equ_string)) );
        }

        var calc_time = t*(2*count+n);
        if( calc_time >= 90){
            calc_time = 90;
        }

        if( gain >= 200 ){
            gain = 200;
        }

        
        message.channel.send('Kannst du diese Aufgabe lösen? Du hast ' + `**${calc_time}**` + ' **Sekunden**');
        date = new Date();
        message.channel.send(`${message.author}: ` + equ_string ).then(() => {
            message.channel.awaitMessages(filter, {max: 1, time: (calc_time*1000), errors: ['time'] })
                .then(collected => {
                    let time = Math.floor((new Date() - date)/1000);
                    currency.add(message.author.id, gain*mult);
                    message.channel.send(`Richtig! Die Antwort lautet: **${eval(equ_string)}**; deine Zeit: **${time} Sekunden**!\n${message.author}, du hast **${gain*mult}**💰 bekommen!`);
                })
                .catch(collected => {
                    message.channel.send(`${message.author}, scheinbar hast du es nicht in Zeit geschafft. Die richtige Lösung lautete: **${eval(equ_string)}**`);
                });
        }); 

    }
}
