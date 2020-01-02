const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

exports.run = (client, message) => {

	let userStatus = message.guild.members.filter(o => o.presence.status === 'online').size + message.guild.members.filter(o => o.presence.status === 'idle').size + message.guild.members.filter(o => o.presence.status === 'dnd').size + message.guild.members.filter(o => o.presence.status === 'streaming').size;
	let userHumans = message.guild.memberCount - message.guild.members.filter(mem => mem.user.bot === true).size;
	let serverProtection = ['Brak', 'Niski', 'Średni', 'Wysoki', 'Najwyższy'];

	var serverInfo = new Discord.RichEmbed()
	.setAuthor(message.author.tag, message.author.displayAvatarURL)
	.setThumbnail(message.guild.iconURL)
	.setDescription(`**Nazwa serwera:** ${message.guild.name}
	**Guild ID:** ${message.guild.id}
	**Właściciel:** ${message.guild.owner}
	**Region [HOST]:** ${message.guild.region}
	**Dodatkowe Emoji:** ${message.guild.emojis.size}
	**Kanały [tekstowe & głosowe]:** ${message.guild.channels.size}
	**Użytkownicy:** ${message.guild.memberCount} (${userHumans} ludzi i ${message.guild.members.filter(mem => mem.user.bot === true).size} boty)
	**Online:** ${userStatus}\n **Stopień weryfikacji:** ${serverProtection[message.guild.verificationLevel]}
	**Utworzony w dniu:** ${moment.utc(message.guild.createdAt).format('dddd, MMMM Do, YYYY')}`)

	if(message.guild.roles.size < 25) {
		serverInfo.addField(`Lista aktualnie dostępnych roli (${message.guild.roles.size - 1})`, message.guild.roles.map(r => r).join(' ').replace('@everyone', ' ') , false);
	} else {
		serverInfo.addField(`Liczba dostępnych roli`, message.guild.roles.size - 1 , false);
	}

	serverInfo.setTimestamp();
	serverInfo.setColor('RANDOM');

	try {
		message.channel.send(serverInfo);
	} catch(sInfoError) {
		console.error(`[BŁĄD] (server-info.js, 36) Nie udało się wysłać listy z informacjami o serwerze. Powód: ${sInfoError}`);
	}
}



exports.info = {
	name: 'server-info',
	description: 'Wysyła podstawowe informacje na temat serwera na którym się znajduje.',
	usage: 'server-info',
	example: 'server-info',
	category: 'inne'
}