let value = prompt();

const drawStar = (end, idx) => {
    let str = ""
    for(i = 0; i < end; i+=1) {
        str += idx;
    }
    return str;
}

for(let i = 1; i <= value; i+=1) {
    let str = ""
    str += drawStar(value - i, " ");
    str += drawStar(i*2-1, "*");

    console.log(str);
}