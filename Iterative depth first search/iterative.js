let mapa = {};
let steps = [];
let step = 0;
let marked = [];
let found = false;

function formatData(edges) {                    // Generisi matricu susjedstava iz niza objekata

    let newArr = new Array();                                               // [
    let nodeNumber = parseInt(document.querySelector("#generate").value);   //     { from: 0, to: 3, label: '1', id: '6074ed12-ee13-42df-ab48-291edc9c600a' },
    for (let i = 0; i < nodeNumber; i++) {                                  //     { from: 0, to: 9, label: '6', id: 'f87cd441-6cb4-4845-b0c9-e3915061bd78' },
        let temp = edges.filter((e) => e.from == i);                        //     { from: 1, to: 2, label: '6', id: '2f7b7058-e934-4b00-8a02-16af73d52929' },
        newArr[i] = new Array(nodeNumber);                                  //     { from: 1, to: 6, label: '5', id: '7e8d659c-eefe-4497-879e-a1393a3a409c' }
        newArr[i].fill(0, 0, nodeNumber);                                   //     .
        for (let j = 0; j < temp.length; j++) {                             //     .
            newArr[i][temp[j].to] = parseInt(temp[j].label);                //     .
        }                                                                   // ]
    }
    for (let i = 0; i < nodeNumber; i++) {
        for (let j = 0; j < nodeNumber; j++) {
            if (newArr[i][j] != 0) {
                newArr[j][i] = newArr[i][j];
            }
            if (i == j) {
                newArr[i][j] = 0;
            }
        }
    }
    return newArr
}

const markGraph = (nodes, markType) => {        // Markiranje i demarkiranje grana i cvorova

    if (nodes.length == 2) {
        let edge = edges.find((e) => ((e.from == parseInt(nodes[1])) && (e.to == parseInt(nodes[0]))) || ((e.from == parseInt(nodes[0])) && (e.to == parseInt(nodes[1]))));
        graphEdges.update({ id: edge.from + "-" + edge.to, color: { color: markType ? 'red' : '#848484' }, width: markType ? 3 : 1 })
        graphNodes.update({ id: parseInt(nodes[1]), color: { background: markType ? 'red' : "#97C2FC" } })
        graphNodes.update({ id: parseInt(nodes[0]), color: { background: markType ? 'red' : "#97C2FC" } })
    }
    graphNodes.update({ id: parseInt(nodes[0]), color: { background: markType ? 'red' : "#97C2FC" } })
}

function draw() {                               // Funkcija za generisanje nasumicnog grafika

    const between = (min, max) => {             // Generisanje nasumicnog broja u odredjenom opsegu
        return Math.floor(
            Math.random() * (max - min + 1) + min
        )
    }

    let brojTacaka = document.querySelector("#generate").value;
    let nodes = new Array();
    edges = new Array();
    let temp = 0;
    for (var i = 0; i < brojTacaka; i++) {
        nodes[i] = { id: i, label: i.toString() };
        for (var i1 = 0; i1 < between(1, brojTacaka - 1); i1++) {
            direction = between(0, brojTacaka - 1);
            if (edges.find(({ from, to }) => ((from == i) && (to == direction)) || ((from == direction) && (to == i)))) {
                continue;
            }
            edges[temp] = { id: i + "-" + direction, from: i, to: direction, label: Math.ceil(Math.random() * 10).toString() };
            temp++;
        }
    }

    graphNodes = new vis.DataSet(nodes);                    // Prikazivanje grafika
    graphEdges = new vis.DataSet(edges);
    let container = document.getElementById("mynetwork");
    let data = {
        nodes: graphNodes,
        edges: graphEdges,
    };
    let options = {
        physics: {
            enabled: false,
        }
    };
    network = new vis.Network(container, data, options);
}

