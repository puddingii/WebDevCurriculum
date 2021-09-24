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

	// 폴더 이벤트 처리
	setFolderEvent(iconBox) {
		const handleDbclick = (e) => {
			const newBox = document.createElement("div");
			const currentWindow = document.querySelector("div.window:not(.disnone)");
			newBox.className = "drag newContent";
			newBox.innerText = e.target.dataset.iconname ?? e.target.innerText;
			new MyWindow().setDragMotion(newBox,2);
			currentWindow.appendChild(newBox);
		}
		iconBox.addEventListener("dblclick", handleDbclick);
	}
};

class MyWindow {
	#folders;
	#icons;
	#positionX = 10;
	#positionY = 10;
	constructor(iconCount, folderCount) {
		const setIcons = Array.from({length: iconCount}, (_, i) => new Icon(`아이콘${i}`));
		const setFolders = Array.from({length: folderCount}, (_, i) => new Folder(`폴더${i}`,`아이콘${i+iconCount}`));
		this.#folders = setFolders;
		this.#icons = setIcons;
	}

	// 아이콘, 폴더를 화면안에 셋팅하는 함수
	buildContent() {
		const iconBoxes = []
		const iconsAndFolders = this.#icons.concat(this.#folders);
		for(let iconAndFolder of iconsAndFolders) {
			const iconBox = this.buildIconBox(iconAndFolder);
			this.setDragMotion(iconBox,1);
			if(iconAndFolder instanceof Folder) {
				iconAndFolder.setFolderEvent(iconBox);
			}
			iconBoxes.push(iconBox);
		}

		return iconBoxes;
	}

	// Drag & Drop 기능
	setDragMotion(iconBox, y) {
		let z_index;

		// 마우스를 눌렀을 때
		const handleIconMousedown = (e) => {
			// 요소를 움직여주는 기능
			const handleDrag = (e) => {
				iconBox.style.left = `${e.pageX-iconBox.offsetWidth/2}px`;
				iconBox.style.top = `${e.pageY-iconBox.offsetHeight/y}px`;
			}

			z_index = iconBox.style.zIndex;
			iconBox.style.zIndex = 9999;
			iconBox.style.position = 'absolute';
			iconBox.addEventListener("mousemove", handleDrag);

			// 마우스를 때면 드래그이벤트 삭제
			const handleIconMouseup = (e) => {
				iconBox.removeEventListener("mousemove", handleDrag);
				iconBox.style.zIndex = z_index;
			}
			window.addEventListener("mouseup", handleIconMouseup);
		}

		window.addEventListener("mousedown", handleIconMousedown);
		iconBox.ondragstart = () => {
			return false;
		}
	}

	// 아이콘이미지와 자리 셋팅
	buildIconBox(iconFolder) {
		const iconDiv = document.createElement("div");
		iconDiv.className = "drag";
		iconDiv.style.left = `${this.#positionX}px`;
		iconDiv.style.top = `${this.#positionY}px`;
		if (this.#positionY <= 700) {
			this.#positionY += 70;
		} else {
			this.#positionY = 10;
			this.#positionX += 70;
		}
		const iconImg = document.createElement("img");
		const iconText = document.createElement("p");
		iconImg.src = "http://gdimg.gmarket.co.kr/1733830715/still/280";
		iconImg.className = "iconImg";
		iconImg.style.width = `${iconFolder.width}px`;
		iconImg.style.height = `${iconFolder.height}px`;
		iconImg.dataset.iconname = iconFolder.folderName || iconFolder.name;
		iconText.innerText = iconFolder.folderName || iconFolder.name;
		iconDiv.appendChild(iconImg);
		iconDiv.appendChild(iconText);
		
		return iconDiv;
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

	// Desktop요소 배치를 위한 init
	initDesktop(isVisible) {
		const desk = document.querySelector(".desktop");
		const newWindow = document.createElement("div");
		newWindow.className = "window";

		const resultObject = super.buildContent();
		for(let obj of resultObject) {
			newWindow.appendChild(obj);
		}
		if(!isVisible) {
			newWindow.classList.add("disnone");
		}
		desk.appendChild(newWindow);
	}
};