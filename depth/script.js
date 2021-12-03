let processed = [];
let goal = 6;
const matrix = [
    [0, 4, 0, 5, 0, 0, 0, 3], 
    [4, 0, 2, 6, 0, 0, 0, 0], 
    [0, 2, 0, 0, 0, 0, 0, 0], 
    [5, 6, 0, 0, 2, 0, 0, 10], 
    [0, 0, 0, 2, 0, 4, 0, 0], 
    [0, 0, 0, 0, 4, 0, 3, 0], 
    [0, 0, 0, 0, 0, 3, 0, 0], 
    [3, 0, 0, 10, 0, 0, 0, 0], 

];
let cost = 0;

// Ispisivanje toka izvrsavanja
function display(input) {
    console.log(input);
    document.querySelector(".table").innerHTML += `<tr><td>${input}</td></tr>`;
}

function find(node) {

    // Da li je proslijedjeni cvor vec procesuiran
    if(processed.includes(node)){
        return;
    }

    // Ubacivanje proslijedjenog cvora u niz procesuiranih, kreiranje praznog niza za child cvorove ovog cvora
    processed.push(node);
    let children = [];

    // Prolazak kroz prelaze proslijedjenog cvora
    for(let i = 0; i < matrix[node].length; i++){

        // Ako ima prelaz i ako prelaz nije na cvor koji je vec procesuiran
        if(matrix[node][i] != 0 && !processed.includes(i)) {
            
            // Dodavanje novog cvora u niz childova
            children.push(i);
        }
    }

    display(`Node ${node} ima djecu: ${children.length == 0 ? "nema djece, vrati se nazad" : children}`);
    
    // Prolaz kroz niz childova
    for(let i = 0; i < children.length; i++) {

        if(processed.includes(children[i])){
            return
        }

        display(`Dodajem tezinu ${matrix[node][children[i]]} od ${node} do ${children[i]} u ukupan cost`)
        cost += matrix[node][children[i]];
        display(`Ispitujem da li child: ${children[i]} predstavlja cilj: ${goal} ? ${children[i] == goal}`)

        // Da li je child cilj
        if(children[i] == goal) {
            display("Cilj pronadjen");
            display(`Cijena pretrage po dubini je ${cost}`)
            return;
        }else{
            display(`Pozivam funkciju nad childom ${children[i]}`)

            // Pozovi funkciju nad childom
            find(children[i]);
        }
    }
    return;
}

find(7)