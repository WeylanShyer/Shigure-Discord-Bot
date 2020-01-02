const Discord = require('discord.js');
const { ownerID, prefix, modRole, modLogChannel } = require(`../config.js`);

exports.run = (client, message, args, isMod, muteRole) => {

	//Sprawdzenie czy ranga dla moderatora istnieje
	if(!isMod) return message.channel.send(`:x: Nie znalazłam rangi moderatora o podanym ID. Sprawdź **config.js** i napraw błąd.`);

	// Sprawdzenie czy użytkownik jest właścicielem bota lub moderatorem/administratorem
	// if(message.author.id !== ownerID) return message.channel.send(':lock: Nie posiadasz uprawnień aby użyć tej komendy.');
	if(message.author.id === ownerID || message.member.roles.has(isMod.id) || message.member.hasPermission('ADMINISTRATOR')) {
		
	} else {
		message.channel.send(':lock: Nie mogę Ci na to pozwolić. Nie posiadasz wystarczających uprawnień.');
		return;
	}

	// Sprawdzenie czy podano @target.username jako argument nr.1 oraz powód jako argument nr.2
	if(!args[0] || !args[1]) return message.channel.send(':warning: Błędne polecenie. Poprawne zastosowanie polecenia to **' + prefix + 'unmute <@mention.member> <powód>**.');

	// Sprawdzenie czy bot posiada uprawnienia do wyrzucenia kogoś
	if(message.guild.me.hasPermission('ADMINISTRATOR')) {

		// Utworzenie pomocniczej zmiennej
		let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
		let reason = args.slice(1).join(' ');
		const mutedRole = message.guild.roles.get(muteRole);

		// Sprawdza czy osoba z [target] siedzi na danym serwerze, nie jest to troll
		if(!target) return message.channel.send(':warning: Nie znalazłam wspomnianego użytkownika.');

		// Sprawdzenie czy użytkownik nie jest czasem chroniony (czyli jest właścicielem bota/serwera lub moderatorem na lokalnym serwerze)
		if(target.user.id == message.guild.ownerID) return message.channel.send(':crown: Wspomniany użytkownik jest właścicielem tego serwera. Jest on pod ochroną, twoje polecenie zostaje unieważnione.');
		if(target.roles.has(isMod.id) || target.user.id == ownerID) return message.channel.send(':shield: Nie mogę wyrzucić wspomnianego użytkownika. Jest chroniony jako moderator.');
		if(target.hasPermission('ADMINISTRATOR')) return message.channel.send(':fire: Nie mogę wyrzucić wspomnianego użytkownika. Prawdopodobnie jest on nieoficjalnym moderatorem/administratorem na tym serwerze.');

		// Sprawdzenie czy dana osoba jest wyciszona
		if(target.roles.has(mutedRole.id)) {

			//Usuń rolę i wyślij o tym wiadomość
			try {
				target.removeRole(mutedRole.id);
				target.send(`:hourglass: Twoja kara została przedwcześnie zakończona dzięki **${message.author.username}**. Znowu możesz pisać i mówić na serwerze **${message.guild.name}**.`);
				message.channel.send(`:thumbsup: Anulowałam karę. **${target.user.username}** został odciszony.`);
			} catch(unmuteError) {
				console.error(`[BŁĄD] (unmute.js, 46) Wystąpił problem przy próbie usunięcia z użytkownika karnej roli i wysłania prywatnej wiadomości potwierdzającej. Powód:\n ${unmuteError}`);
				message.channel.send(':x: Coś poszło nie tak, nie mogę odciszyć wspomnianego użytkownika. Wybacz.');
			}

			// Sprawdzenie czy istenie kanał na modLogs
	        if(modLogChannel != 'false' || modLogChannel != 'False' || modLogChannel != 'FALSE') {

	        	// Utworzenie wiadomości do logów
	        	var embedLogUNMute = new Discord.RichEmbed()
	        	.setDescription(`**Rodzaj: ** un-mute\n **Użytkownik: ** ${target.user.username} *(${target.user.id})*\n **Powód przedwczesnego zakończenia kary:**\n ${reason}`)
	        	.setAuthor(message.author.username + '#' + message.author.discriminator + '  (' + message.author.id + ')', message.author.displayAvatarURL)
	        	.setColor('RANDOM')
	        	.setThumbnail(target.user.avatarURL)
	        	.setTimestamp()

	        	// Spróbuj wysłać przygotowaną wcześniej wiadomość
	        	try {
	        		client.channels.get(modLogChannel).send(embedLogUNMute);
	        	} catch(logUNMuteError) {
	        		console.error(`[BŁĄD] (unmute.js, 65) Nie udało mi się wysłać logów moderacyjnych. Powód:\n ${logUNMuteError}`);
	        	}
	        }
	    } else {
	    	message.channel.send(':warning: Wspomniany użytkownik nie jest wyciszony.');
	    }

	} else {
		message.channel.send(':x: Nie mogę tego wykonać. Potrzebuje uprawnień **ADMINISTRATOR**.');
	}
}



exports.info = {
	name: 'unmute',
	description: 'Odcisza danego użytkownika, oddaje mu uprawnienia do pisania/mówienia poprzez zabranie karnej rangi.',
	usage: 'unmute <@mention.member> <powód>',
	example: 'unmute @forkus#0039 Przykładowy powód, informujący innych dlaczego kara została anulowana przed czasem',
	category: 'moderacja'
}