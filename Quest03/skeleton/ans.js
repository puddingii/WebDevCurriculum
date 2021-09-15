let value = prompt();

const setStar = (end, idx) => {
    let str = ""
    for(i = 0; i < end; i+=1) {
        str += idx;
    }
    return str;
}

for(let i = 1; i <= value; i+=1) {
    let str = ""
    str += setStar(value - i, " ");
    str += setStar(i*2-1, "*");

    console.log(str);
}