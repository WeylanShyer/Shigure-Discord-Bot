const Discord = require('discord.js');
const stripIndents = require('common-tags/lib/stripIndent')
const moment = require('moment');
require('moment-duration-format');

exports.run = (client, message) => {

	let target = message.guild.member(message.mentions.users.first() || message.author)
	var roles = target.roles.filter(r => r.id !== message.guild.id).map(r => r).join('\n ') || "brak";

	var userInfo = new Discord.RichEmbed()
	.setAuthor(message.author.tag, message.author.displayAvatarURL)
	.setThumbnail(target.user.avatarURL)
	.setFooter(message.guild.name, message.guild.iconURL)
	.setColor(target.displayHexColor === '#000000' ? '#ffffff' : target.displayHexColor)

	if(target.roles.size < 20) {
		userInfo.addField('Informacje o członkostwie', stripIndents`**Wyświetlana nazwa:** ${target.displayName}
		**Aktualny status:** ${target.presence.status}
		**Dołączono dnia:** ${moment.utc(message.guild.members.get(target.id).user.joinedAt).format('dddd, MMMM Do, YYYY')}
		**Posiadane rangi/role:**\n ${roles}`, true);
	} else {
		userInfo.addField('Informacje o członkostwie', stripIndents`**Wyświetlana nazwa:** ${target.displayName}
		**Aktualny status:** ${target.presence.status}
		**Dołączono dnia:** ${moment.utc(message.guild.members.get(target.id).user.joinedAt).format('dddd, MMMM Do, YYYY')}
		**Ilość posiadanych roli:** ${target.roles.size}`, true);
	}

	userInfo.addField('Informacje o użytkowniku', stripIndents`**ID:** ${target.id}
	**Nazwa:** ${target.user.username}
	**Discord tag:** ${target.user.discriminator}
	**Konto utworzono dnia:** ${moment.utc(message.guild.members.get(target.id).user.createdAt).format('dddd, MMMM Do, YYYY')}`, true)

	if(target.user.presence.game && target.user.presence.game.name != 'Custom Status') {
		userInfo.addField('Aktualnie w grze', target.user.presence.game.name);
	}

	userInfo.setTimestamp()

	try {
		message.channel.send(userInfo);
	} catch(cInfoError) {
		console.error(`[BŁĄD] (user-info.js, 43) Nie udało się wysłać listy z informacjami o użytkowniku. Powód: ${cInfoError}`);
	}
}



exports.info = {
	name: 'user-info',
	description: 'Wysyła informacje na temat wspomnianego użytkownika. Jeśli nikogo nie spingujesz to domyślnie wyświetli informacje o Tobie.',
	usage: 'user-info [@mention.member]',
	example: 'user-info @forkus#0039',
	category: 'inne'
}