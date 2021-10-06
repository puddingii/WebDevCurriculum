class NoteButton {
    #type;
	myLocalStorage = new MyLocalStorage();
	constructor(type) {
        this.#type = type;
    }
    get type() {
        return this.#type;
    }

    // 버튼을 만들고 각 버튼에 맞는 이벤트 처리
	setButton(className) {
		const submitBtn = document.createElement("button");
		submitBtn.type = "button";
		submitBtn.className = className;
		submitBtn.id = this.#type;
		submitBtn.innerText = this.#type;
		switch(this.#type) {
			case "save":
				this.clickSave(submitBtn);
				break;
			case "delete":
				this.clickDelete(submitBtn);
				break;
			case "saveAs":
				this.clickSaveAs(submitBtn);
		}
		return submitBtn;
	}

	clickSave(btn) {
		const handleSave = async (e) => {
			const textarea = document.getElementById("textareaForm");
			const { 
				dataset: {currentid: title},
				value
			} = textarea;
			const response = await this.myLocalStorage.saveContent(title, value);
			if(response.status === 201) {
				location.reload();
			} else {
				alert("통신오류.");
			}
		}
		btn.addEventListener("click", handleSave);
	}

	clickDelete(btn) {
		const handleDelete = async (e) => {
			const textarea = document.getElementById("textareaForm");
			const { 
				dataset: {currentid: title},
			} = textarea;
			const response = await this.myLocalStorage.deleteContent(title)
			if(response.status === 200) {
				location.reload();
			} else {
				alert("통신오류.");
			}
		}
		btn.addEventListener("click", handleDelete);
	}

	clickSaveAs(btn) { 
		const handleSaveAs = async (e) => {
			const textarea = document.getElementById("textareaForm");
			const title = document.getElementById("saveAsInput").value;
			const response = await this.myLocalStorage.saveAsContent(title, textarea.value);
			if(response.status === 201) {
				location.reload();
			} else {
				alert("같은 이름의 파일이 있거나 통신오류입니다.");
			}
		}
		btn.addEventListener("click", handleSaveAs);
	}
}

class NotepadForm {
    #noteName;
	myLocalStorage = new MyLocalStorage();
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
            document.getElementById("textareaLabel").innerText = "저장 안됨."
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

		return noteArea;
	}

	// textarea value 설정
	loadTextareaValue(content = "") {
		const noteArea = document.getElementById("textareaForm");
		noteArea.value = content;
		noteArea.dataset.currentid = this.#noteName;

		const saveAsInput = document.getElementById("saveAsInput");
		saveAsInput.value = this.#noteName;
	}
}

