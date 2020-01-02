const { botToken, botClientID, ownerID, prefix, modRole, modLogChannel, muteRole, gatewayChannel } = require(`../config.js`);
const fs = require('fs');
exports.run = (client, message, args, isMod) => {
	
	if(message.author.id !== ownerID) {
		message.channel.send(':lock: Nie mogę Ci na to pozwolić. Nie posiadasz wystarczających uprawnień.');
		return;
	}

	var numbers = /^[0-9]+$/;
	var modChannel = client.channels.get(modLogChannel);
	var gateway = client.channels.get(modLogChannel)
	var mutedRole = message.guild.roles.get(muteRole);
	var permList = ':scroll: **Wynik skanowania tabeli uprawnień**\n\n*(Potrzebuje wymienionych permisji do prawidłowego działania)*\n\n';
	var configList = '\n:pencil: **Wynik skanowania pliku konfiguracyjnego**\n\n';



	// Sprawdzenie czy bot posiada niezbędne uprawnienia do poprawnego działania

	if(message.guild.me.hasPermission(['SEND_MESSAGES', 'VIEW_CHANNEL'])) {
		permList = permList + ':green_circle: SEND_MESSAGES & VIEW_CHANNEL\n';
	} else {
		console.log('[SHIGURE] Self-Check zakończony niepowodzeniem. Nie posiadam nawet uprawnienia "SEND_MESSAGES"/"VIEW_CHANNEL" aby wysłać wiadomość na czacie o progresie w szukaniu błędów.');
		return;
	}

	//Dodanie legendy zanim zostanie wysłana wiadomość
	message.channel.send('--------------------------------------------------------------------------------\n:red_circle: - Błąd lub brak\n:blue_circle:  - Wygląda ok, przeszło podstawowe testy\n:green_circle:  - działa na 100%\n:yellow_circle:  - Coś tam jest, ale nie spełniło wszystkich testów\n:purple_circle:  - Prawdopodobnie działa, ale nie wykryto na aktualnym serwerze *(ID issue)*\n--------------------------------------------------------------------------------');

	if(message.guild.me.hasPermission('KICK_MEMBERS')) {
		permList = permList + ':green_circle: KICK_MEMBERS\n';
	} else {
		permList = permList + ':red_circle: KICK_MEMBERS\n';
	}

	if(message.guild.me.hasPermission('BAN_MEMBERS')) {
		permList = permList + ':green_circle: BAN_MEMBERS\n';
	} else {
		permList = permList + ':red_circle: BAN_MEMBERS\n';
	}

	if(message.guild.me.hasPermission('ADMINISTRATOR')) {
		permList = permList + ':green_circle: ADMINISTRATOR\n';
	} else {
		permList = permList + ':warning: ADMINISTRATOR - Nie jest niezbędny, ale zaleca się udostępnienia tej opcji\n';
	}

	if(message.guild.me.hasPermission('VIEW_AUDIT_LOG')) {
		permList = permList + ':green_circle: VIEW_AUDIT_LOG\n';
	} else {
		permList = permList + ':red_circle: VIEW_AUDIT_LOG\n';
	}

	if(message.guild.me.hasPermission('MANAGE_MESSAGES')) {
		permList = permList + ':green_circle: MANAGE_MESSAGES\n';
	} else {
		permList = permList + ':red_circle: MANAGE_MESSAGES\n';
	}

	if(message.guild.me.hasPermission('EMBED_LINKS')) {
		permList = permList + ':green_circle: EMBED_LINKS\n';
	} else {
		permList = permList + ':red_circle: EMBED_LINKS\n';
	}

	if(message.guild.me.hasPermission('READ_MESSAGE_HISTORY')) {
		permList = permList + ':green_circle: READ_MESSAGE_HISTORY\n';
	} else {
		permList = permList + ':red_circle: READ_MESSAGE_HISTORY\n';
	}

	if(message.guild.me.hasPermission('MANAGE_ROLES')) {
		permList = permList + ':green_circle: MANAGE_ROLES\n\n';
	} else {
		permList = permList + ':red_circle: MANAGE_ROLES\n\n';
	}



	// Sprawdzenie stanu poprawności config.js
	if(botToken) {
		configList = configList + `:green_circle: botToken\n`;
	} else {
		configList = configList + `:red_circle: botToken\n`;
	}

	if(botClientID > 14 && botClientID.match(numbers)) {
		configList = configList + `:blue_circle: botClientID\n`;
	} else if(botClientID) {
		configList = configList + `:yellow_circle: botClientID\n`;
	} else {
		configList = configList + `:red_circle: botClientID\n`;
	}

	if(ownerID > 14 && ownerID.match(numbers)) {
		configList = configList + `:green_circle: ownerID\n`;
	} else if(botClientID) {
		configList = configList + `:yellow_circle: ownerID\n`;
	} else {
		configList = configList + `:red_circle: ownerID\n`;
	}

	if(prefix) {
		configList = configList + `:green_circle: prefix **[${prefix}]**\n`;
	} else {
		configList = configList + `:red_circle: prefix **[NONE]**\n`;
	}

	if(modRole > 14 && modRole.match(numbers)) {
		if(isMod) {
			configList = configList + `:green_circle: modRole **[${isMod.name}]**\n`;
		} else if(!isMod) {
			configList = configList + `:purple_circle: modRole\n`;
		}
	} else if(modRole) {
		configList = configList + `:yellow_circle: modRole\n`;
	} else {
		configList = configList + `:red_circle: modRole\n`;
	}

	if(modLogChannel > 14 && modLogChannel.match(numbers)) {
		if(modChannel) {
			configList = configList + `:green_circle: modLogChannel **[${modChannel.name}]**\n`;
		} else if(!modChannel) {
			configList = configList + `:purple_circle: modLogChannel\n`;
		}
	} else if(modLogChannel == 'False' || modLogChannel == 'FALSE' || modLogChannel == 'false') {
		configList = configList + `:black_circle: modLogChannel\n`;
	} else if(modLogChannel) {
		configList = configList + `:yellow_circle: modLogChannel\n`;
	} else {
		configList = configList + `:red_circle: modLogChannel\n`;
	}

	if(muteRole > 14 && muteRole.match(numbers)) {
		if(mutedRole) {
			configList = configList + `:green_circle: muteRole **[${mutedRole.name}]**\n`;
		} else if(!mutedRole) {
			configList = configList + `:purple_circle: muteRole\n`;
		}
	} else if(muteRole) {
		configList = configList + `:yellow_circle: muteRole\n`;
	} else {
		configList = configList + `:red_circle: muteRole\n`;
	}

	if(gatewayChannel > 14 && gatewayChannel.match(numbers)) {
		if(gateway) {
			configList = configList + `:green_circle: gatewayChannel **[${gateway.name}]**\n\n`;
		} else if(!gateway) {
			configList = configList + `:purple_circle: gatewayChannel\n\n`;
		}
	} else if(gatewayChannel == 'False' || gatewayChannel == 'FALSE' || gatewayChannel == 'false') {
		configList = configList + `:black_circle: gatewayChannel\n\n`;
	} else if(gatewayChannel) {
		configList = configList + `:yellow_circle: gatewayChannel\n\n`;
	} else {
		configList = configList + `:red_circle: gatewayChannel\n\n`;
	}


	// Sprawdzenie na ilu serwerach jest bot
	if(client.guilds.size > 1) {
		configList = configList + `:red_circle: Shigure znajduje się na ${client.guilds.size} serwerach podczas gdy powinna być tylko na 1.`;
	} else {
		configList = configList + 'green_circle: Zalogowano Shigure na tylko 1 serwer, prawidłowo'
	}

	

	// Podsumowanie wiadomości i wysłanie jej
	let resultList = permList + configList;

	message.channel.send(resultList);

}

exports.info = {
	name: 'self-check',
	description: 'Shigure postara się sama siebie zbadać w poszukiwaniu błędów. Wyświetli informacje na temat tego co działa, a co powoduje problemy.',
	usage: 'self-check',
	example: 'self-check',
	category: 'special'
}