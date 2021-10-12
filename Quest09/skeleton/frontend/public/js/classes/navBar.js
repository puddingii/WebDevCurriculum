import MyList from "./list.js";

export default class NavBar extends MyList {
    constructor(idOfList) {
        super(idOfList);
    }

    isItemInList(items, title) {
        let isTitleInList = false;
        items.forEach((element) => {
            if(element.dataset.currentid === title) {
                isTitleInList = true;
                return;
            }
        });
        return isTitleInList;
    }
}