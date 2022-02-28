/* eslint-disable no-undef */
// Script que mostra la info de manera ordenada

let commands = [];
fetch('https://raw.githubusercontent.com/AleixFerre/CataBot/main/docs/Storage/commands.json')
	.then((response) => response.json())
	.then((json) => {
		commands = json;

		// Encuem cada comanda a la taula que toca
		for (let i = 0; i < commands.length; i++) {
			const command = commands[i];
			if (!command.alias) command.alias = '';
		}

		sorting(commands, 'type');

		const content = document.getElementById('table_content');
		generateTable(content, commands);
	});

function generateTable(table, data) {
	for (const element of data) {
		const row = table.insertRow();
		row.className = 'row100 body';

		const keys = Object.keys(element);
		for (let i = 0; i < 5; i++) {
			const cell = row.insertCell();
			cell.className = 'cell100 column' + (i + 1);
			const text = document.createTextNode(element[keys[i]]);
			cell.appendChild(text);
		}
	}
}

function sorting(json_object, key_to_sort_by) {
	function sortByKey(a, b) {
		const x = a[key_to_sort_by];
		const y = b[key_to_sort_by];
		return x < y ? -1 : x > y ? 1 : 0;
	}

	json_object.sort(sortByKey);
}