class Notepad extends NotepadForm{
	#noteNameList = [];
    constructor(noteName = "") {
		return (async() => {
			super(noteName);
			this.#noteNameList = await new MyLocalStorage().loadContent();
			const endTitle = this.#noteNameList.pop().endTitle;
			this.noteName = this.#noteNameList.length !== 0 ? endTitle : "";
			this.#noteNameList.sort((a, b) => a.content.id - b.content.id);
			
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
	addDropdownItem(value, classOfMenu) {
		const dropdownMenu = document.querySelector(classOfMenu); // .dropdown-menu
		const dropdownItem = document.createElement("li");
		const itemLink = document.createElement("a");
		itemLink.className = `Dropdown${value} dropdown-item`;
		itemLink.href="#";
		itemLink.innerText= value;
		dropdownItem.appendChild(itemLink);
		this.clickDropdownItem(dropdownItem);
		dropdownMenu.appendChild(dropdownItem);
	}

	clickDropdownItem(item) {
		const handleLoadList = async (e) => {
			const title = e.target.innerText;
			const items = document.querySelectorAll(".notelink");
			let isTitleInList = false;
			items.forEach((element) => {
				if(element.dataset.currentid === title) {
					isTitleInList = true;
					return;
				}
			});
			if(!isTitleInList) this.addItemAtList("navContainer", title);
			this.clickList(title);
			super.loadTextareaValue(this.#noteNameList.find((element) => element.title === title).content.text);
		}

		item.addEventListener("click", handleLoadList);
	}

	clickList(currentid) {
		const getBeforeValue = this.#noteNameList.findIndex((element) => element.title === this.noteName);
		const noteDiv = document.getElementById("noteDiv");
		noteDiv.classList.remove("disNone");

		const textarea = document.getElementById("textareaForm");
		if(getBeforeValue !== -1) this.#noteNameList[getBeforeValue].content.text = textarea.value; // notelist에서 해당 content값 수정
		this.toggleList(`noteName${currentid}`, "a.notelink");
		this.noteName = currentid; // 클릭한 거 가르키기
		
		const getAfterValue = this.#noteNameList.findIndex((element) => element.title === currentid);
		super.loadTextareaValue(this.#noteNameList[getAfterValue].content.text); // textarea에 값 셋팅해야함
	}

	// 리스트 클릭 이벤트(값 찾아와서 textarea에 적용)
	setClickListEvent(list) {
		const handleList = async (e) => {
			this.clickList(e.target.dataset.currentid);
		}
		list.addEventListener("click", handleList);
	}

    // haeder에 있는 리스트에 notepad이름들 추가
	setTitle(name) {
		const noteList = document.createElement("li");
		noteList.className = "nav-item notetab";
		noteList.id = `noteList${name}`;

		const noteLink = document.createElement("a");
		noteLink.className = "nav-link notelink";
		noteLink.ariaCurrent = "page";
		noteLink.href= "#";
		noteLink.dataset.currentid = name;
		noteLink.id = `noteName${name}`;
		noteLink.innerText = name;
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
	addItemAtList(classOfList, value) {
		if(!value) return;
		const item = this.setTitle(value);
		this.setClickListEvent(item); // 클릭이벤트

		const navContainer = document.getElementById(classOfList);
		navContainer.appendChild(item);
		this.toggleList(`noteName${value}`, "a.notelink");
	}

	// 파일 만들때 난수 생성해서 이름짓고 리스트추가(저장 안된상태)
	clickNewFile() {
		const openBtn = document.getElementById("openFile");
		const handleOpenFile = (e) => {
			const random = `tmp${Math.floor(Math.random()*1000000+1)}`;
			this.#noteNameList.push({
				title: random,
				content: {
					text: "",
					id: this.#noteNameList[this.#noteNameList.length]
				}
			});
			this.addItemAtList("navContainer", random);
			this.clickList(random);
			this.loadTextareaValue();
		}
		openBtn.addEventListener("click", handleOpenFile);
	}

	// setButtonWithData(type, classOfBtn, data) {
	// 	const buttonController = new NoteButton(type);
	// 	const btn = noteButton.setButton(classOfBtn, data);
	// 	switch(type) {
	// 		case "save":
	// 			const handleSave = (e) => {
	// 				buttonController.clickSave(btn);

	// 			}
	// 			btn.addEventListener("click", handleSave);
	// 			break;
	// 		case "delete":
	// 			break;
	// 		case "saveAs":
	// 	}

	// 	return btn;
	// }

	// 저장, 다른이름저장, 닫기 버튼 관리
	setButtonGroup() {
		const btnGroup = document.createElement("div");
		btnGroup.id = "btnGroup";

		const textareaId = document.getElementById("textareaForm").dataset.currentid;
		const data = { title: this.noteName, textId: textareaId}
		const saveBtn = new NoteButton("save").setButton("btn btn-outline-primary", data);
		const saveAsBtn = new NoteButton("saveAs").setButton("btn btn-outline-primary", data);
		const deleteBtn = new NoteButton("delete").setButton("btn btn-outline-danger", data);
		const closeBtn = new NoteButton("close").setButton("btn btn-outline-danger", data);
		const handleClose = (e) => {
			const textarea = document.getElementById("noteDiv");
			textarea.classList.add("disNone");

			const item = document.getElementById(`noteList${this.noteName}`);
			this.noteName = "";
			item.remove();
		}
		closeBtn.addEventListener("click", handleClose);
		const saveAsInput = document.createElement("input");
		saveAsInput.type= "text";
		saveAsInput.className = "form-control";
		saveAsInput.id = "saveAsInput";
		saveAsInput.value = this.noteName;

		btnGroup.appendChild(saveBtn);
		btnGroup.appendChild(saveAsBtn);
		btnGroup.appendChild(deleteBtn);
		btnGroup.appendChild(closeBtn);
		btnGroup.appendChild(saveAsInput);

		return btnGroup;
	}

    // textarea + button
    setNotepadForm(mainSection) {
        const noteForm = document.createElement("div");
        noteForm.className = "form-floating";
		if(!this.noteName) noteForm.classList.add("disNone");
		noteForm.id = "noteDiv";

		const noteNameIndex = this.#noteNameList.findIndex((element) => element.title === this.noteName);
        const textArea = noteNameIndex !== -1 ? super.setTextarea(this.#noteNameList[noteNameIndex].content.text) : super.setTextarea();
        noteForm.appendChild(textArea);
		
        const detectLabel = document.createElement("label");
		detectLabel.innerText = "저장됨.";
		detectLabel.id = "textareaLabel";
        noteForm.appendChild(detectLabel);
		mainSection.appendChild(noteForm);

		const btnGroup = this.setButtonGroup();
        noteForm.appendChild(btnGroup);
		mainSection.appendChild(noteForm);
    }
}

class MyWindow {
	constructor() {}

	async initMyWindow() {
		const myNotepad = await new Notepad();
		myNotepad.addItemAtList("navContainer", myNotepad.noteName);
		const mainSection = document.querySelector("section.notepad");
		myNotepad.setNotepadForm(mainSection);
		myNotepad.clickNewFile();
		myNotepad.noteNameList.forEach((note) => {
			myNotepad.addDropdownItem(note.title ,".dropdown-menu");
		})
	}
}
