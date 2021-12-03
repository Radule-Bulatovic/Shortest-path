let processed = [];
start = 6;
goal = 6;
// https://graphonline.ru/en/
let matrix = [
    [0, 4, 0, 5, 0, 0, 0, 3], 
    [4, 0, 2, 6, 0, 0, 0, 0], 
    [0, 2, 0, 0, 0, 0, 0, 0], 
    [5, 6, 0, 0, 2, 0, 0, 10], 
    [0, 0, 0, 2, 0, 4, 0, 0], 
    [0, 0, 0, 0, 4, 0, 3, 0], 
    [0, 0, 0, 0, 0, 3, 0, 0], 
    [3, 0, 0, 10, 0, 0, 0, 0], 
];

function find(node) {
    if(processed.includes(node)){
        return;
    }
    processed.push(node);
    let children = [];

    for(let i = 0; i < matrix[node].length; i++){
        if(matrix[node][i] != 0 && !processed.includes(i)) {
            children.push(i);
        }
    }
    console.log(`Node ${node} ima djecu: ${children}`);
    for(let i = 0; i < children.length; i++) {
        if(children[i] == goal) {
            console.log("Goal found");
            return;
        }else{
            find(children[i]);
        }
    }
    return;
}