const { ownerID } = require(`../config.js`);
exports.run = (client, message) => {

	if(message.author.id === ownerID) {

		function duration(ms) {
			let seconds = Math.floor((ms / 1000) % 60);
			let minutes = Math.floor((ms / (1000 * 60)) % 60);
			let hours = Math.floor((ms / (1000 * 60 * 60)) % 60);
			let days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60);
			return `**${days} d, ${hours} h, ${minutes} min i ${seconds} sek**`;
		}

		message.channel.send(`:hourglass: Działam nieprzerwanie od ${duration(client.uptime)}.`);

	} else {
		message.channel.send(':lock: Nie mogę Ci na to pozwolić. Nie posiadasz wystarczających uprawnień.');
		return;
	}

}



exports.info = {
	name: 'uptime',
	description: 'Informuje o tym jak długo działa bot bez zatrzymania, ani jednej usterki/błędu.',
	usage: 'uptime',
	example: 'uptime',
	category: 'special'
}