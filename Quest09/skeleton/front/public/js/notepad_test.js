class NoteButton {
    #type;
	constructor(type) {
        this.#type = type;
    }
    get type() {
        return this.#type;
    }

    // 버튼을 생성후 반환.
	setButton(className) {
		const submitBtn = document.createElement("button");
		submitBtn.type = "button";
		submitBtn.className = className;
		submitBtn.id = this.#type;
		submitBtn.innerText = this.#type;

		return submitBtn;
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
    monitorTextarea(textarea, labelId, text) {
        const handleTextarea = (e) => {
            document.getElementById(labelId).innerText = text;
        }
        textarea.addEventListener("input", handleTextarea);
    }

    // 텍스트 적을곳 생성
	initTextarea(value = "") {
		const noteArea = document.createElement("textarea");
		noteArea.className = "form-control";
        noteArea.id = "textareaForm";
        noteArea.value = value;
		this.monitorTextarea(noteArea, "textareaLabel", "저장 안됨.");

		return noteArea;
	}

	// textarea value 설정
	loadTextareaValue(textId, inputId, value = "") {
		const noteArea = document.getElementById(textId);
		noteArea.value = value;

		const saveAsInput = document.getElementById(inputId);
		saveAsInput.value = this.#noteName;
	}
}

class Notepad extends NotepadForm{
	#noteNameList = [];
	textareaForm = document.getElementById("textareaForm");
	noteFormDiv = document.getElementById("noteFormDiv");
	
	// 데이터 가져온 뒤 private변수에 저장
    constructor() {
		return (async() => {
			const allData = await new MyLocalStorage().loadContent();
			const endTitle = allData.pop().endTitle;
			super(allData.length !== 0 ? endTitle : "");
			this.#noteNameList = allData;
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

	// Dropdown에 있는 아이템 삭제
	deleteDropdownItem(id, classOfMenu) {
		const dropdownMenu = document.querySelector(classOfMenu);
		const dropdownItems = dropdownMenu.querySelectorAll("li");
		dropdownItems.forEach((item) => { 
			if(item.dataset.currentid === id) item.remove();
		});
	}

    // Dropdown에 아이템 추가
	addDropdownItem(value, classOfMenu) {
		const dropdownMenu = document.querySelector(classOfMenu);
		const dropdownItems = dropdownMenu.querySelectorAll("a");
		let isExisted = false;
		dropdownItems.forEach((item) => { 
			if(item.dataset.currentid === value) isExisted = true;
		});
		if(isExisted) return;

		const dropdownItem = document.createElement("li");
		dropdownItem.dataset.currentid = value;
		const itemLink = document.createElement("a");
		itemLink.className = "dropdown-item";
		itemLink.dataset.currentid = value;
		itemLink.href="#";
		itemLink.innerText= value;

		dropdownItem.appendChild(itemLink);
		this.setDropdownEvent(dropdownItem);
		dropdownMenu.appendChild(dropdownItem);
	}

	// Dropdown 이벤트 처리
	setDropdownEvent(item) {
		const handleLoadValue = async (e) => {
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
			const listValue = this.#noteNameList.find((element) => element.title === title);
			super.loadTextareaValue("textareaForm", "saveAsInput", listValue.content.text);
		}

		item.addEventListener("click", handleLoadValue);
	}

	// 리스트에 있는 아이템 클릭시 기존에 적어둔 값 저장, 클릭한 리스트의 값 표시
	clickList(currentid) {
		const getBeforeValue = this.#noteNameList.findIndex((element) => element.title === this.noteName);
		noteFormDiv.classList.remove("disNone");

		if(getBeforeValue !== -1) this.#noteNameList[getBeforeValue].content.text = textareaForm.value; // notelist에서 해당 content값 수정
		this.toggleList(`noteName${currentid}`, "a.notelink");
		this.noteName = currentid; // 클릭한 거 가르키기
		
		const getAfterValue = this.#noteNameList.findIndex((element) => element.title === currentid);
		super.loadTextareaValue("textareaForm", "saveAsInput", this.#noteNameList[getAfterValue].content.text);
	}

	// 리스트 클릭 이벤트등록
	setClickListEvent(list) {
		const handleList = async (e) => {
			this.clickList(e.target.dataset.currentid);
		}
		list.addEventListener("click", handleList);
	}

    // haeder에 있는 리스트에 notepad이름들 추가
	setNotepadHead(name) {
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
		const noteLinks = document.querySelectorAll(classOfItems); 
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
		const item = this.setNotepadHead(value);
		this.setClickListEvent(item); // 클릭이벤트

		const navContainer = document.getElementById(classOfList);
		navContainer.appendChild(item);
		this.toggleList(`noteName${value}`, "a.notelink");
	}

	// 파일 만들때 난수 생성해서 이름짓고 리스트추가(저장 안된상태)
	clickNewFile() {
		const openBtn = document.getElementById("openFile");
		const handleNewFile = (e) => {
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
			this.loadTextareaValue("textareaForm", "saveAsInput");
		}
		openBtn.addEventListener("click", handleNewFile);
	}

	// textarea부분을 없앤다.(display: none)
	closeNotepad() {
		noteFormDiv.classList.add("disNone");

		const note = document.getElementById(`noteList${this.noteName}`);
		this.noteName = "";
		note.remove();
	}

	// 버튼을 눌렀을 때 이벤트 처리.(textarea에 있는 value값을 가지고 저장함.)
	setButtonWithData(type, classOfBtn) {
		const buttonController = new NoteButton(type);
		const btn = buttonController.setButton(classOfBtn);
		const textLabel = document.getElementById("textareaLabel");
		const loadTextareaValue = () => {
			return {  //id 부분 다시 나중에 확인할 것 asdf 
				title: this.noteName,
				content: {
					text: textareaForm.value,
					id: this.#noteNameList[this.#noteNameList.length]
				}
			};
		}
		
		let actionOfBtn;
		switch(type) {
			case "save":
				actionOfBtn = async (e) => {
					const noteData = loadTextareaValue();
					const response = await this.myLocalStorage.saveContent(this.noteName, textareaForm.value);
					if(response.status !== 201)  {
						textLabel.innerText = `처리오류 - Response status code : ${response.status}`;
						return;
					}
					this.addDropdownItem(this.noteName, ".dropdown-menu"); // dropdown목록 확인후 추가
					const indexOfItem = this.#noteNameList.findIndex((element) => element.title === this.noteName);
					indexOfItem !== -1 ? this.#noteNameList[indexOfItem] = noteData : this.#noteNameList.push(noteData);
					textLabel.innerText = "저장됨.";
				}
				break;
			case "delete":
				actionOfBtn = async (e) => {
					const response = await this.myLocalStorage.deleteContent(this.noteName);
					if(response.status !== 201)  {
						textLabel.innerText = `처리오류 - Response status code : ${response.status}`;
						return;
					}
					this.deleteDropdownItem(this.noteName, ".dropdown-menu");
					this.closeNotepad();
					this.#noteNameList = this.#noteNameList.filter((element) => element.title !== this.noteName);
					textLabel.innerText = "저장됨.";
				}
				break;
			case "saveAs":
				actionOfBtn = async (e) => {
					const noteData = loadTextareaValue();
					const saveAsInput = document.getElementById("saveAsInput").value;
					const response = await this.myLocalStorage.saveAsContent(saveAsInput, textareaForm.value);
					if(response.status !== 201)  {
						textLabel.innerText = `처리오류 - Response status code : ${response.status}`;
						return;
					}
					this.addDropdownItem(saveAsInput, ".dropdown-menu");
					noteData.title = saveAsInput;
					this.#noteNameList.push(noteData);
					this.addItemAtList("navContainer", saveAsInput);
					textLabel.innerText = "저장됨.";
				}
				break;
			default:
				actionOfBtn = (e) => {
					this.closeNotepad();
				}
		}
		btn.addEventListener("click", actionOfBtn);
		return btn;
	}

	// 저장, 다른이름저장, 닫기 버튼 관리
	setButtonGroup() {
		const btnGroup = document.createElement("div");
		btnGroup.id = "btnGroup";

		const saveBtn = this.setButtonWithData("save", "btn btn-outline-primary");
		const saveAsBtn = this.setButtonWithData("saveAs", "btn btn-outline-primary");
		const deleteBtn = this.setButtonWithData("delete", "btn btn-outline-danger");
		const closeBtn = this.setButtonWithData("close", "btn btn-outline-danger");
		
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

    // textarea와 버튼들을 합치고 보여주는 기능.
    setNotepadForm(mainSection) {
        const noteForm = document.createElement("div");
        noteForm.className = "form-floating";
		if(!this.noteName) noteForm.classList.add("disNone");
		noteForm.id = "noteFormDiv";

		const noteNameIndex = this.#noteNameList.find((element) => element.title === this.noteName);
        const textArea = noteNameIndex ? super.initTextarea(noteNameIndex.content.text) : super.initTextarea();
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
