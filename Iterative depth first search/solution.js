const fun = (parent, el, array, dubina) => {
    console.log(`Poziv: parent = ${parent} ; element = ${el}, dubina = ${dubina}`);
    if(dubina == 0) return [];
    let children = [...new Set(array.filter((e) => {return ((e.split('-')[0] == el) || (e.split('-')[0] == el)) && (e.split('-')[1] != parent) && (e != el)}))];
    let res = [];
    for(let i = 0; i < children.length; i++) {
        if(dubina == 4) {
            console.log(`Children petlja: ${children[i]}`);
            console.log("Children.length: " + children.length);
        } 
        let temp = {
            text: { name: children[i].split('-')[1]},
            children: [...fun(el, children[i].split('-')[1], array, dubina - 1)]
        }
        res.push(temp)
    }
    return res;
}

document.querySelector("h1").innerHTML += `${sessionStorage.getItem("found") == "true" ? "Putanja pronadjena": "Putanja nije pronadjena" }<br>${sessionStorage.getItem("start")} -> ${sessionStorage.getItem("cilj")}`
obj = JSON.parse(sessionStorage.getItem("obj"));
let processed = [];

function tree(container, data) {
    var simple_chart_config = {
        chart: {
            container: container,
            scrollbar: 'native',
        },
        nodeStructure: data
    };
    var my_chart = new Treant(simple_chart_config);
}

const getChildren = (parent, array, depth) => {
    if (depth == 0 || processed.includes(parent)) return [];
    processed.push(parent)
    let temp = array.filter((e) => {
        return (Object.keys(e)[0].indexOf(parent) == 0) && (parent.length != Object.keys(e)[0].length)
    });
    let res = [];
    for (let i = 0; i < temp.length; i++) {
        tmp = {
            text: { name: Object.keys(temp[i])[0].split("-")[1] },
            children: [...getChildren(Object.keys(temp[i])[0].split("-")[1], array, depth - 1)]
        }
        res.push(tmp);
    }
    return res;
};

for (let i = 0; i < Object.keys(obj).length; i++) {
    document.querySelector('.row').innerHTML += `<div class="col-12"><h1 class="text-center">Nivo ${i + 1} </h1><div id="tree-${i}" class="my-5 tree"></div></div>`
    processed = [];
    let res = {
        text: { name: sessionStorage.getItem("start") },
        children: [...fun(null, sessionStorage.getItem("start"), obj[i].map(e => Object.keys(e)[0]), i)]
    }
    tree(`#tree-${i}`, res);
};