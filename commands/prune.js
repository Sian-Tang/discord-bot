module.exports = {
    name: 'prune',
    description: "this is prune commmand",
    execute(message,args){
    
        if(args.length === 0 || args[0] < 0) return message.channel.bulkDelete(1);
            
        return message.channel.bulkDelete(args[0]);

    }
}