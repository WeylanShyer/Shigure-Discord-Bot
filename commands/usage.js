const { ownerID } = require(`../config.js`);
exports.run = (client, message) => {

	if(message.author.id === ownerID) {

		let os = require('os');
		let v8 = require('v8');
		let cpuStat = require('cpu-stat')

		let maxMemory = os.totalmem();
		let usedMemory = os.totalmem() - os.freemem();
		let memoryUsedPercentage = (usedMemory / maxMemory) * 100;

		let heapTotal = v8.getHeapStatistics().heap_size_limit || process.memoryUsage().heapTotal;
		let heapUsed = process.memoryUsage().heapUsed;
		let heapPercentage = (heapUsed / heapTotal) * 100;

		message.channel.send(`:bar_chart: **Aktualne statystyki zużycia pamięci ram:**\n• ${Math.round(usedMemory / (1024*1024))}/${Math.round(maxMemory / (1024*1024))}MB (${Math.round(memoryUsedPercentage)}%) - Zużycie pamięci całego serwera\n• ${usedMemory}/${maxMemory} Bytes - Zyżycie pamięci całego serwera, wartość surowa\n• ${Math.round(heapUsed / (1024*1024))}/${Math.round(heapTotal / (1024*1024))}MB (${Math.round(heapPercentage)}%) - Zużycie pamięci aktualnego procesu\n• ${heapUsed}/${heapTotal} Bytes - Zyżycie pamięci aktualnego procesu, wartość surowa\n ---------------------------------------------------------------------------------------\n :gear: **Aktualne statystyki zużycia CPU:**\n• ${process.cpuUsage().user}μs - czas odpowiedzi *(user)*\n• ${process.cpuUsage().system}μs - czas odpowiedzi *(system)*`);
		
		cpuStat.usagePercent(function(errorCPUCheck, percent, seconds) {

    	if (errorCPUCheck) {
      	return console.error(`[BŁĄD] (usage.js, 23) Nie udało się zmierzyć stopnia zużycia CPU, powód: ${errorCPUCheck}`);
    	}

    	//the percentage cpu usage over all cores
    	message.channel.send(`• ${Math.round(percent)}% - Zużycie CPU *(wszystkie rdzenie)*`)

    	//the approximate number of seconds the sample was taken over
    	message.channel.send(`• ~${Math.round(seconds)} sek - Przybliżony czas opóźnienia`);

		});

	} else {
		message.channel.send(':lock: Nie mogę Ci na to pozwolić. Nie posiadasz wystarczających uprawnień.');
		return;
	}

}



exports.info = {
	name: 'usage',
	description: 'Informuje o aktualnym stanie zużycia zasobów przez bota/serwer.',
	usage: 'usage',
	example: 'usage',
	category: 'special'
}