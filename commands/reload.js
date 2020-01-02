const { ownerID } = require(`../config.js`);

exports.run = (client, message, args) => {

	//Sprawdzenie czy użytkownik jest właścicielem bota
	if(message.author.id !== ownerID) return message.channel.send(':lock: Nie posiadasz uprawnień aby użyć tej komendy. Ta komenda przeznaczona jest tylko dla mojego właściciela.');

	//Usuwanie wybranego skryptu z pamięci CACHE
	try {
		delete require.cache[require.resolve(`./${args[0]}.js`)];
	} catch(error) {
		console.error(`[ERROR] Znaleziono problem podczas próby przeładowania skryptu [${args[0]}.js]: ${error}`)
		message.channel.send(`:warning: Znalazłam problem podczas próby przeładowania skryptu **${args[0]}.js**.`);
		return;
	}

	//Wysłanie wiadomości informującej o wykonaniu polecenia
	console.log(`[INFO] Prawidłowo przeładowano skrypt [${args[0]}.js]`)
	message.channel.send(`:repeat: Przeładowałam skrypt **${args[0]}.js**.`);
	return;
}



exports.info = {
	name: 'reload',
	description: 'Przeładowuje wybrany skrypt w locie. Szczerze? Ta komenda należy do prehistorii, ponieważ skrypty są teraz odświeżane przy każdym ich użyciu automatycznie.',
	usage: 'reload <nazwa komendy>',
	example: 'reload ping.js',
	category: 'special'
}