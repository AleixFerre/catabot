// Script que mostra la info de manera ordenada

let commands = [];
fetch('https://raw.githubusercontent.com/CatalaHD/CataBot/main/docs/Storage/commands.json')
  .then((response) => response.json())
  .then((json) => {
    commands = json;

    // Encuem cada comanda a la taula que toca
    for (let i = 0; i < commands.length; i++) {
      let command = commands[i];
      if (!command.alias) command.alias = '';
    }

    sorting(commands, 'type');

    let content = document.getElementById('table_content');
    generateTable(content, commands);
  });

function generateTable(table, data) {
  for (let element of data) {
    let row = table.insertRow();
    row.className = 'row100 body';

    let i = 1;
    let keys = Object.keys(element);
    for (let i = 0; i < 5; i++) {
      let cell = row.insertCell();
      cell.className = 'cell100 column' + (i + 1);
      let text = document.createTextNode(element[keys[i]]);
      cell.appendChild(text);
    }
  }
}

function sorting(json_object, key_to_sort_by) {
  function sortByKey(a, b) {
    var x = a[key_to_sort_by];
    var y = b[key_to_sort_by];
    return x < y ? -1 : x > y ? 1 : 0;
  }

  json_object.sort(sortByKey);
}
