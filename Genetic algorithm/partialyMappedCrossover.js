let par1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let par2 = [9, 3, 7, 8, 2, 6, 5, 1, 4];
let res = new Array(par1.length).fill(0);
// let pos1 = 3;
// let pos2 = 7;
let pos1;
let pos2;
console.log(par1);
console.log(par2);

function generate() {
    pos1 = parseInt(Math.random() * 10);
    pos2 = parseInt(Math.random() * 10);

    if (pos1 > pos2) {
        let temp = pos1;
        pos1 = pos2;
        pos2 = temp;
    }

    if (pos1 == pos2 || (Math.abs(pos1 - pos2) < 2)) generate()
}

generate();
console.log(`Pozicije su ${pos1} i ${pos2}`);

// Prepisivanje elemenata u opsjegu
for (let i = 0; i < (pos2 - pos1); i++) {
    res[pos1 + i] = par1[pos1 + i];
}


function loop(newPos, res, par2) {
    // Ako u rezultatu na indeksu vrijednosti parent
    if (res[par2.indexOf(newPos)] == 0) {
        res[par2.indexOf(newPos)] = par2[res.indexOf(newPos)];
        return;
    }
    loop(res[par2.indexOf(newPos)], res, par2);
}

for (let i = 0; i < (pos2 - pos1); i++) {

    // U koliko se vec nalazi u rezultatu
    if (res.includes(par2[pos1 + i])) continue

    // U koliko se ne nalazi u rezultatu uzmi vrijednost na toj poziciju
    let newPos = res[pos1 + i];
    // Iterativno nalazimo poziciju na koju treba smjestiti element
    loop(newPos, res, par2)
}

// Prepisivanje ostalih elemenata u rezultujuci niz ako se ne nalaze u rezultatu
for (let i = 0; i < res.length; i++) {
    if (res[i] == 0) {
        for (let j = 0; j < par2.length; j++) {
            if (!res.includes(par2[j])) {
                res[i] = par2[j]
                break;
            };
        }
    }
}

console.log(res);

