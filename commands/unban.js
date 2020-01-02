const Discord = require('discord.js');
const { ownerID, prefix, modRole, modLogChannel } = require(`../config.js`);

exports.run = async (client, message, args, isMod) => {

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
	if(!args[0]) return message.channel.send(':warning: Błędne polecenie. Poprawne zastosowanie polecenia to **' + prefix + 'unban <ID użytkownika>**.');

	// Sprawdzenie czy bot posiada uprawnienia do wyrzucenia kogoś
	if(message.guild.me.hasPermission('BAN_MEMBERS') || message.guild.me.hasPermission('ADMINISTRATOR')) {

		// Utworzenie pomocniczej zmiennej
		try {
        var bannedMember = await client.fetchUser(args[0]);
        var reason = args.slice(1).join(' ');

        if(!bannedMember) return message.channel.send(':x: Potrzebuję **ID** potępionego użytkownika. Wprowadzone informacje są błędne/niewystarczające.');
        if(!reason) reason = 'Nie podano powodu :thinking:';
        } catch(varError) {
            console.error(varError);
        }
		
		// Sprawdzenie czy faktycznie został zbanowany na tym serwerze Discord

		// Próba wyrzucenia użytkownika i wysłania wiadomości o tym
			try {

	        	// Sprawdzenie czy istenie kanał na modLogs
	        	if(modLogChannel != 'false' || modLogChannel != 'False' || modLogChannel != 'FALSE') {

	        		// Utworzenie wiadomości do logów
	        		var embedLogUNBan = new Discord.RichEmbed()
	        		.setDescription(`**Rodzaj: ** un-ban\n **Użytkownik: ** ${bannedMember.username} *(${args[0]})*\n **Powód odblokowania:** ${reason}`)
	        		.setAuthor(message.author.username + '#' + message.author.discriminator + '  (' + message.author.id + ')', message.author.displayAvatarURL)
	        		.setColor('RANDOM')
	        		.setThumbnail(bannedMember.avatarURL)
	        		.setTimestamp()

	        		try {
	        			client.channels.get(modLogChannel).send(embedLogUNBan);
	        		} catch(logUNBanError) {
	        			console.error(`[BŁĄD] (unban.js, 54) Nie udało mi się wysłać logów moderacyjnych. Powód:\n ${logUNBanError}`);
	        		}

	        	}
				
				// Odbanowanie, odblokowanie dostępu użytkownikowi
				message.guild.unban(bannedMember, {reason: reason});

				// Wysłanie potwierdzającej o tym wiadomości
				message.channel.send(`:thumbsup: **${bannedMember.username}** został odblokowany. Wyślij mu ponownie link-klucz aby mógł wrócić na serwer.`);
			} catch(unbanError) {
				console.error(`[BŁĄD] (unban.js, 65) Nie udało mi się wysłać logów moderacyjnych. Powód:\n ${unbanError}`);
				message.channel.send(':x: Coś poszło nie tak, nie mogę odblokować wspomnianego użytkownika. Wybacz.');
			}

	} else {
		message.channel.send(':x: Nie mogę tego wykonać. Potrzebuje uprawnień **BAN_MEMBERS** lub **ADMINISTRATOR**.');
	}
}



exports.info = {
	name: 'unban',
	description: 'Odblokowuje danego użytkownika, dzięki czemu będzie mógł on wrócić na serwer. W tym wypadku aby namierzyć daną osobę potrzeba podać jego ID.',
	usage: 'unban <ID użytkownika>',
	example: 'unban 373188195908714498',
	category: 'moderacja'
}