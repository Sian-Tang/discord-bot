const Discord = require('discord.js');

const fs = require('fs');
const client = new Discord.Client();
const { Users, CurrencyShop } = require('./dbObjects');
const { Op } = require('sequelize');
// const { config } = require('node:process');
const currency = new Discord.Collection();
const PREFIX = '!';
const login = require('./token.js');

// [alpha]
Reflect.defineProperty(currency, 'add', {
	/* eslint-disable-next-line func-name-matching */
	value: async function add(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(currency, 'getBalance', {
	/* eslint-disable-next-line func-name-matching */
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
});

Reflect.defineProperty(currency, 'remove', {
	value: async function remove(id, amount) {
		const user = currency.get(id);
		if(user){
			user.balance += Number(amount);
			return user.save();
		}
		const NewUser = await Users.create({ user_id: id, balance: amount});
		currency.set(id, newUser);
		return NewUser;
	},
});

module.exports = { currency }


// Discord commands
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
// iterates all files

for(const file of commandFiles){
	// does something idk
	const command = require(`./commands/${file}`);

	// does something idk
	client.commands.set(command.name, command);
}

// starts bot
client.once('ready', async () => {
	// [beta]
    const storedBalances = await Users.findAll();
    storedBalances.forEach(b => currency.set(b.user_id, b));
	console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', async message => {
	/* If bot types, nothing happens */
	if (message.author.bot) return;

	/* only able to text through coding-chat channel */
	//if (message.channel.id !== '838113712605757440') return;


	// if(!message.content.startsWith(PREFIX)){
	// 		/* Sian + Marcel gain 100 credits per message */
	// 	if(message.author.id === '285408802096939008'  || message.author.id === '526199220898889758' ){
	// 		currency.add(message.author.id, 0);
	// 		/* Adlige gain 2 credits per message */
	// 	} else if(message.member.roles.cache.has('838118207083511869')){
	// 		currency.add(message.author.id, 10);
	// 		/* Everyone else only get 1 credit per message */
	// 	} else {
	// 		currency.add(message.author.id, 5);
	//	}
	//}

	/* If no prefix -> return nothing */
	if (!message.content.startsWith('/')) return console.log(`received message. ${message.content}`);
	const [a,command ,commandArgs] = message.content.slice(PREFIX.length).trim().match(/(\w+)\s*([\s\S]*)/);
	// message.channel.send(`${a}, ${b}, \n${message.content.slice(PREFIX.length).trim().match(/(\w+)\s*([\s\S]*)/)}`);
	const args = message.content.slice(PREFIX.length).trim().split(/ +/);
	if (!args.length) return;

	if(message.author.id === '285408802096939008'){
		if(command === 'prune'){
			client.commands.get('prune').execute(message,commandArgs);
		}
	}

	/* games can only be played in tne-casino */
	if(message.channel.id === '838121340119547936'){

		switch(command){
			case 'munzwurf':
				client.commands.get('munzwurf').execute(message,commandArgs);
				break;
			case 'cupgame':
				client.commands.get('cupgame').execute(message,commandArgs);
				break;
			case 'pickpocket':
				client.commands.get('pickpocket').execute(message,commandArgs);
				break;
			case 'balance':
				client.commands.get('balance').execute(message);
				break;
			default:
				//message.channel.send(`${message.author}, du hast Dan-Bilzerian umgebracht!!`);
		}

	} else if (message.channel.id === '840985717517844500'){

		switch(command){
			case 'math':
				client.commands.get('math').execute(message,commandArgs);
				break;
			case 'balance':
				client.commands.get('balance').execute(message);
				break;
			default:
		}

	} else {

		switch(command){
			/* currency commands */
			case 'balance':
				client.commands.get('balance').execute(message);
				break;
			case 'inventory':
				client.commands.get('inventory').execute(message);
				break;
			case 'transfer':
				client.commands.get('transfer').execute(message,commandArgs);
				break;
			case 'buy':
				client.commands.get('buy').execute(message,commandArgs);
				break;
			case 'shop':
				client.commands.get('shop').execute(message);
				break;
			case 'leaderboard':
				client.commands.get('leaderboard').execute(message,client);
				break;
			case 'sell':
				client.commands.get('sell').execute(message,commandArgs);
				break;
			default:
				//message.channel.send(`${message.author}, du hast Dan-Bilzerian umgebracht!!`);
		}
	}



});



client.login(login.token());

/*
	Kommandos: balance, inventory, transfer, buy, shop, leaderboard, sell
*/
