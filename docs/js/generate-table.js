// Script que mostra la info de manera ordenada 

let commands = [];
fetch("../Storage/commands.json")
    .then(response => response.json())
    .then(json => {
        commands = json;
        //console.table(commands);
        let musica = [];
        /*
        for (let i = 0; i < commands.length; i++) {
            let command = commands[i];
            if (command.type === "musica") {
                delete command.type;
                musica.push(command);
            }
        }*/

        let mod = [];
        let banc = [];
        let entreteniment = [];
        let privat = [];
        let altres = [];
        let headers = ['Nom', 'Descripció', 'Tipus', 'Ús', 'Alias'];

        // Encuem cada comanda a la taula que toca
        for (let i = 0; i < commands.length; i++) {
            let command = commands[i];

            switch (command.type) {
                case 'musica':
                    musica.push(command);
                    break;
                case 'mod':
                    mod.push(command);
                    break;
                case 'banc':
                    banc.push(command);
                    break;
                case 'entreteniment':
                    entreteniment.push(command);
                    break;
                case 'privat':
                    privat.push(command);
                    break;
                case 'altres':
                    altres.push(command);
                    break;
                default:
                    altres.push(command);
                    break;
            }
        }

        console.table(musica);
        console.table(mod);
        console.table(entreteniment);
        console.table(privat);
        console.table(altres);


        let table = document.querySelector("table");
        let data = headers;
        generateTableHead(table, data);
        generateTable(table, musica);

        generateTableHead(table, data);
        generateTable(table, mod);

        generateTableHead(table, data);
        generateTable(table, entreteniment);

        generateTableHead(table, data);
        generateTable(table, privat);

        generateTableHead(table, data);
        generateTable(table, altres);
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