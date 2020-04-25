// Script que mostra la info de manera ordenada 

let commands = [];
fetch("../Storage/commands.json")
    .then(response => response.json())
    .then(json => {
        commands = json;
        console.table(commands);

        let table = document.querySelector("table");
        let data = Object.keys(commands[0]);
        generateTableHead(table, data);
        generateTable(table, commands);
    });

function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function generateTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        for (let key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}