function path() {                               // Funkcija za formiranje pretrage po nivoima

    const problem = formatData(edges);
    let start = parseInt(document.getElementById("start").value);
    let dubina = parseInt(document.getElementById("depth").value);

    const formatSteps = () => {                         // Kreiranje niza koraka koji ce se prikazivati na grafiku

        levels = Object.keys(mapa);
        steps = [];
        for (let i = 0; i < levels.length; i++) {
            temp = mapa[levels[i]].map(e => {
                return Object.keys(e)[0]
            })
            steps = [...steps, ...temp];                // primjer = [ 0, 0, 0-1, 0-2, 0, 0-1, 1-3, 1-4, 0-2, 2-3, 2-5, 0, ....]
        }

        let insertClear = [];                           // Umetanje stringa clear prije svakog pocetnog cvora
        for (let i = 0; i < steps.length; i++) {
            if (steps[i] == start) {
                insertClear.push(i);
            }
        }
        insertClear.reverse();
        insertClear.forEach(e => {
            steps.splice(e, 0, 'clear');
        })
        return steps;                                   // primjer = [ clear, 0, clear, 0, 0-1, 0-2, clear, 0, 0-1, 1-3, 1-4, 0-2, 2-3, 2-5, clear, 0, ....]
    }

    const djeca = (cvor, dubina, parent) => {       // Funkcija koja za proslijedjeni cvor, dubinu i parent vrace niz objekata,

        const log = (str) => {                      // Pomocna funkcija za logovanje, za prikaz poruka u konzoli postaviti logging na true                    
            let logging = false;
            if (logging) {
                console.log(JSON.parse(JSON.stringify(str)));
            }
        }

        log(`Pozvana funkcija djeca: djeca(${cvor}, ${dubina}, ${parent})`);
        let res = [];       // Niz u kojem cemo smjestati rezultate

        if (dubina != 0) {  // Dubina se iterativno smanjuje i na kraju ce biti 0

            for (let i = 0; i < problem[cvor].length; i++) {        // Iteriranje kroz matricu prelaza za cvor proslijedjen kao parametar

                log(`Da li postoji prelaz na cvor ${i}? ${problem[cvor][i] != 0}`);
                if (problem[cvor][i] != 0) {
                    log(`Da li je parent(${parent}) razlicit od cvora(${i}) na koji imamo prelaz? ${parent != i}`)
                }

                if (problem[cvor][i] != 0 && parent != i) {         // Ispitivanje da li postoji prelaz na cvor [i], i da li je [i] parent trenutnom cvoru

                    log(`Cvor ${i} zadovoljava uslove, i ubacujemo ga u niz rezultata`);
                    temp = {};
                    temp[`${cvor}-${i}`] = problem[cvor][i];
                    res.push(temp);

                    log(`Da li je sledeca dubina(${dubina - 1}) kraj? ${dubina - 1 > 0}`);
                    if (dubina - 1 > 0) {
                        log(`Poziva se funkcija djeca sa parametrima: djeca(${i}, ${dubina - 1}, ${cvor})`)
                        temp = djeca(i, dubina - 1, cvor);
                        res.push(...temp);
                        log(res);
                    }

                }
            }

        }
        log(`Funkcija zavrsena sa rezultatom: ${res}`)
        return res;
    }

    for (let i = 0; true; i++) {            // Beskonacna petlja

        mapa[i] = [];                       //Kreiraj prazan niz za nivo [i]

        temp = {};                          //Dodijeli mu tezinu 0 za pocetni cvor
        temp[start] = 0;
        mapa[i].push(temp);

        temp = djeca(start, i, start);      // Pronalazenje cvorova do kojih se moze doci iz starta, koristeci dubinu [i]
        mapa[i] = [...mapa[i], ...temp];    // Nadovezi djecu u niz rjesenja za nivo [i]

        if (i == dubina) {                  // Slucaj kojim se prekida izvrsavanje petlje
            console.log(mapa);
            steps = [...formatSteps()];
            return;
        }
        continue;
        // Struktura mape
        // mapa = {
        //     "0": [ {"3": 0} ],
        //     "1": [ {"3": 0}, {"3-0": 1}, {"3-2": 4}, {"3-5": 9}, {"3-7": 9} ],
        //     "2": [ {"3": 0}, {"3-0": 1}, {"0-1": 9}, {"0-6": 9}, {"0-7": 4}, {"0-9": 3}, {"3-2": 4}, ... ],
        //     "3": [ {"3": 0}, {"3-0": 1}, {"0-1": 9}, {"1-2": 6}, {"1-4": 4} ... ],
        // }
    }
}

const unmark = () => {                          // Ukloni sve oznake sa elemenata koji se nalaze u nizu [marked]
    let nodes;
    for (let i = 0; i < marked.length; i++) {
        nodes = marked[i].split('-');
        markGraph(nodes, false);
    }
    marked = [];
}

function next() {                               // Na klik odradi sledeci korak

    const process = (id) => {   // Procesuiraj step

        if (id == 'clear') {    // Uklanjanje oznake ako je to sledeci korak
            unmark()
            return;
        }

        let nodes = id.split('-');
        if (nodes.includes('' + cilj)) {    // U koliko grana vodi do cilja
            found = true;
        }

        marked.push(id);    // Dodaj u niz oznacenih elemenata
        markGraph(nodes, true);
    }

    let cilj = parseInt(document.getElementById("end").value);
    if (found) {

        step = steps.filter(e => e != 'clear')      // Uklanjanje clear stringova iz niza koraka
        for (let i = 0; i < step.length; i++) {
            if(step[i].split('-').includes('' + cilj)){     // Pronalazenje indeksa koraka koji vodi do cilja
                step = i + 1;
                break;
            }
        }

        Swal.fire(      // Prikaz poruke
            'Found',
            `Solution found on step:${step}`,
            'success'
        ).then(() => {      // Restartovanje grafika
            step = 0;
            found = false;
            unmark();
            marked = [];
        })
        return;
    }
    if (!steps[step]) {     // U koliko dodjemo do kraja niza koraka
        Swal.fire(
            'Not found',
            `Solution not found!`,
            'error'
        )
    }
    document.querySelector('.target-div').textContent = steps[step];    // Prikazivanje koraka korisniku
    process(steps[step]);
    step++;
}