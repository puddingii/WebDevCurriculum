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
	get folders() {
		return this.#folders;
	}
	set folders(folders) {
		this.#folders = folders;
	}
	get icons() {
		return this.#icons;
	}
	set icons(icons) {
		this.#icons = icons;
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