class MyLocalStorage {
	constructor() {}

	async loadContent() {
		const response = await fetch("http://localhost:8000/api/loadAllData");
		const storage = await response.json();
		return storage;
	}

	// async getValueOfKey(key) {
	// 	const allData = await this.loadContent();
	// 	return allData.find((element) => element.title === key);
	// }
}

class NoteButton {
    #type;
	constructor(type) {
        this.#type = type;
    }
    get type() {
        return this.#type;
    }

    // 버튼을 만들고 각 버튼에 맞는 이벤트 처리
	setButtons(className) {
		const submitBtn = document.createElement("button");
		submitBtn.type = "button";
		submitBtn.className = className;
		submitBtn.innerText = this.#type;
		switch(this.#type) {
			case "close":
				submitBtn.type = "button";
				// this.clickClose(submitBtn);
				break;
			case "save":
				// this.clickSave(submitBtn);
				break;
			case "delete":
				// this.clickDelete(submitBtn);
				break;
			default:
				// this.clickDifSave(submitBtn);
		}

		return submitBtn;
	}
}

class Notepad {
    #noteName;
	constructor(noteName) {
        this.#noteName = noteName;
    }
    get noteName() {
        return this.#noteName;
    }
    set noteName(noteName) {
        this.#noteName = noteName;
    }

    // textarea생성과 textarea처리를 위한 버튼 생성
    monitorTextarea(textarea) {
        const handleTextarea = (e) => {
            textarea.querySelector("label").innerText = "저장 안됨."
        }
        textarea.addEventListener("input", handleTextarea);
    }

    // 텍스트 적을곳 셋팅
	setTextarea(content = "") {
		const noteArea = document.createElement("textarea");
		noteArea.className = "form-control";
        noteArea.id = "textareaForm";
        noteArea.dataset.currentid = this.#noteName;
        noteArea.value = content;
		this.monitorTextarea(noteArea);

		return textarea;
	}

	// textarea value 설정
	loadTextareaValue(content = "") {
		const noteArea = document.querySelector("textarea");
		noteArea.value = content;
		noteArea.dataset.currentid = this.#noteName;
	}

    // 저장, 다른이름저장, 닫기 버튼 관리
	setButtonGroup() {
		const btnGroup = document.createElement("div");
		btnGroup.id = "btnGroup";
		const saveBtn = new NoteButton("save").setButton("btn btn-outline-primary");
		const saveDifBtn = new NoteButton("saveAs").setButton("btn btn-outline-primary","saveAs");
		const deleteBtn = new NoteButton("delete").setButton("btn btn-outline-danger","delete");
		const closeBtn = new NoteButton("close").setButton("btn btn-outline-danger","close");
		const saveDifInput = document.createElement("input");
		saveDifInput.type= "text";
		saveDifInput.className = "form-control difInput";
		saveDifInput.value = this.#noteName;
		btnGroup.appendChild(saveBtn);
		btnGroup.appendChild(saveDifBtn);
		btnGroup.appendChild(deleteBtn);
		btnGroup.appendChild(closeBtn);
		btnGroup.appendChild(difInput);

		return btnGroup;
	}

    // textarea + button
    setNotepad() {
        const noteForm = document.createElement("div");
        noteForm.className = `form-floating disNone noteDiv`;
        const textArea = this.setTextarea();
        const btnGroup = this.setButtonGroup();
        const detectLabel = document.createElement("label");
		detectLabel.innerText = "저장됨.";

        noteForm.appendChild(textArea);
        noteForm.appendChild(detectLabel);
        noteForm.appendChild(btnGroup);

        return noteForm;
    }
}

class NotepadHeader extends Notepad{
	#noteNameList = [];
    constructor(noteName) {
		return (async() => {
			super(noteName);
			this.#noteNameList = await new MyLocalStorage().loadContent();

			return this;
		})();
	}

	set noteNameList(noteNameList) {
		this.#noteNameList = noteNameList;
	}
	get noteNameList() {
		return this.#noteNameList;
	}

    // Dropdown에 리스트들 표시
	addDropdownMenu(value, classOfMenu) {
		const dropdownMenu = document.querySelector(classOfMenu); // .dropdown-menu
		const dropdownItem = document.createElement("li");
		const itemLink = document.createElement("a");
		itemLink.className = `Dropdown${value} dropdown-item`;
		itemLink.href="";
		itemLink.innerText= value;
		dropdownItem.appendChild(itemLink);
		dropdownMenu.appendChild(dropdownItem);
	}

	// 리스트 클릭 이벤트(값 찾아와서 textarea에 적용)
	setClickList(list) {
		const handleList = async (e) => {
			const itemName = e.target.dataset.currentid;
			this.toggleList(itemName, "a.notelink");

			const getValue = this.#noteNameList.find((element) => element.title === itemName);
			super.loadTextareaValue(getValue.content); // textarea에 값 셋팅해야함
		}
		list.addEventListener("click", handleList);
	}

    // haeder에 있는 리스트에 notepad이름들 추가
	addTitleBtn() {
		const noteList = document.createElement("li");
		noteList.className = "nav-item notetab";

		const noteLink = document.createElement("a");
		noteLink.className = "nav-link notelink";
		noteLink.ariaCurrent = "page";
		noteLink.href= "#";
		noteLink.dataset.currentid = this.#noteName;
		noteLink.innerText = this.#noteName;
		noteList.appendChild(noteLink);
		
		return noteList;
	}

    // list 토글 기능만 있음.
	toggleList(eventTarget, classOfItems) {
		const noteLinks = document.querySelectorAll(classOfItems);  //a.notelink
		noteLinks.forEach((notelink) => {
			if(eventTarget !== notelink.id) {
				notelink.classList.remove("active");
			} else {
				notelink.classList.add("active");
			}
		})
	}

	// noteName값으로 header쪽의 리스트 생성
	addItemOfList() {
		// button & textarea setting
		const item = this.addTitleBtn();
		super.setClickList(item); // 클릭이벤트

		const navContainer = document.querySelector(".navContainer");
		navContainer.appendChild(item);
	}

	// 파일 만들때 난수 생성해서 이름짓고 리스트추가(저장 안된상태)
	clickNewFile() {
		const openBtn = document.getElementById("openFile");
		const handleOpenFile = (e) => {
			const random = `tmp${Math.floor(Math.random()*1000000+1)}`;
			this.#noteName = random;
			this.addItemOfList(); // header 생성 필요(textarea는 필요x).
			//this.setNoteDiv(random, "");
			//this.toggleList(`noteLink${random}`, "a.notelink");
		}
		openBtn.addEventListener("click", handleOpenFile);
	}
}

class MyWindow {
	constructor() {}

}
