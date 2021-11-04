function formatData(edges) {

    var newArr = new Array();
    edges.forEach((singleData, index, array) => {
        var ind = 0;
        if (newArr.some(e => ((e.to == singleData.to) && (e.from == singleData.from)))) {
            ind++;
            var thisData = newArr[newArr.findIndex(e => ((e.to == singleData.to) && (e.from == singleData.from)))];
            if (parseInt(thisData.label) > parseInt(singleData.label)) {
                thisData.label = singleData.label;
            }
        }
        if (ind == 0) {
            newArr.push(singleData);
        }
    })

    var problem = new Object();
    newArr.forEach((element, index) => {
        if (!(element.from in problem)) {
            problem[element.from] = new Object();
        }
        problem[element.from][element.to] = parseInt(element.label);
    })
    return problem
}



// Generisanje nasumicnog broja u odredjenom opsegu
function between(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

// Funkcija za generisanje nasumicnog grafika
function draw() {
    var brojTacaka = document.querySelector("#generate").value;
    nodes = new Array({ id: "pocetak", label: "pocetak" }, { id: "cilj", label: "cilj" });
    edges = new Array({ from: "pocetak", to: 1, label: "1" }, { from: Math.ceil((Math.random() * 100) % brojTacaka), to: "cilj", label: "1" });
    var temp = 0;
    for (var i = 0; i < brojTacaka; i++) {
        if (i == 0) {
            temp = temp + i + 2;
        }
        nodes[i + 2] = { id: i, label: i.toString() };
        for (var i1 = 0; i1 < 3; i1++) {
            edges[temp] = { from: i, to: between(i + 1, brojTacaka - 2), label: Math.ceil(Math.random() * 10).toString() };
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
        edges: { arrows: { to: { enabled: true } } }
    };
    network = new vis.Network(container, data, options);
}






// const problem = {
//     A: { C: 4, D: 2 },
//     B: { A: 8, D: 7 },
//     C: { F: 6 },
//     D: { G: 7, H: 2, C:2 }
// };

let cilj = "";
let start = "A";

let trenutniCvorovi = {};
let dubina = 0;

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
        for (let cvor in trenutniCvorovi[nivo]) {
            // console.log(`Ispitujem da li je cilj: ${cilj} == cvor ${cvor}`);
            if (cvor == cilj) {
                console.log(`Rjesenje pronadjeno na dubini ${nivo}!`);
            } else {
                console.log("NOT FOUND ");
            }
        }
    }
}

function putanja() {
    start = "1";
    cilj = "5";
    problem = formatData(edges);
    trenutniCvorovi[dubina] = new Object();
    trenutniCvorovi[dubina][start] = 0;

    for (let cvor in trenutniCvorovi[dubina]) {
        if (cvor == cilj) {
            console.log(`Cilj pronadjen na dubini ${dubina}, start je : ${start}, cilj je ${cilj}`);
        }
    }

    let i = 0;
    while(i < 10){
        trazi();
        dodajDjecu();
        i++;
    }
    console.log(trenutniCvorovi);

}