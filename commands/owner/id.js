const { ownerid } = require("../../botconfig.json");
module.exports = {
    config: {
        name: "id",
    },
    run: async (bot, message, args) => {
        if (message.author.id != ownerid) return;
        if (message.channel.type == "dm") return message.channel.send("This command only works in a server!");
        let ided = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!ided) return message.channel.send("User not found.");
        return message.channel.send(ided.id);
    }
}