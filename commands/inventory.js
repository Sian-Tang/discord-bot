const { Users, CurrencyShop } = require('../dbObjects');

module.exports = {
    name: 'inventory',
    description: "shows inventory",
    async execute(message){

        /* get target or message author */
        const target = message.mentions.users.first() || message.author;
        const user = await Users.findOne({ where: { user_id: target.id } });
        /* get items in inventory */
        if(user == null){
            return message.channel.send(`${target} is not listed in data base.`);
        } 
        const items = await user.getItems();

        /* target has no items */
		if (!items.length) return message.channel.send(`${target} has nothing!`);

        /* print item list */
		return message.channel.send(`${target} currently has \n\`${items.map(i => `${i.amount} ${i.item.name}`).join('\n')}\``);
        
    }
}



