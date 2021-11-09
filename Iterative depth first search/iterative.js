let rjesenje = {};
let steps = [];
let cilj;
let step = 0;
let marked = [];
let solution = 0;
let found = false;


// Generisi matricu susjedstava iz niza objekata
// [
//     { from: 0, to: 3, label: '1', id: '6074ed12-ee13-42df-ab48-291edc9c600a' },
//     { from: 0, to: 9, label: '6', id: 'f87cd441-6cb4-4845-b0c9-e3915061bd78' },
//     { from: 1, to: 2, label: '6', id: '2f7b7058-e934-4b00-8a02-16af73d52929' },
//     { from: 1, to: 6, label: '5', id: '7e8d659c-eefe-4497-879e-a1393a3a409c' }
//     .
//     .
//     .
// ]
function formatData(edges) {
    let newArr = new Array();
    let nodeNumber = parseInt(document.querySelector("#generate").value);
    for (let i = 0; i < nodeNumber; i++) {
        let temp = edges.filter((e) => e.from == i);
        newArr[i] = new Array(nodeNumber);
        newArr[i].fill(0, 0, nodeNumber);
        for (let j = 0; j < temp.length; j++) {
            newArr[i][temp[j].to] = parseInt(temp[j].label);
        }
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

// Markiranje i demarkiranje grana i cvorova
const markGraph = (from, to, markType) => {
    let edge = edges.find((e) => ((e.from == from) && (e.to == to)) || ((e.from == to) && (e.to == from)));
    graphEdges.update({ id: edge.from + "-" + edge.to, color: { color: markType ? 'red' : '#848484'}, width: markType ? 3 : 1})
    graphNodes.update({ id: from, color: { background: markType ? 'red' : "#97C2FC"} })
    graphNodes.update({ id: to, color: { background: markType ? 'red' : "#97C2FC"} })
}

// Funkcija za generisanje nasumicnog grafika
function draw() {

    // Generisanje nasumicnog broja u odredjenom opsegu
    const between = (min, max) => {
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

    // Prikazivanje grafika
    graphNodes = new vis.DataSet(nodes);
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

// Funkcija za formiranje pretrage po nivoima
function path() {

    const problem = formatData(edges);
    let start = parseInt(document.getElementById("start").value);
    let dubina = parseInt(document.getElementById("depth").value) || 2;

    const formatSteps = () => {
        levels = Object.keys(rjesenje);
        steps = [];
        for (let i = 0; i < levels.length; i++) {
            temp = rjesenje[levels[i]].map(e => {
                return Object.keys(e)[0]
            })
            steps = [...steps, ...temp];
        }

        let insertClear = [];
        for (let i = 0; i < steps.length; i++) {
            if (steps[i] == start) {
                insertClear.push(i);
            }
        }
        insertClear.reverse();
        insertClear.forEach(e => {
            steps.splice(e, 0, 'clear');
        })
        return steps;
    }

    const djeca = (cvor, dubina, parent) => {

        const log = (str) => {
            let logging = false;
            if (logging) {
                console.log(JSON.parse(JSON.stringify(str)));
            }
        }

        log(`Pozvana funkcija djeca: djeca(${cvor}, ${dubina})`);
        let res = [];

        if (dubina != 0) {

            for (let i = 0; i < problem[cvor].length; i++) {

                log(`Da li postoji prelaz na cvor ${i}? ${problem[cvor][i] != 0}`);
                if (problem[cvor][i] != 0) {
                    log(`Da li je parent(${parent}) razlicit od cvora(${i}) na koji imamo prelaz? ${parent != i}`)
                }
                if (problem[cvor][i] != 0 && parent != i) {
                    log(`Cvor ${i} zadovoljava, i ubacujemo ga u niz rezultata`);
                    temp = {};
                    temp[`${cvor}-${i}`] = problem[cvor][i];
                    res.push(temp);

                    if (dubina - 1 > 0) {
                        log(`Da li je sledeca dubina(${dubina - 1}) kraj? ${dubina - 1 > 0}`);
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


    for (let i = 0; true; i++) {

        //Kreiraj prazan niz na nivou [i]
        //Dodijeli mu tezinu 0 za pocetni cvor
        rjesenje[i] = [];
        temp = {};
        temp[start] = 0;
        rjesenje[i].push(temp);
        temp = djeca(start, i, start);
        rjesenje[i] = [...rjesenje[i], ...temp];

        if (i == dubina) {
            console.log(rjesenje);
            steps = [...formatSteps()];
            return;
        }
        continue;

    }

    /*
    {
        0: {2: 0},
        1: {2: 0, 2-1: 3, 2-6: 4},
        2: {2: 0, 2-1: 3, 2-1-0: 5, 2-1-3: 2, 2-1-4: 1, 2-1-6: 6, 2-6: 4, 2-6-0: 8, 2-6-1: 6, 2-6-3: 8, 2-6-4: 8, 2-6-5: 9 }
    }
    */
}

// Procesuiraj step
const process = (id) => {

    if (id == 'clear') {
        unmark()
        return;
    }
    solution++;
    let nodes = id.split('-');
    if (nodes.includes('' + cilj)) {
        found = true;
    }
    marked.push(id);
    if (nodes.length == 2) {
        markGraph(parseInt(nodes[0]), parseInt(nodes[1]), true)
    } else {
        graphNodes.update({ id: parseInt(nodes[0]), color: { background: "red" } })
    }
}

// Ukloni oznaku
const unmark = () => {
    let nodes;
    for (let i = 0; i < marked.length; i++) {
        nodes = marked[i].split('-');
        if(nodes.length == 2){
            markGraph(parseInt(nodes[0]), parseInt(nodes[1]), false)
        } else {
            graphNodes.update({ id: parseInt(nodes[0]), color: { background: "#97C2FC" } })
        }
    }
    marked = [];
}

// Na klik odradi sledeci korak
function next() {
    cilj = parseInt(document.getElementById("end").value);
    if (found) {
        Swal.fire(
            'Found',
            `Solution found on step:${step}`,
            'success'
        ).then(() => {
            step = 0;
            solution = 0;
            found = false;
            unmark();
            marked = [];
        })
        return;
    }
    if (!steps[step]) {
        Swal.fire(
            'Not found',
            `Solution not found!`,
            'error'
        )
    }
    process(steps[step]);
    step++;
}