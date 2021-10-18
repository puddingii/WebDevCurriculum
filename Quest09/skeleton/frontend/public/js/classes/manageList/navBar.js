import MyList from "./myList.js";

export default class NavBar extends MyList {
    constructor(idOfList) {
        super(idOfList);
    }

    isItemInList(items, id) {
        let isTitleInList = false;
        items.forEach((element) => {
            if(parseInt(element.dataset.currentid) === id) {
                isTitleInList = true;
                return;
            }
        });
        return isTitleInList;
    }
}