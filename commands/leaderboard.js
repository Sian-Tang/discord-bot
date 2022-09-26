const { currency } = require('../main.js');
const { Users, CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');
const { GuildMember } = require('discord.js');

module.exports = {
    name: 'leaderboard',
    description: "shows leaderboard of credit score",
    execute(message,client){


        // var he = currency.sort((a, b) => b.balance - a.balance)
        //     .filter(user => client.users.cache.has(user.user_id))
        //     .first(10);

        // const targetUser = he[0];
        // const roleName = '💰 King / Queen';
        // const { guild } = message;

        // const role = guild.roles.cache.find((role) => {
        //     return role.name === roleName;
        // });
        // const member2 = guild.roles.cache.get('846029288720302111').members.map(m => m.user);
        // console.log(member2);

        // if( message.member.roles.cache.some(role => role.name === roleName )){

        //     member2.map((m) => {
        //         guild.members.cache.get(m.id).roles.remove(role);
        //     });
        //     const member = guild.members.cache.get(targetUser.user_id);
        //     member.roles.add(role);
        // }
        
        // let allowedRole = message.guild.roles.find("", '846029288720302111');
        
        return message.channel.send(

            currency.sort((a, b) => b.balance - a.balance)
                .filter(user => client.users.cache.has(user.user_id))
                .first(10)
                /*  */
                .map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.user_id).tag)}: ${user.balance}💰`)
                /* add next line after every person */
                .join('\n'),
            { code: true },
        );
        
    }
}
