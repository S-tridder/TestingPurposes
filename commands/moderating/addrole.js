const errors = require("../../utils/errors.js");  //get errors file (check out errors file before looking at commands)
//Point of command: An easy way to add a role to a specified user
//Command Syntax: $addrole <user> <role-name>
const second = require("../../utils/othererrors.js");
module.exports = {
    config: {
        name: "addrole",
        aliases: ["roleadd"],
        usage: "$addrole <user>",
        description: "Add a role to someone",
        permissions: "manage roles"
    },
    run: async (bot, message, args) => {
        if (message.channel.type == "dm") return message.channel.send("This command only works in a server!");
        if(!message.member.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return errors.noPerms(message, "MANAGE_ROLES");
        //if(!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return errors.lack(message.channel, "MANAGE_ROLES");
        //if author of command does not have required perms to run command, return with errors function noPerms()
        //if bot lack required perms, return with errors function lack()
        let cmd = message.content.split(" ")[0];
        if (args[0] == "help") return message.channel.send(`Command Syntax: ${cmd} (user) <role-name>`);

        let rMember = message.mentions.members.first() || message.guild.members.find(m => m.user.tag === args[0]) || message.guild.members.get(args[0]);
        if(!rMember) return errors.cantfindUser(message.channel);
        //if specified user not found return with errors function cantfindUser()
        if (rMember.id === bot.user.id) return errors.botuser(message, "add a role to");
        let role = message.guild.roles.find(r => r.name == args[1]) || message.guild.roles.find(r => r.id == args[1]) || message.mentions.roles.first();
        if(!role) return errors.noRole(message.channel);
        //if role does not exist return with errors function noRole()

        if(rMember.roles.has(role.id)) {
            return message.channel.send(`**${rMember.displayName} already has that role!**`)
        } else {
            try {
                await rMember.addRole(role.id);
                message.channel.send(`**The role, ${role.name}, has been added to ${rMember.displayName}.**`); //if successful this message
            } catch(e) {
                let id = second.getError(e.message);
                message.channel.send(`Unfortunately an error occurred. Error ID: ${id}`);
            }
        }
    }
}
