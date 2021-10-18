import MyList from "./myList.js";

export default class DropdownList extends MyList {
    constructor(idOfList) {
        super(idOfList);
    }

	initItem(itemInfo, linkInfo) { 
		const dropdownMenu = document.getElementById(this.idOfList);
		const dropdownItems = dropdownMenu.querySelectorAll("a");
		let isExisted = false;
		dropdownItems.forEach((item) => { 
			if(parseInt(item.dataset.currentid) === itemInfo.dataset.value) isExisted = true;
		});
		if(isExisted) return;

		return super.initItem(itemInfo, linkInfo);
	}

	// Dropdown에 있는 아이템 삭제 *
	deleteDropdownItem(id) {
		const dropdownList = document.getElementById(this.idOfList);
		const dropdownItems = dropdownList.querySelectorAll("li");
		dropdownItems.forEach((item) => { 
			if(parseInt(item.dataset.currentid) === id) item.remove();
		});
	}
}