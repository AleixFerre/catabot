/* eslint-disable no-undef */
fetch('./Storage/info.json')
	.then((info) => info.json())
	.then(({ nMembers, nServers, nCommands }) => {
		document.getElementById('nMembers').innerHTML = '+' + Math.floor(nMembers / 1000) * 1000;
		document.getElementById('nServers').innerHTML = nServers;
		document.getElementById('nCommands').innerHTML = nCommands;
	});
