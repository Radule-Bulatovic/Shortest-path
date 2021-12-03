const queen = '<i class="fas fa-crown fa-lg"></i>';
matrix = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
]

for (let i = 0; i < 8; i++) {
    pos = (parseInt(Math.random() * 10) % 8);
    document.querySelector(`.row:nth-child(${i + 1}) .field:nth-of-type(${pos + 1})`).innerHTML += queen;
    matrix[i][pos] = 'x';
}
// console.log(matrix);

function numOfAttacks(matrix, i1, j1, arr) {
    let res = 0;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            // if(arr.includes(`${i}${j}`)) console.log(`Niz: ${arr} sadrzi ${i}${j}, preskace se tacka`);
            if (i == i1 && j == j1) continue;
            if (
                    ((i == i1 || j == j1) || (i1 - j1 == i - j || i1 + j1 == i + j))
                    && matrix[i][j] == 'x' && !arr.includes(`${i}${j}`)
                ) {
                // console.log((i == i1 || j == j1) ? `Pozicije su u ravni` : (i1 - j1 == i - j || i1 + j1 == i + j) ? `pozicije su u dijagonali` : `nista`);
                // console.log(`kol:${i1} red:${j1} XX kol:${i} red:${j}`);
                matrix[i][j];
                res++;
            }
        }
    }
    return res;
}

function heuristic(i1, j1) {
    let tempMatrix = [...matrix];
    tempMatrix[i1] = [0,0,0,0,0,0,0,0];
    tempMatrix[i1][j1] = 'x';
    let checked = []
    let res = 0;
    // console.log(JSON.parse(JSON.stringify(tempMatrix)));
    // console.log(JSON.parse(JSON.stringify(checked)));
    for (let i = 0; i < tempMatrix.length; i++) {
        for (let j = 0; j < tempMatrix[i].length; j++) {
            if (tempMatrix[i][j] == 'x')
                res = res + numOfAttacks(tempMatrix, i, j, checked);
            checked.push(`${i}${j}`);
        }
    }
    return res;
}

for(let i = 0; i < matrix.length; i++) {
    for(let j = 0; j < matrix.length; j++) {
        if(matrix[i][j] != 'x') {
            // console.log(`Nova tacka ${i} ${j}`);
            document.querySelector(`.row:nth-child(${i + 1}) .field:nth-of-type(${j + 1})`).innerHTML += heuristic(i, j);
        }
    }
}


// console.log(heuristic());