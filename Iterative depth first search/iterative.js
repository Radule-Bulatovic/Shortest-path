
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
function formatData() {
    let newArr = new Array();
    nodeNumber = parseInt(document.querySelector("#generate").value);
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
            if(i == j){
                newArr[i][j] = 0;
            }
        }
    }
    return newArr
}

// Generisanje nasumicnog broja u odredjenom opsegu
function between(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

//Oznaci cvor sa id-jem
function markNode(ID) {
    graphNodes.update({ id: ID, color: { background: "red" } })
}

//Oznaci granu izmedju dva cvora
function markEdge(from, to) {
    let edge = edges.find((e) => ((e.from == from) && (e.to == to)) || ((e.from == to) && (e.to == from)));
    graphEdges.update({ from: edge.from, to: edge.to, color: { color: "red" } })
    graphEdges.update({ from: edge.from, to: edge.to, width: 3 })
    // graphEdges.update({from: to, to: from, color: "red"})
    // graphEdges.update({from: to, to: from, width: 3})
}

//Ukloni oznaku sa cvora sa id-jem;
function unmarkAll(ID) {
    graphNodes.update({ id: ID, color: { background: "#97C2FC" } })
}

// Funkcija za generisanje nasumicnog grafika
function draw() {

    brojTacaka = document.querySelector("#generate").value;
    nodes = new Array();
    edges = new Array();
    var temp = 0;

    for (var i = 0; i < brojTacaka; i++) {
        nodes[i] = { id: i, label: i.toString() };
        for (var i1 = 0; i1 < between(1, brojTacaka - 1); i1++) {
            direction = between(0, brojTacaka - 1);
            if (edges.find(({ from, to }) => ((from == i) && (to == direction)) || ((from == direction) && (to == i)))) {
                continue;
            }
            edges[temp] = { from: i, to: direction, label: Math.ceil(Math.random() * 10).toString() };
            temp++;
        }
    }

    // Prikazivanje grafika
    graphNodes = new vis.DataSet(nodes);
    graphEdges = new vis.DataSet(edges);
    var container = document.getElementById("mynetwork");
    var data = {
        nodes: graphNodes,
        edges: graphEdges,
    };
    var options = {
        physics: {
            enabled: false,
        }
    };
    network = new vis.Network(container, data, options);
}


//Dodaje djecu cvorova na poslednjem nivou
function dodajDjecu() {
    dubina++;
    trenutniCvorovi[dubina] = new Object();
    let prosliNivo = Object.keys(trenutniCvorovi[dubina - 1]);
    for (i = 0; i < prosliNivo.length; i++) {
        let djeca = Object.keys(problem[prosliNivo[i]]);
        for (let i = 0; i < djeca.length; i++) {
            trenutniCvorovi[dubina][djeca[i]] = 1;
        }
    }
}

//Pretraga cilja u cvorovima koje smo do sada prosli
function trazi() {
    for (let nivo in trenutniCvorovi) {
        console.log(`Trazim na nivou ${nivo}:`);
        console.log(`Na nivou ${nivo} se nalazi cvor`);
        console.log(trenutniCvorovi[nivo]);
        for (let cvor in trenutniCvorovi[nivo]) {
            console.log(`Ispitujem da li je cilj: ${cilj} == cvor ${cvor}`);
            if (cvor == cilj) {
                console.log(`Rjesenje pronadjeno na dubini ${nivo}!`);
                return true;
            } else {
                console.log("NOT FOUND ");
            }
        }
    }
}

function dodajNivo() {
    let prosliNivo = Object.keys(trenutniCvorovi[dubina - 1]);
    console.log(prosliNivo);
    for (i = 0; i < prosliNivo.length; i++) {
        trenutniNivo = problem[prosliNivo[i]];
        console.log(trenutniNivo);
        for (j = 0; j < trenutniNivo.length; j++) {
            console.log( trenutniNivo[j] + " razlicito od 0");
            console.log(trenutniNivo[j] != 0);
            console.log( j + " nije u nizu " + obradjeniCvorovi);
            console.log(!(obradjeniCvorovi.includes(j)));
            if (trenutniNivo[j] != 0 && !(prosliNivo.includes(j.toString()) && !(obradjeniCvorovi.includes(j)) )) { 
                trenutniCvorovi[dubina][j] = trenutniNivo[j];
                obradjeniCvorovi.push(j);
            }
        }
    }
}

let cilj;
let start;

let trenutniCvorovi = {};
let obradjeniCvorovi = [];
let dubina = 0;

function path() {

    cilj = document.getElementById("end").value || brojTacaka - 1;
    start = parseInt(document.getElementById("start").value) || 0;
    problem = formatData(edges);
    console.log(problem);
    return
    // setTimeout(()=>{markNode(0)}, 2000);
    // setTimeout(()=>{markEdge(0,1)}, 2500);
    // setTimeout(()=>{markNode(1)}, 3000);
    // setTimeout(()=>{markEdge(0,2)}, 2000);
    // setTimeout(()=>{markNode(2)}, 4000);
    // setTimeout(()=>{markNode(3)}, 5000);
    trenutniCvorovi[dubina] = new Object();
    trenutniCvorovi[dubina][start] = 0;
    obradjeniCvorovi.push(start);
    let i = 0;
    while (true) {
        if(trazi()){
            break;
        }
        dubina++;
        trenutniCvorovi[dubina] = new Object();
        dodajNivo();
    }
    console.log(trenutniCvorovi);

}