const Discord = require('discord.js');
const fs = require('fs');
const { botToken, botClientID, prefix, modRole, muteRole, gatewayChannel } = require(`./config.js`);

const client = new Discord.Client({
	prefix: prefix,
	disableEveryone: true
});



//Utworzenie nowej kolekcji gdzie znajdą się informacje o wczytanych komendach z innych plików, które udało się znaleźć
client.commands = new Discord.Collection();

//Sprawdzenie plików znajdujących się w folderze [commands]
const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commands) {
    console.log(`./commands/${file}`);
}




// EVENT LISTENERS
// Wszystko poniżej aż do specjalnej linii oddzielającej będzie rejestrowało zdarzenia
// BONUS - Command Handler jest też tutaj!



// Podstawowe informacje o bocie wysyłane na początku uruchamiania
client.on('ready', () => {
    console.log('[LICENCJA] Shigure bot została stworzona przez Weylan Shyer#8039 na licencji Apache-2.0.\n');
    console.log('[STATUS] Yo! Shigure już jest online!')
    console.log(`[SHIGURE] Zalogowałam się jako ${client.user.tag}. (ID: ${client.user.id})\n`);
    if(botClientID.length > 0) console.log('[CLIENT] Możesz dodać mnie do swojego serwera korzystając z linku:\n https://discordapp.com/oauth2/authorize?client_id=' + botClientID + '&scope=bot&permissions=8\n');

    client.user.setActivity(prefix + 'help', { type: 'STREAMING' });
    client.user.setStatus('available')
    client.user.setPresence({
        game: {
            name: prefix + 'help',
            type: "STREAMING",
            url: "https://www.twitch.tv/monstercat"
        }
    });
});

// Dodatkowe informacje o statusie bota gdy coś mu się stanie
client.on('disconnect', () => { console.warn('[STATUS] Stracono stabilne połączenie!') });
client.on('reconnecting', () => { console.warn('[STATUS] Próbuję ponownie nawiązać połączenie...') });

// Dodatkowe informacje gdy wystąpi błąd
client.on('error', (startError) => { console.error(`[STATUS][BŁĄD] (shigure-heart.js, 39) Wystąpił problem podczas próby włączenia shigure. Powód:\n ${startError}`) })



// Command Listener 'on message', wykrywanie poleceń użytkowników - COMMAND
client.on('message', message => {
	if(!message.content.startsWith(prefix) || message.author.bot || message.channel.type === "dm") return;

	// Zmienne:
	let args = message.content.slice(prefix.length).trim().split(' '); // ARGS trzymają wszystko poza prefixem i poleceniem
	let cmd = args.shift().toLowerCase(); // CMD trzyma tylko prefix wraz z komendą i oddziela je, np. ?warn

	// Command Handler - Główna funkcja mająca wczytać wszystkie pozostałe dodające np. obsługe komend
	try {

        // Utworzenie pomocniczej zmiennej do sprawdzania uprawnień
        const isMod = message.guild.roles.get(modRole);

		// BONUSOWY ELEMENT - Auto-Reload
		delete require.cache[require.resolve(`./commands/${cmd}.js`)];

		let commandFile = require(`./commands/${cmd}.js`) // Spowoduje to powstanie wymogu posiadania pliku w folderze [commands]
		commandFile.run(client, message, args, isMod, muteRole); // Udostępnia podane 6 zmiennych jako współdzielone pomiędzy różnymi plikami JavaScript

	} catch(commandHandler) {
		console.error(`[BŁĄD] (shigure-heart.js, 60) Znalazłam błąd podczas wykonywania jednej z komend. Błąd [Command Handler]:\n ${commandHandler}`)
	}
});



// EVENT LISTENERS
// Wszystkie poniżej będą dotyczyły już tylko rejestrowania zdarzeń zależnych od innych elementów niż od bota
// Wszystko poniżej jest wymagane do działania systemu logów i witania nowych użytkowników



client.on('guildMemberAdd', member => {
    if(gatewayChannel != 'false' || gatewayChannel != 'False' || gatewayChannel != 'FALSE') {

        // Pomocnicze zmienne
        var channel = member.guild.channels.find(channel => channel.id === gatewayChannel);
        if (!channel) return;

        var embedJoin = new Discord.RichEmbed()
        .setAuthor(`${member.user.username}#${member.user.discriminator} (${member.user.id})`, member.user.displayAvatarURL)
        .setFooter(`Dołącza do serwera`)
        .setColor(0x3acf7c)
        .setThumbnail(member.user.avatarURL)
        .setTimestamp()
    }

        channel.send(embedJoin);
});



client.on('guildMemberRemove', member => {
    if(gatewayChannel != 'false' || gatewayChannel != 'False' || gatewayChannel != 'FALSE') {

        // Pomocnicze zmienne
        var channel = member.guild.channels.find(channel => channel.id === gatewayChannel);
        if (!channel) return;

        var embedLeave = new Discord.RichEmbed()
        .setAuthor(`${member.user.username}#${member.user.discriminator} (${member.user.id})`, member.user.displayAvatarURL)
        .setFooter(`Wychodzi z serwera`)
        .setColor(0xd64237)
        .setThumbnail(member.user.avatarURL)
        .setTimestamp()
    }

        channel.send(embedLeave);
});



client.on('guildDelete', guild => {
    console.log(`[SHIGURE] Odeszłam z serwera ${guild.name}.`);
});



client.on('guildCreate', guild => {
    console.log(`[SHIGURE] Dołączyłam do serwera ${guild.name}.`);

    if(client.guilds.size > 1) {
        console.error('[BŁĄD] (shigure-heart.js, 123) Shigure jest połączona z więcej niż jednym serwerem Discord!\n Może to powodować poważne problemy z działaniem bota. Shigure została zaprojektowana jako lokalny bot, tylko dla 1 serwera na raz.\n jeśli potrzebujesz ją na innych serwerach, powinieneś stworzyć drugiego bota.')
    }

    if(guild.me.hasPermission('SEND_MESSAGES')) {
        let channelID;
        let channels = guild.channels;

        channelLoop:
        for (let x of channels) {
            let channelType = x[1].type;
            if (channelType === "text") {
                channelID = x[0];
                break channelLoop;
            }
        }

        let channel = client.channels.get(guild.systemChannelID || channelID);
        channel.send(':wave:  **Cześć wszystkim!**\n Jestem Shigure i miło mi was poznać.\n Specjalizuje się w moderacji i dostarczaniu informacji.\n Wpisz **' + prefix + 'help** aby zobaczyć listę poleceń oraz **' + prefix + 'bot-info** jeśli chcesz poznać nieco informacji na mój temat.\n *PS: Używając mojego oprogramowania automatycznie deklarujesz, przestrzegać licenji Apache-2.0.*');
    }
    if(guild.me.hasPermission('ADMINISTRATOR')) {
        console.log(`[SHIGURE] Posiadam niezbędne uprawnienia na serwerze ${guild.name}. Próbuję stworzyć dla siebie odpowiednią rangę...`);
    } else {
        console.log(`[SHIGURE] Nie posiadam niezbędnych uprawnienień na serwerze ${guild.name}. Potrzebuje uprawnień administrator abym mogła działać poprawnie!`);
    }
});



client.on('guildBanRemove', guild => {
    console.warn(`[SHIGURE] Straciłam połączenie z serwerem ${guild.name}!`);
});

// Połączenie bota z serwera od discorda
client.login(botToken);