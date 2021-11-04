// Prikazivanje poruka u konzoli
function log(message) {
    const logging = true;
    if (logging) {
        console.log(message);
    }
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
//     start: {A: 5, B: 2},
//     A: {start: 1, C: 4, D: 2},
//     B: {A: 8, D: 7},
//     C: {D: 6, finish: 3},
//     D: {finish: 1},
//     finish: {}
// };

// Funkcija za pretragu grafika
function putanja() {

    var problem = formatData(edges);

    // Funkcija koja vrace susjednu tacku sa najmanjim tezinskim faktorom
    const lowestCostNode = (costs, processed) => {
        return Object.keys(costs).reduce((lowest, node) => {
            if (lowest === null || costs[node] < costs[lowest]) {
                if (!processed.includes(node)) {
                    lowest = node;
                }
            }
            return lowest;
        }, null);
    };

    // Funkcija koja vraca putanju sa najmanjim tezinskim faktorom do cilja
    const dijkstra = (graph, startNodeName = "pocetak", endNodeName = "cilj") => {

        // Promjenjiva za cuvanje najmanjeg tezinskog faktora za svaku tacku
        let costs = {};
        // Postavljanje tezinskog faktora za cilj na infinity
        costs[endNodeName] = "Infinity";
        // Dodavanje tezinskih faktora za cvorove spojene sa startnom tackom
        costs = Object.assign(costs, graph[startNodeName]);

        // Cuvanje tacke iz koje se moze doci do neke tacke najkracim putem
        const parents = { endNodeName: null };
        for (let child in graph[startNodeName]) {
            parents[child] = startNodeName;
        }

        // Vec obradjene tacke
        const processed = [];

        // Odredjivanje susjedne tacke sa najmanjim tezinskim faktorom
        let node = lowestCostNode(costs, processed);

        // Iteracija kroz tacke
        // Na kraju petlje se prebacujemo na sledecu tacku koja se ne nalazi u nizu procesuiranih tacaka
        while (node) {

            // Tezinski faktor trenutne tacke od pocetne tacke
            let cost = costs[node];
            // Tacke do kojih se moze doci iz trenutne tacke
            let children = graph[node];

            // Iteracija kroz tacke do kojih se moze doci
            for (let n in children) {
                //Preskakanje tacke u koliko je to tacka polazne putanje
                if (String(n) === String(startNodeName)) {
                    log("Nema potrebe da ispitujemo putanju ");
                } else {
                    log("Pocetna tacka: " + startNodeName);
                    log("Evaluacija tezinskog faktora do tacke " + n + " (iz trenutne tacke " + node + ")");
                    log("Zadnje poznati tezinski faktor: " + costs[n]);
                    // Tezinski faktor do novootkrivene tacke
                    let newCost = cost + children[n];
                    log("Novi tezinski faktor: " + newCost);
                    // Ispitivanje da li je novi tezinski faktor veci od proslog
                    if (!costs[n] || costs[n] > newCost) {
                        costs[n] = newCost;
                        parents[n] = node;
                        log("Korigovani tezinski faktori i putanja do tacke");
                    } else {
                        log("Postoji putanja sa manjim tezinskim faktorom");
                    }
                }
            }

            // Dodavanje tacke u niz procesuiranih tacaka
            processed.push(node);
            // Prelazak na sledecu najblizu neprocesuiranu tacku
            node = lowestCostNode(costs, processed);
        }

        // Formatiranje podataka
        let optimalPath = [endNodeName];
        let parent = parents[endNodeName];
        while (parent) {
            optimalPath.push(parent);
            parent = parents[parent];
        }
        optimalPath.reverse();

        const results = {
            distance: costs[endNodeName],
            path: optimalPath
        };
        
        return results;
    };

    var start = document.querySelector("#start").value;
    var end = document.querySelector("#end").value;
    var putanja = dijkstra(problem, start, end);
    prikaziPoruku(putanja);
}

// Funkcija koja formatira podatke o granama u adekvatan oblik
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

function prikaziPoruku(putanja) {
    if (putanja.distance == "Infinity") {
        str = "Ne postoji najkraca putanja do cilja, generisite novi grafik!"
    } else {
        str = "Najkraca putanja od pocetka do cilja je:<br>";
        putanja.path.forEach(e => {
            str = str + e + " -> ";
        })
        str = str.slice(0, str.length - 4) + "<br> Njegova duzina iznosi " + putanja.distance;
    }
    document.getElementById("target").innerHTML = str;
    return;
}