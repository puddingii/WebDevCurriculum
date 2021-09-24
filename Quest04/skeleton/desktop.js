class Icon {
	#name;
	#width = 40; // constructor안에서 밖으로 이동
	#height = 40;
	constructor(name="TempIcon") {
		this.#name = name;
	}

	// Getter & Setter
	get name() {
		return this.#name;
	}
	set name(n) {
		this.#name = n;
	}
	set width(wid) {
		this.#width = wid;
	}
	get width() {
		return this.#width;
	}
	set height(hei) {
		this.#height = hei;
	}
	get height() {
		return this.#height;
	}
};

class Folder extends Icon {
	#folderName;
	constructor(folderName, iconName) {
		super(iconName);
		this.#folderName = folderName;
	}

	// Getter & Setter
	get folderName() {
		return this.#folderName;
	}
	set folderName(name) {
		this.#folderName = name;
	}
};

class MyWindow {
	#folders;
	#icons;
	#positionX = 10;
	#positionY = 10;
	constructor(iconCount, folderCount) {
		const setFolders = [];
		const setIcons = [];
		let i = 0;
		for(; i<iconCount; i++) {
			setIcons.push(new Icon(`아이콘${i}`));
		}
		for(let j = 0; j<folderCount; j++) {
			setFolders.push(new Folder(`폴더${j}`, `아이콘${i+j}`));
		}
		this.#folders = setFolders;
		this.#icons = setIcons;
	}

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
					//parentNode변경필요. ?문법
					this.setDragMotion(div2,2);
					e.target.parentNode.parentNode.appendChild(div2);
				}
				div.addEventListener("dblclick", handleDbclick);
			}
			childs.push(div);
		}
		return childs;
	}

	setDragMotion(div, y) {
		let z_index;
		const handleDrag = (e) => { //template literals로 변경
			div.style.left = `${e.pageX-div.offsetWidth/2}px`;
			div.style.top = `${e.pageY-div.offsetHeight/y}px`;
		}// z-index
		const handleIconMousedown = (e) => {
			z_index = div.style.zIndex;
			div.style.zIndex = 9999;
			div.addEventListener("mousemove", handleDrag);
			const handleIconMouseup = (e) => {
				div.removeEventListener("mousemove", handleDrag);
				div.style.zIndex = z_index;
			}
			div.addEventListener("mouseup", handleIconMouseup);
		}
		div.addEventListener("mousedown", handleIconMousedown);
		div.ondragstart = () => { // function -> arrow function
			return false;
		}
	}

	buildIcon(icon) {
		const div = document.createElement("div");
		div.className = "drag";
		div.style.left = `${this.#positionX}px`;
		div.style.top = `${this.#positionY}px`;
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
		iconImg.style.width = `${icon.width}px`;
		iconImg.style.height = `${icon.height}px`;
		p.innerText = icon.folderName || icon.name;
		div.appendChild(iconImg);
		div.appendChild(p);
		
		return div;
	}
};

class Desktop extends MyWindow{
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