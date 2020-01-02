const Discord = require('discord.js');
const { ownerID, prefix, modLogChannel } = require(`../config.js`);

exports.run = (client, message, args, isMod) => {

	//Sprawdzenie czy ranga dla moderatora istnieje
	if(!isMod) return message.channel.send(`:x: Nie znalazłam rangi moderatora o podanym ID. Sprawdź **config.js** i napraw błąd.`);

	// Sprawdzenie czy użytkownik jest właścicielem bota lub moderatorem/administratorem
	// if(message.author.id !== ownerID) return message.channel.send(':lock: Nie posiadasz uprawnień aby użyć tej komendy.');
	if(message.author.id === ownerID || message.member.roles.has(isMod.id) || message.member.hasPermission(['BAN_MEMBERS', 'ADMINISTRATOR'])) {
		
	} else {
		message.channel.send(':lock: Nie mogę Ci na to pozwolić. Nie posiadasz wystarczających uprawnień.');
		return;
	}

	// Sprawdzenie czy podano @target.username jako argument nr.1 oraz powód jako argument nr.2
	if(!args[0] || !args[1]) return message.channel.send(':warning: Błędne polecenie. Poprawne zastosowanie polecenia to **' + prefix + 'ban <@mention.member> <powód bana>**.');

	// Sprawdzenie czy bot posiada uprawnienia do wyrzucenia kogoś
	if(message.guild.me.hasPermission('BAN_MEMBERS') || message.guild.me.hasPermission('ADMINISTRATOR')) {

		// Utworzenie pomocniczej zmiennej
		let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
		let reason = args.slice(1).join(' ');

		// Sprawdza czy osoba z [target] siedzi na danym serwerze, nie jest to troll
		if(!target) return message.channel.send(':warning: Nie znalazłam wspomnianego użytkownika.');

		// Sprawdzenie czy użytkownik nie jest czasem chroniony (czyli jest właścicielem bota/serwera lub moderatorem na lokalnym serwerze)
		if(target.user.id == message.guild.ownerID) return message.channel.send(':crown: Wspomniany użytkownik jest właścicielem tego serwera. Jest on pod ochroną, twoje polecenie zostaje unieważnione.');
		if(target.roles.has(isMod.id) || target.user.id == ownerID) return message.channel.send(':shield: Nie mogę zablokować wspomnianego użytkownika. Jest chroniony jako moderator.');
		if(target.hasPermission('ADMINISTRATOR')) return message.channel.send(':fire: Nie mogę zablokować wspomnianego użytkownika. Prawdopodobnie jest on nieoficjalnym moderatorem/administratorem na tym serwerze.');

		// Próba wyrzucenia użytkownika i wysłania wiadomości o tym
			try {
				// Wygenerowania odpowiedniej wiadomości
				var embedBan = new Discord.RichEmbed()
				.setTitle(`Zostałeś zablokowany/zbanowany na serwerze ${message.guild.name}`)
        		.addField('Moderator:', `${message.author.username}`, true)
        		.addField('Użytkownik:', `${target.user.username}`, true)
        		.addField('Powód bana:', `${reason}`)
        		.setFooter('Możesz zostać odblokowany jeśli udowodnisz osobie która Ciebie zablokowała, że jesteś niewinny')
        		.setColor(0xff4444)
        		.setThumbnail(message.guild.iconURL)
        		.setTimestamp()

	        	// Powiadomienie o tym skazanego
	        	target.send(embedBan);

	        	// Sprawdzenie czy istenie kanał na modLogs
	        	if(modLogChannel != 'false' || modLogChannel != 'False' || modLogChannel != 'FALSE') {

	        		// Utworzenie wiadomości do logów
	        		var embedLogBan = new Discord.RichEmbed()
	        		.setDescription(`**Rodzaj: ** ban\n **Użytkownik: ** ${target.user.username} *(${target.user.id})*\n **Powód zbanowania:** ${reason}`)
	        		.setAuthor(message.author.username + '#' + message.author.discriminator + '  (' + message.author.id + ')', message.author.displayAvatarURL)
	        		.setColor('RANDOM')
	        		.setThumbnail(target.user.avatarURL)
	        		.setTimestamp()

	        		try {
	        			client.channels.get(modLogChannel).send(embedLogBan);
	        		} catch(logBanError) {
	        			console.error(`[BŁĄD] (ban.js, 66) Nie udało mi się wysłać logów moderacyjnych. Powód:\n ${logBanError}`);
	        		}

	        	}
				
				// Wyrzucenie skazanego
				target.ban(reason);

				// Wysłanie potwierdzającej o tym wiadomości
				message.channel.send(`:thumbsup: **${target.user.username}** został wyrzucony i zablokowany.`);
			} catch(banError) {
				console.error(`[BŁĄD] (ban.js, 77) Nie udało się wykonać polecenia (ban):\n ${banError}`);
				message.channel.send(':x: Coś poszło nie tak, nie mogę zablokować wspomnianego użytkownika. Wybacz.');
			}

	} else {
		message.channel.send(':x: Nie mogę tego wykonać. Potrzebuje uprawnień **BAN_MEMBERS** lub **ADMINISTRATOR**.');
	}
}



exports.info = {
	name: 'ban',
	description: 'Wyrzuca i blokuje daną osobę.',
	usage: 'ban <@member.mention> <powód bana>',
	example: 'ban @forkus#0039 Przykładowy powód, który trafi do logów',
	category: 'moderacja'
}