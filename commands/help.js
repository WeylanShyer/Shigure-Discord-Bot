const Discord = require('discord.js');
const fs = require('fs');
const { prefix } = require(`../config.js`);
const { stripIndents } = require('common-tags');

exports.run = (client, message, args) => {
	
	if(args[0] == 'help') return message.channel.send(`:thinking: Polecam wpisać **${prefix}help** aby się tego dowiedzieć.`);

	if(!args[0]) {
		const categories = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
		var cmdsLoaded = 0;
		var modCMD = [];
		var otherCMD = [];
		var specialCMD = [];

		for (const file of categories) {
 	   		cmdsLoaded = cmdsLoaded + 1;
 	   		let findFile = require(`./${file}`);

 	   		if(findFile.info.category == 'moderacja') {
 	   			modCMD.push(findFile.info.name);
 	   		}

 	   		if(findFile.info.category == 'inne') {
 	   			otherCMD.push(findFile.info.name);
 	   		}

 	   		if(findFile.info.category == 'special') {
 	   			specialCMD.push(findFile.info.name);
 	   		}

 	   		if(findFile.info.category != 'moderacja' && findFile.info.category != 'muzyka' && findFile.info.category != 'inne' && findFile.info.category != 'special') {
 	   			other.push(findFile.info.name);
 	   		}
		}

		if(modCMD < 1) {
			modCMD.push(':package: Nie znalazłam żadnej komendy!');
		}

		if(specialCMD < 1) {
			specialCMD.push(':package: Nie znalazłam żadnej komendy!');
		}

		if(otherCMD < 1) {
			otherCMD.push(':package: Nie znalazłam żadnej komendy!');
		}

		var helpList = new Discord.RichEmbed()
		.setAuthor(message.author.tag, message.author.displayAvatarURL)
		.setColor('RANDOM')
		.setTimestamp()
		.setFooter(`© 2020 Poland, Weylan Shyer | Shigure | Wczytano ${cmdsLoaded} komend`, client.user.displayAvatarURL)
		.setDescription(`Lista aktywnych komend dla ${message.guild.me.displayName}.\nPrefix dla poleceń: **${prefix}**\nAby uzyskać więcej informacji, wpisz **${prefix}help [nazwa polecenia]**`)

		//Kategoria dla komend moderacyjnych
		.addField('Polecenia z kategorii [moderacja] (dostęp ograniczony)', `${modCMD.map(name => `${name}`).join(', ')}`)

		//Kategoria dla komend specjalnych, czyli głównie (jak nie tylko) dla właściciela bota
		.addField('Polecenia z kategorii [special] (tylko dla "właściciela bota", hosta)', `${specialCMD.map(name => `${name}`).join(', ')}`)

		//Kategoria dla komend [inne] oraz tych jeszcze nie określonych
		.addField('Polecenia z kategorii [inne] + te jeszcze nieokreślone', `${otherCMD.map(name => `${name}`).join(', ')}`)

		try {
		message.channel.send(helpList);
		return;
		} catch(helpListError) {
			console.error(`[BŁĄD] (help.js, 70) Nie udało się wysłać wiadomości z listą komend. Powód: ${helpListError}`);
			return;
		}
	}



	if(fs.existsSync(`./commands/${args[0]}.js`)) {

		let commandFile = require(`./${args[0]}.js`);

		var helpInfo = new Discord.RichEmbed()
		.setAuthor(message.author.tag, message.author.displayAvatarURL)
		.setColor('RANDOM')
		.setTimestamp()
		.setFooter(`Rodzaj klamer ma znaczenie! <> - obowiązkowe, [] - opcjonalne`)
		.setDescription(`**Nazwa polecenia:** ${commandFile.info.name}
		**Opis:** ${commandFile.info.description}\n
		**Zastosowanie:** ${prefix}${commandFile.info.usage}
		**Przykład:** ${prefix}${commandFile.info.example}`)

		try {
			message.channel.send(helpInfo);
			return;
		} catch(helpError) {
			console.error(`[BŁĄD] (help.js, 95) Nie udało się wysłać wiadomości z opisem i przykładami do podanej komendy. Powód: ${helpError}`);
			return;
		}

	} else {
		message.channel.send(':x: Nie znalazłam takiej komendy. Sprawdź czy podałeś prawidłową nazwę komendy o której chcesz się dowiedzieć więcej.');
	}

}



exports.info = {
	name: 'help',
	description: 'Wyświetla listę ze wszystkimi poleceniami. Podając w pierwszym argumencie nazwę komendy można uzyskać o niej więcej informacji.',
	usage: 'help',
	example: 'help',
	category: 'inne'
}