
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

function log(str) {
    let logging = true;
    if (logging) {
        console.log(JSON.parse(JSON.stringify(str)));
    }
}

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
            edges[temp] = { from: i, to: direction, label: Math.ceil(Math.random() * 10).toString() };
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



function path() {

    //Oznaci cvor sa id-jem
    const markNode = (id) => {
        graphNodes.update({ id: id, color: { background: "red" } })
    }

    //Oznaci granu izmedju dva cvora
    const markEdge = (from, to) => {
        let edge = edges.find((e) => ((e.from == from) && (e.to == to)) || ((e.from == to) && (e.to == from)));
        graphEdges.update({ from: edge.from, to: edge.to, color: { color: "red" } })
        graphEdges.update({ from: edge.from, to: edge.to, width: 3 })
        // graphEdges.update({from: to, to: from, color: "red"})
        // graphEdges.update({from: to, to: from, width: 3})
    }

    //Ukloni oznaku sa cvora sa id-jem;
    const unmarkAll = (id) => {
        graphNodes.update({ id: id, color: { background: "#97C2FC" } })
    }

    const cilj = parseInt(document.getElementById("end").value) || document.querySelector("#generate").value - 1;
    const start = parseInt(document.getElementById("start").value) || 0;
    const problem = formatData(edges);

    console.log(problem);

    const traziNaNivou = (maxNivo) => {
        let prosliNivo = [[]];
        let nivoi = {0: {}};
        let procesuirani = [];
        for (let i = 0; i < problem[0].length; i++) {
            if (!problem[0][i]) {
                continue;
            }
            nivoi[0][i] = problem[0][i];
            prosliNivo[0].push(i);
        }
        procesuirani.push(0);
        log(`prosliNivo su: ${prosliNivo}`);
        log("Stanje nivoa:");
        log(nivoi);
        for (let nivo = 1; nivo < maxNivo; nivo++) {
            log(`Na nivou: ${nivo}`);
            nivoi[nivo] = {};
            log(`Iteriram kroz prosli nivo: ${prosliNivo[nivo - 1]}`);
            prosliNivo[nivo] = [];
            if (nivo == problem.length) {
                return nivoi;
            }
            for (let i = 0; i < prosliNivo[nivo - 1].length; i++) {
                log(`Iteriram kroz matricu susjedstva na indeksu ${prosliNivo[nivo - 1][i]} : ${problem[prosliNivo[nivo - 1][i]]}`);
                for (let j = 0; j < problem[prosliNivo[nivo - 1][i]].length; j++) {
                    log(`Da li je 0 == ${problem[prosliNivo[nivo - 1][i]][j]} ili niz[${procesuirani}] sadrzi element ${j}`);
                    if (!problem[prosliNivo[nivo - 1][i]][j] || procesuirani.includes(j)) {
                        log(`Da`);
                        continue;
                    }
                    nivoi[nivo][j] = problem[prosliNivo[nivo - 1][i]][j];
                    log(`Ne`);
                    log(`Dodajem ${problem[prosliNivo[nivo - 1][i]][j]} u objekat nivoa ${nivoi[nivo]} na poziciji ${j}`);
                    log(nivoi);
                    prosliNivo[nivo].push(j);
                    log(`Dodajem ${j} nizu proslog nivoa ${prosliNivo[nivo]}`);
                }
                procesuirani.push(prosliNivo[nivo - 1][i]);
                log(`Dodajem ${prosliNivo[nivo - 1][i]} nizu procesuiranih cvorova [${procesuirani}]`);
            }
        }
        traziNaNivou(++maxNivo)
    }

    console.log(traziNaNivou(0));

}
