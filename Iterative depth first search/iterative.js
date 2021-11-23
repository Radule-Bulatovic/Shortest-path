function err(str) {
    Swal.fire(
        'Error',
        str,
        'error'
    );
}

function adjacencyMatrix(edges) {

    let newArr = {};
    for (let i = 0; i < graph.nodes.length; i++) {
        newArr[graph.nodes[i].id] = {};
        for (let j = 0; j < graph.nodes.length; j++) {
            newArr[graph.nodes[i].id][graph.nodes[j].id] = 0;
        }
        let temp = edges.filter((e) => (e.from == graph.nodes[i].id || e.to == graph.nodes[i].id) && (e.from != e.to));
        for (let j = 0; j < temp.length; j++) {
            newArr[graph.nodes[i].id][temp[j].to != graph.nodes[i].id ? temp[j].to : temp[j].from] = temp[j].label
        }
    }
    return newArr
}

function draw() {

    let start = document.getElementById("start").value;
    let cilj = document.getElementById("end").value;
    sessionStorage.removeItem("obj");
    sessionStorage.removeItem("found");
    sessionStorage.removeItem("start");
    sessionStorage.removeItem("cilj");
    sessionStorage.setItem("obj", JSON.stringify(mapa));
    sessionStorage.setItem("start", start);
    sessionStorage.setItem("found", found);
    sessionStorage.setItem("cilj", cilj);
    window.open('solution.html', '_blank').focus();

}

function refresh() {
    sessionStorage.removeItem("data");
    location.reload();
}

function save() {
    sessionStorage.removeItem("data");
    sessionStorage.setItem("data", JSON.stringify(graph))
    location.reload();
}

function load() {
    sessionStorage.removeItem("data");
    let temp = {
        "nodes": [
            {
                "id": "A",
                "x": -269.196533203125,
                "y": -143,
                "label": "A"
            },
            {
                "id": "B",
                "x": -136.196533203125,
                "y": -147,
                "label": "B"
            },
            {
                "id": "C",
                "x": -184.196533203125,
                "y": -255,
                "label": "C"
            },
            {
                "id": "D",
                "x": -249.196533203125,
                "y": 6,
                "label": "D"
            },
            {
                "id": "E",
                "x": -99.196533203125,
                "y": 1,
                "label": "E"
            },
            {
                "id": "F",
                "x": 44.803466796875,
                "y": 1,
                "label": "F"
            },
            {
                "id": "G",
                "x": 137.803466796875,
                "y": -70,
                "label": "G"
            },
            {
                "id": "S",
                "x": -365.196533203125,
                "y": -252,
                "label": "S"
            }
        ],
        "edges": [
            {
                "from": "B",
                "to": "D",
                "id": "B-D",
                "label": "6"
            },
            {
                "from": "A",
                "to": "D",
                "id": "A-D",
                "label": "5"
            },
            {
                "from": "C",
                "to": "B",
                "id": "C-B",
                "label": "2"
            },
            {
                "from": "D",
                "to": "E",
                "id": "D-E",
                "label": "2"
            },
            {
                "from": "A",
                "to": "B",
                "id": "A-B",
                "label": "4"
            },
            {
                "from": "E",
                "to": "F",
                "id": "E-F",
                "label": "4"
            },
            {
                "from": "S",
                "to": "A",
                "id": "S-A",
                "label": "3"
            },
            {
                "from": "F",
                "to": "G",
                "id": "F-G",
                "label": "3"
            },
            {
                "from": "S",
                "to": "D",
                "id": "S-D",
                "label": "10"
            }
        ]
    }
    sessionStorage.setItem("data", JSON.stringify(temp))
    location.reload();
}

let container = document.getElementById("mynetwork");
let graph = JSON.parse(sessionStorage.getItem("data")) || {"nodes": [],"edges": []};
let options = {
    manipulation: {
        addNode: function (data, callback) {
            Swal.fire({
                title: 'Naziv cvora:',
                input: 'text',
                inputPlaceholder: 'Unesite naziv cvora',
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    data.label = `${result.value}`;
                    data.id = `${result.value}`;
                    callback(data);
                    graph.nodes.push(data)
                }
            })
        },
        addEdge: function (data, callback) {
            Swal.fire({
                title: 'Tezinski faktor:',
                input: 'number',
                inputPlaceholder: 'Unesite tezinski faktor',
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    data.id = `${data.from}-${data.to}`;
                    data.label = `${result.value}`;
                    callback(data);
                    graph.edges.push(data)
                }
            })
        },
        deleteNode: (data, callback) => {
            graph.nodes = graph.nodes.filter((e) => { return e.id != data.nodes[0] })
            if (data.edges.length != 0) {
                graph.edges = graph.edges.filter((e) => {
                    for (let i = 0; i < data.edges.length; i++) {
                        if (data.edges[i] == e.id)
                            return false
                    }
                    return true
                })
            }
            callback(data)
        },
        deleteEdge: (data, callback) => {
            graph.edges = graph.edges.filter((e) => { return e.id != data.edges[0] })
            callback(data)
        }
    },
    physics: {
        enabled: false,
    }
};
network = new vis.Network(container, graph, options);
let found = false;
let mapa = {};

//====================================================================================================================================
//====================================================================================================================================


function path() {                               // Funkcija za formiranje mape pretrage, poziva se na dugme "Generate level map"


    if (graph.nodes.length == 0 || graph.edges.length == 0) {   // Validacija
        err(`Greska u grafiku!`);
        return;
    }
    let start = document.getElementById("start").value;
    if (!start) {   // Validacija
        err(`Morate unijeti start!`);
        return;
    };
    let cilj = document.getElementById("end").value;
    if (!cilj) {    // Validacija
        err('Morate unijeti cilj!');
        return;
    }
    let dubina = parseInt(document.getElementById("depth").value);
    if (!dubina) {  // Validacija
        err(`Morate unijeti dubinu pretrage!`);
        return;
    }

    found = false;
    const problem = adjacencyMatrix(graph.edges);   // Matrica prelaza
    const cvorovi = network.body.data.nodes.getIds();   // Svi cvorovi grafika


    const djeca = (cvor, dubina, parent) => {       // Funkcija koja za proslijedjeni cvor, dubinu i parent vrace mapu

        let res = [];       // Niz u kojem cemo smjestati rezultate

        if (dubina == 0) return res;  // Dubina se iterativno smanjuje i na kraju ce biti 0

        for (let i = 0; i < cvorovi.length; i++) {        // Iteriranje kroz cvorove

            if (problem[cvor][cvorovi[i]] != 0 &&   // Ako postoji prelaz sa cvora na cvor[i]
                (parent != cvorovi[i])  // Ako nije parent
            ) {

                temp = {};
                temp[`${cvor}-${cvorovi[i]}`] = problem[cvor][cvorovi[i]];
                res.push(temp);
                if (cvorovi[i] == cilj) {
                    console.log("Pronadjena");
                    found = true;
                    return res;
                }

                temp = djeca(cvorovi[i], dubina - 1, cvor);
                res.push(...temp);
            }
            
            if (found) return res;

        }
        return res;
    }

    for (let i = 0; i < dubina; i++) {

        if (found) break;
        temp = {};
        temp[start] = 0;
        mapa[i] = [temp];                       //Kreiraj prazan niz za nivo [i]
        temp = djeca(start, i, null);      // Pronalazenje cvorova do kojih se moze doci iz starta, koristeci dubinu [i]
        mapa[i] = [...mapa[i], ...temp];    // Nadovezi djecu u niz rjesenja za nivo [i]

    }

    console.log(mapa);
    draw();
    return;
}