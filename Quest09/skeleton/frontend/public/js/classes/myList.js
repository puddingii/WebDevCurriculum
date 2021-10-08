export default class MyList {
    #itemName;
    constructor(itemName = "") {
        this.#itemName = itemName;
    }

    get itemName() {
        return this.#itemName;
    }
    set itemName(itemName) {
        this.#itemName = itemName;
    }

    initItem(itemInfo, linkInfo) {
        if(!itemInfo) return;
        const item = document.createElement("li");
        item.className = itemInfo.className;
        item.id = itemInfo.id;
        item.dataset[itemInfo.dataset.key] = itemInfo.dataset.value;

        const itemLink = document.createElement("a");
        itemLink.className = linkInfo.className;
        itemLink.id = linkInfo.id;
        itemLink.innerText = linkInfo.text;
        itemLink.href = linkInfo.href;

        return item;
    }

    // list 토글 기능만 있음.
	toggleItem(eventTarget, classOfItems) {
		const noteLinks = document.querySelectorAll(classOfItems); 
		noteLinks.forEach((notelink) => {
			if(eventTarget !== notelink.id) {
				notelink.classList.remove("active");
			} else {
				notelink.classList.add("active");
			}
		})
    }
}