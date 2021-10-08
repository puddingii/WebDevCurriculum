import { LocalStorage } from "node-localstorage";

export class StorageUtil extends LocalStorage{
    constructor(text) {
        super(text);
    }

    // 특정 id값에 대한 value값을 가져와서 JSON형식으로 반환
    getValueToJson(text) {
        return JSON.parse(super.getItem(text));
    }

    // storage안에 있는 모든 아이템들 가져오기. 
    getStorageItems(isId){
        let dataArr = Array.from({length: this.length}, (_, i) => {
            const title = super.key(i);
            if(title !== "userData") {
                const content = this.getValueToJson(title); // string형식의 value값을 JSON형식으로 바꾼뒤 반환
                return isId ? content.id : { title, content };
            }
        });
        dataArr = dataArr.filter((element) => element !== undefined);
        return dataArr;
    }

    // 받아온 array에서 최대값을 반환.
    getMaxId(arr) {
        return arr.reduce((a, b) => Math.max(parseInt(a), parseInt(b)));
    }
}
