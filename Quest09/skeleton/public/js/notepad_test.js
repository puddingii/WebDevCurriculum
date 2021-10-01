class NoteButton {
    #type;
	constructor(type) {
        this.#type = type;
    }
    get type() {
        return this.#type;
    }

    // 버튼을 만들고 각 버튼에 맞는 이벤트 처리
	setButtons(className, btnType) {
		const submitBtn = document.createElement("button");
		submitBtn.type = "button";
		submitBtn.className = className;
		submitBtn.innerText = btnType;
		switch(btnType) {
			case "close":
				submitBtn.type = "button";
				this.clickClose(submitBtn);
				break;
			case "save":
				this.clickSave(submitBtn);
				break;
			case "delete":
				this.clickDelete(submitBtn);
				break;
			default:
				this.clickDifSave(submitBtn);
		}

		return submitBtn;
	}
}

class Notepad extends NoteButton{
    #noteName;
	constructor(noteName) {
        super(type);
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

    // 저장, 다른이름저장, 닫기 버튼 관리
	setButtonGroup() {
		const btnGroup = document.createElement("div");
		btnGroup.id = "btnGroup";
		const saveBtn = super.setButton("btn btn-outline-primary","save");
		const saveDifBtn = super.setButton("btn btn-outline-primary","saveAs");
		const deleteBtn = super.setButton("btn btn-outline-danger","delete");
		const closeBtn = super.setButton("btn btn-outline-danger","close");
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

class NotepadHeader {
    #notepads = [];
    constructor() {}

    get notepads() {
        return this.#notepads;
    }
    set notepads(notepads) {
        this.#notepads = notepads;
    }

    // Dropdown에 localStorage내용물을 긁어와서 표시
	addDropdownMenu(value) {
		const dropdownMenu = document.querySelector(".dropdown-menu");
		const dropdownItem = document.createElement("li");
		const itemLink = document.createElement("a");
		itemLink.className = `Dropdown${value} dropdown-item`;
		itemLink.href="";
		itemLink.innerText= value;
		dropdownItem.appendChild(itemLink);
		dropdownMenu.appendChild(dropdownItem);
	}

    // haeder에 있는 리스트에 notepad이름들 추가
	setListBtn(noteName) {
		const noteList = document.createElement("li");
		noteList.className = "nav-item notetab";

		const noteLink = document.createElement("a");
		noteLink.className = "nav-link notelink";
		noteLink.ariaCurrent = "page";
		noteLink.href= "#";
		noteLink.dataset.currentid = noteName;
		noteLink.innerText = noteName;
		noteList.appendChild(noteLink);
		
		return noteList;
	}

    // 
}

class MyWindow {
	constructor() {}

}
