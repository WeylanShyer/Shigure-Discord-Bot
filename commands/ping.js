exports.run = (client, message, args) => {

		message.channel.send(':outbox_tray:  Mierzę opóźnienia *(ping)*...').then((ping) => {
			let pingValue= ping.createdTimestamp - message.createdTimestamp
			ping.edit(':inbox_tray: Opóźnienie pomiędzy moją alokacją a tym serwerem discord wynosi ' + Math.round(pingValue) + 'ms. Opóźnienia API: ' + Math.round(client.ping) + 'ms.')
		});
}

exports.info = {
	name: 'ping',
	description: 'Mierzy i podaje opóźnienie między botem a serwerem Discord.',
	usage: 'ping',
	example: 'ping',
	category: 'inne'
}