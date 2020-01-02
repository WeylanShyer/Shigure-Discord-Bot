const Discord = require('discord.js');
const ms = require('ms');
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
	if(!args[0] || !args[1] || !args[2]) return message.channel.send(':warning: Błędne polecenie. Poprawne zastosowanie polecenia to **' + prefix + 'mute <@mention.member> <czas> <powód>**.');

	// Sprawdzenie czy bot posiada uprawnienia do wyrzucenia kogoś
	if(message.guild.me.hasPermission('ADMINISTRATOR')) {

		// Utworzenie pomocniczej zmiennej
		let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
		let reason = args.slice(2).join(' ');
		const mutedRole = message.guild.roles.get(muteRole);
		let time = args[1];

		// Sprawdzenie czy podana w config ranga dla wyciszonych istnieje
		if(!mutedRole) return message.channel.send(`:x: Nie znalazłam karnej rangi o podanym ID. Sprawdź **config.js** i napraw błąd.`);

		// Sprawdza czy osoba z [target] siedzi na danym serwerze, nie jest to troll
		if(!target) return message.channel.send(':warning: Nie znalazłam wspomnianego użytkownika.');

		// Sprawdzenie czy użytkownik nie jest czasem chroniony (czyli jest właścicielem bota/serwera lub moderatorem na lokalnym serwerze)
		if(target.user.id == message.guild.ownerID) return message.channel.send(':crown: Wspomniany użytkownik jest właścicielem tego serwera. Jest on pod ochroną, twoje polecenie zostaje unieważnione.');
		if(target.roles.has(isMod.id) || target.user.id == ownerID) return message.channel.send(':shield: Nie mogę wyciszyć wspomnianego użytkownika. Jest chroniony jako moderator.');
		if(target.hasPermission('ADMINISTRATOR')) return message.channel.send(':fire: Nie mogę wyciszyć wspomnianego użytkownika. Prawdopodobnie jest on nieoficjalnym moderatorem/administratorem na tym serwerze.');

		// Sprawdzenie czy użytkownik przypadkiem już nie posiada roli, nie jest wyciszony
		if(target.roles.has(mutedRole.id)) return message.channel.send(':warning: Wspomniany użytkownik jest już uciszony! Jeśli jest to błąd, możesz usunąć karną rolę poleceniem **' + prefix + 'unmute <@mention.member> <powód>**.')

		// Próba wyrzucenia użytkownika i wysłania wiadomości o tym
			try {
				//Przypisz wybraną karną rolę do użytkownika
				target.addRole(mutedRole.id);

				//Wysłanie potwierdzającej wiadomości
				message.channel.send(`:hourglass_flowing_sand: **${target.user.username}** został wyciszony na czas: **${ms(ms(time), {long: true})}**`);

				// Wygenerowania odpowiedniej wiadomości
				var embedMute = new Discord.RichEmbed()
				.setTitle(`Zostałeś wyciszony na serwerze ${message.guild.name}`)
        		.addField('Moderator:', `${message.author.username}`, true)
        		.addField('Użytkownik:', `${target.user.username}`, true)
        		.addField('Powód wyciszenia:', `${reason}`)
        		.addField('Czas trwania kary:', `${ms(ms(time), {long: true})}`)
        		.setColor(0xa756ff)
        		.setThumbnail(message.guild.iconURL)
        		.setTimestamp()

	        	// Powiadomienie o tym wyciszoną osobę
	        	target.send(embedMute);



	        	// Sprawdzenie czy istenie kanał na modLogs
	        	if(modLogChannel != 'false' || modLogChannel != 'False' || modLogChannel != 'FALSE') {

	        		// Utworzenie wiadomości do logów
	        		var embedLogMute = new Discord.RichEmbed()
	        		.setDescription(`**Rodzaj: ** mute\n **Użytkownik: ** ${target.user.username} *(${target.user.id})*\n **Czas trwania wyciszenia:** ${ms(ms(time), {long: true})}\n **Powód wyciszenia:** ${reason}`)
	        		.setAuthor(message.author.username + '#' + message.author.discriminator + '  (' + message.author.id + ')', message.author.displayAvatarURL)
	        		.setColor('RANDOM')
	        		.setThumbnail(target.user.avatarURL)
	        		.setTimestamp()

	        		try {
	        			client.channels.get(modLogChannel).send(embedLogMute);
	        		} catch(logMuteError) {
	        			console.error(`[BŁĄD] (mute.js, 83) Nie udało mi się wysłać logów moderacyjnych. Powód:\n ${logMuteError}`);
	        		}

	        	}

	        	//Zdjęcie karnej roli z użytkownika kiedy minie już czas
				setTimeout(function() {
					try {
					target.removeRole(mutedRole.id);
					target.send(`:hourglass: Twoja kara dobiegła końca. Znowu możesz pisać i mówić na serwerze **${message.guild.name}**.`);
					} catch(timeoutError) {
						console.error(`[BŁĄD] (mute.js, 92) Nie udało mi się wysłać wiadomości prywatnej do użytkownika i zdjęcia z niego karnej roli (mute). Powód:\n ${timeoutError}`);
					}
				}, ms(time));



			} catch(muteError) {
				console.error(`[BŁĄD] (mute.js, 99) Nie udało się wykonać polecenia (mute):\n ${muteError}`);
				message.channel.send(':x: Coś poszło nie tak, nie mogę uciszyć wspomnianego użytkownika. Wybacz.');
			}

	} else {
		message.channel.send(':x: Nie mogę tego wykonać. Potrzebuje uprawnień **ADMINISTRATOR**.');
	}
}



exports.info = {
	name: 'mute',
	description: 'Wycisza daną osobę przez określony czas. Wyciszony użytkownik otrzyma wcześniej ustaloną rolę, która powinna zablokować możliwość pisania/mówienia na kanałach.',
	usage: 'mute <@mention.member> <czas> <powód>',
	example: 'mute @forkus#0039 3h Przykładowy powód, który trafi do logów',
	category: 'moderacja'
}