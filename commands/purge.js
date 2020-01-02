const Discord = require('discord.js');
const { ownerID, prefix, modRole, logChannel, modLogChannel, gatewayChannel } = require(`../config.js`);

exports.run = (client, message, args, isMod) => {

	//Sprawdzenie czy ranga dla moderatora istnieje
	if(!isMod) return message.channel.send(`:x: Nie znalazłam rangi moderatora o podanym ID. Sprawdź **config.js** i napraw błąd.`);

	// Sprawdzenie czy użytkownik jest właścicielem bota lub moderatorem/administratorem
	// if(message.author.id !== ownerID) return message.channel.send(':lock: Nie posiadasz uprawnień aby użyć tej komendy.');
	if(message.author.id === ownerID || message.member.roles.has(isMod.id) || message.member.hasPermission(['MANAGE_MESSAGES', 'ADMINISTRATOR'])) {
		
	} else {
		message.channel.send(':lock: Nie mogę Ci na to pozwolić. Nie posiadasz wystarczających uprawnień.');
		return;
	}

	// Sprawdzenie czy podano @target.username jako argument nr.1 oraz powód jako argument nr.2
	if(!args[0]) return message.channel.send(':warning: Błędne polecenie. Poprawne zastosowanie polecenia to **' + prefix + 'purge <ilość wiadomości do usunięcia> [@mention.textChannel]**.');

	// Limit usuwania wiadomości do 100 na raz
	if(args[0] > 100) return message.channel.send(':warning: Mogę na raz usunąć do 100 wiadomości. Dajesz mi za dużo pracy! Proszę zmniejsz ilość do 100.');

	// Sprawdzenie czy bot posiada uprawnienia do wyrzucenia kogoś
	if(message.guild.me.hasPermission('MANAGE_MESSAGES') || message.guild.me.hasPermission('ADMINISTRATOR')) {

		//Utworzenie pomocniczych komend
		if(args[1]) {
			try {
				let isTextChannel =  message.mentions.channels.first();
				var textChannel =  isTextChannel.id;
			} catch(errorTextChannel) {
				message.channel.send(':warning: Nie rozpoznałam tego kanału. Upewnij się że wspomniałeś właściwy kanał.');
				console.error('[BŁĄD] (purge.js, 34) Nie udało mi się pobrać ID kanału z treści polecenia.')
				return;
			}
		} else {
			var textChannel = message.channel.id;
		}
		let toRemove = args[0];

		// Zabezpieczenie by nikt nie usunął logów
		if(textChannel === logChannel || textChannel === modLogChannel || textChannel === gatewayChannel) return message.channel.send(':warning: Nie mogę Ci pozwolić na wyczyszczenie kanału z logami. Wybierz inny kanał.');


		// Wysłanie potwierdzającej wiadomości
		message.react('👍');

		// Usuń wybrane treści oraz wyślij wiadomość potwierdzającą
		client.channels.get(textChannel).bulkDelete(toRemove).then(() => {
			client.channels.get(textChannel).send(`:wastebasket: Wyczyściłam **${toRemove}** wiadomości na życzenie **${message.author.username}**.`).then(message => message.delete(10000));
		});

		// Sprawdzenie czy istenie kanał na logi
	        	if(modLogChannel != 'false' || modLogChannel != 'False' || modLogChannel != 'FALSE') {

	        		// Utworzenie wiadomości do logów
	        		var embedPurge = new Discord.RichEmbed()
	        		.setDescription(`**Rodzaj: ** purge\n **Kanał tekstowy:** ${textChannel}\n **Ilość usuniętych wiadomości:** ${toRemove}/100`)
	        		.setAuthor(message.author.username + '#' + message.author.discriminator + '  (' + message.author.id + ')', message.author.displayAvatarURL)
	        		.setColor('RANDOM')
	        		.setThumbnail(message.guild.iconURL)
	        		.setTimestamp()

	        		try {
	        			client.channels.get(modLogChannel).send(embedPurge);
	        		} catch(logPurgeError) {
	        			console.error(`[BŁĄD] (purge.js, 68) Nie udało mi się wysłać logów. Powód:\n ${logPurgeError}`);
	        		}

	        	}
	}
}



exports.info = {
	name: 'purge',
	description: 'Usuwa wybraną ilość wiadomości z podanego kanału. Domyślnym kanałem jest ten na którym wysłano wiadomość, możesz to zmienić wspominając kanał w 2 argumencie.',
	usage: 'purge <ilość wiadomości do usunięcia> [@mention.textChannel]',
	example: 'purge 45 #przykładowy-kanał',
	category: 'moderacja'
}