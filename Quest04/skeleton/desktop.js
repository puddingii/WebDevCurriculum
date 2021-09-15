const folders = [];
const icons = [];
for(let i =0; i<50; i++) {
	folders.push({
		fName: `폴더${i}`,
		iName: `icon${i}`
	});
	icons.push(`icon${i+51}`);
}

class Icon {
	/* TODO: Icon 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	#name;
	#width;
	#height;
	constructor(name="null") {
		this.#name = name;
		this.#width = "40px";
		this.#height = "40px";
	}

	get name() {
		return this.#name;
	}
	set name(n) {
		this.#name = n;
	}
	get width() {
		return this.#width;
	}
	get height() {
		return this.#height;
	}

};

class Folder extends Icon {
	/* TODO: Folder 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	#fName;
	constructor(fName, iName) {
		super(iName);
		this.#fName = fName;
	}
	get fName() {
		return this.#fName;
	}
	set fName(name) {
		this.#fName = name;
	}
};

class Window {
	/* TODO: Window 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	#folders;
	#icons;
	#positionX = 10;
	#positionY = 10;
	constructor(iCount, fCount) {
		const setFolders = [];
		const setIcons = [];
		for(let i=0; i<iCount; i+=1) {
			setIcons.push(new Icon(icons[i], icons[i]));
		}
		for(let i=0; i<fCount; i+=1) {
			setFolders.push(new Folder(folders[i].fName, folders[i].iName));
		}
		this.#folders = setFolders;
		this.#icons = setIcons;
	}
	// get folders() {
	// 	return this.#folders;
	// }
	// set folders(folders) {
	// 	this.#folders = folders;
	// }
	// get icons() {
	// 	return this.#icons;
	// }
	// set icons(icons) {
	// 	this.#icons = icons;
	// }

	initContent() {
		const childs = []
		for(let i of this.#icons.concat(this.#folders)) {
			const div = this.buildIcon(i);
			this.setDragMotion(div,1);
			if(i instanceof Folder) {
				const handleDbclick = (e) => {
					const div2 = document.createElement("div");
					div2.className = "drag newContent";
					div2.innerText = e.target.parentNode.childNodes[1].innerText;
					this.setDragMotion(div2,2);
					desk.appendChild(div2);
				}
				div.addEventListener("dblclick", handleDbclick);
			}
			childs.push(div);
		}
		return childs;
	}

	setDragMotion(div, y) {
		const handleDrag = (e) => {
			div.style.left = e.pageX-div.offsetWidth/2+"px" ;
			div.style.top = e.pageY-div.offsetHeight/y+"px";
		}
		const handleIconMousedown = (e) => {
			div.addEventListener("mousemove", handleDrag);
			const handleIconMouseup = (e) => {
				div.removeEventListener("mousemove", handleDrag);
			}
			div.addEventListener("mouseup", handleIconMouseup);
		}
		div.addEventListener("mousedown", handleIconMousedown);
		div.ondragstart = function() {
			return false;
		}
	}

	buildIcon(icon) {
		const div = document.createElement("div");
		div.className = "drag";
		div.style.left = this.#positionX + "px";
		div.style.top = this.#positionY + "px";
		if (this.#positionY <= 700) {
			this.#positionY += 70;
		} else {
			this.#positionY = 10;
			this.#positionX += 70;
		}
		const iconImg = document.createElement("img");
		const p = document.createElement("p");
		iconImg.src = "http://gdimg.gmarket.co.kr/1733830715/still/280";
		iconImg.className = "iconImg";
		iconImg.style.width = icon.width;
		iconImg.style.height = icon.height;
		p.innerText = icon.fName || icon.name;
		div.appendChild(iconImg);
		div.appendChild(p);
		
		return div;
	}
};

class Desktop extends Window{
	/* TODO: Desktop 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	#myName;
	constructor(fCount, iCount, myName) {
		super(fCount, iCount);
		this.#myName = myName;
	}

	get myName() {
		return this.#myName;
	}
	set myName(name) {
		this.#myName = name;
	}
};