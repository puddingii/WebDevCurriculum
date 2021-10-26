import DropdownList from "./manageList/dropdownItem.js";
import NavBar from "./manageList/navBar.js";
import NoteButton from "./noteButton.js";
import NoteTextarea from "./noteTextarea.js";

export default class Notepad {
	#noteNameList = new Array();
	#userEmail = "";
	#openTabs;
	newFileCnt = 0;
	notepadStorage = new NotepadStorage();
	userStorage = new UserStorage();
	textareaForm = document.getElementById("textareaForm");
	noteFormDiv = document.getElementById("noteFormDiv");
	
	// 데이터 가져온 뒤 private변수에 저장
    constructor() { 
		this.noteTextarea = new NoteTextarea("textareaForm", "textareaLabel");
		this.dropdownList = new DropdownList("dropdownMenu");
		this.navbarList = new NavBar("navContainer");
	}

	set noteNameList(noteNameList) {
		this.#noteNameList = noteNameList;
	}
	get noteNameList() {
		return this.#noteNameList;
	}
	get openTabs() {
		return this.#openTabs;
	}
	getNoteById(noteId = this.noteTextarea.noteId) {
		return this.#noteNameList.find((element) => element.id === noteId);
	}
	getNoteIndexById(noteId = this.noteTextarea.noteId) {
		return this.#noteNameList.findIndex((element) => element.id === noteId);
	}
	// 데이터 불러오는 초기화함수
	async initNotepad(currentUserId) {
		const allData = await new NotepadStorage(currentUserId).loadContent();
		const { endTitle, openTab } = allData.pop();
		openTab ? this.#openTabs = openTab.split(',').map( Number ) : this.#openTabs = [];
		this.#userEmail = currentUserId;
		this.noteTextarea.noteId = allData.length ? endTitle : 0;
		this.#noteNameList = allData;
		this.#noteNameList.forEach((list) => list["isSaved"] = true);
		this.noteTextarea.noteName = this.noteTextarea.noteId ? this.getNoteById().title : "";
		this.#noteNameList.sort((a, b) => a.id - b.id);
	}

	// textarea의 변경이 감지되었을 때 label을 재설정해주는 함수.
	setMonitorLabel(labelValue, idOfLabel= "textareaLabel") {
		const label = document.getElementById(idOfLabel);
		const current = this.getNoteById();
		if(labelValue) label.innerText = labelValue;
		else label.innerText = current.isSaved ? "저장됨." : "저장 안됨.";
	}

    // Dropdown에 아이템과 아이템이벤트 추가
	addDropdownItem(value, currentId) { 
		const itemInfo = {
			className: "",
			id: "",
            dataset: {
				key: "currentid",
				value: currentId
			}
        };
        const linkInfo = {
            className: "dropdown-item",
			id: "",
            href: "#",
            dataset: {
                key: "currentid",
                value: currentId
            },
            text: value
        };
		const dropdownItem = this.dropdownList.initItem(itemInfo, linkInfo);
		if(dropdownItem) {
			this.clickDropdownAndLoadValue(dropdownItem);
			dropdownMenu.appendChild(dropdownItem);
		}
	}

	// Dropdown 이벤트 처리
	clickDropdownAndLoadValue(item) {
		const handleLoadValue = async (e) => {
			const currentId = parseInt(e.target.dataset.currentid);
			const items = document.querySelectorAll(".notelink");

			// navBar에 없을 시 navBar에 추가
			if(!this.navbarList.isItemInList(items, currentId)) {
				this.addItemAtList(e.target.innerText, currentId);
			}
			this.clickListAndSaveLog(currentId);
		}
		item.addEventListener("click", handleLoadValue);
	}

	// 리스트에 있는 아이템 클릭시 기존에 적어둔 값 저장, 클릭한 리스트의 값 표시, 현재 가르키고 있는 note갱신
	clickListAndSaveLog(clickedId) {
		const getBeforeValue = this.getNoteIndexById();
		noteFormDiv.classList.remove("disNone");

		if(getBeforeValue !== -1) {
			if(this.#noteNameList[getBeforeValue].content !== textareaForm.value) { 
				this.#noteNameList[getBeforeValue].isSaved = false;
			}
			this.#noteNameList[getBeforeValue].content = textareaForm.value; // notelist에서 해당 content값 수정
		}
		this.navbarList.toggleItem(`noteId${clickedId}`, "a.notelink");
		this.noteTextarea.noteId = clickedId; // 클릭한 거 가르키기
		this.noteTextarea.noteName = this.getNoteById().title;
		if(!this.#openTabs.find(element => element === clickedId)) this.#openTabs.push(clickedId);
		
		const getAfterValue = this.getNoteIndexById(clickedId);
		this.noteTextarea.loadValue("saveAsInput", this.#noteNameList[getAfterValue].title, this.#noteNameList[getAfterValue].content);
		this.setMonitorLabel();
		console.log(this.#openTabs);
	}

	// 리스트 클릭 이벤트등록
	setClickListEvent(list) {
		const handleList = async (e) => {
			this.clickListAndSaveLog(parseInt(e.target.dataset.currentid));
		}
		list.addEventListener("click", handleList);
	}

	// noteName값으로 header쪽의 리스트 생성
	addItemAtList(value, id) {
		if(!value) return;
		const itemInfo = {
            className: "nav-item notetab",
            id: `noteList${id}`,
			dataset: {
				key: "",
				value: "",
			},

        };
        const linkInfo = {
            className: "nav-link notelink",
			id: `noteId${id}`,
            dataset: {
				key: "currentid",
                value: id
            },
			href: "#",
            text: value
        };
		const item = this.navbarList.initItem(itemInfo, linkInfo);
		this.setClickListEvent(item); // 클릭이벤트

		this.navbarList.myList.appendChild(item);
	}

	// 파일 만들때 난수 생성해서 이름짓고 리스트추가(저장 안된상태) id값 수정필요함.
	clickNewFile() {
		const openBtn = document.getElementById("openFile");
		const handleNewFile = (e) => {
			const random = `tmp${Math.floor(Math.random()*1000000+1)}`;
			const id = `${newFileCnt}`;
			this.#noteNameList.push({
				id,
				email: this.#userEmail,
				title: random,
				content: "",
				isSaved: false,
			});
			this.addItemAtList(random, id);
			this.navbarList.toggleItem(`noteId${id}`, "a.notelink");
			this.clickListAndSaveLog(id);
			this.noteTextarea.loadValue("saveAsInput", random);
			this.setMonitorLabel();
		}
		openBtn.addEventListener("click", handleNewFile);
	}

	// textarea+Button부분을 없앤다.(display: none)
	closeNotepad() {
		noteFormDiv.classList.add("disNone");

		const note = document.getElementById(`noteList${this.noteTextarea.noteId}`);
		this.noteTextarea.noteId = "";
		this.noteTextarea.noteName = "";
		note.remove();
	}

	// 버튼을 눌렀을 때 이벤트 처리.(textarea에 있는 value값을 가지고 저장함.)
	setButtonWithData(type, classOfBtn) {
		const buttonController = new NoteButton(type);
		const btn = buttonController.setButton(classOfBtn);
		const textareaValue = () => {
			const textValue = document.getElementById("textareaForm");
			return {  //id 부분 다시 나중에 확인할 것 asdf 
				id: this.noteTextarea.noteId,
				email: this.#userEmail,
				title: this.noteTextarea.noteName,
				content: textValue.value,
				isSaved: true,
			};
		}

		let actionOfBtn;
		switch(type) { 
			// 저장할 때 이벤트. 가르키고 있는 노트를 저장한 노트의 이름으로 바꾸고 드롭다운목록에 없다면 추가해줌. 
			case "save":
				actionOfBtn = async (e) => {
					const noteData = textareaValue();
					const response = await this.notepadStorage.saveContent(noteData.id, noteData.email, this.noteTextarea.noteName, textareaForm.value);
					if(response.status !== 201)  {
						this.setMonitorLabel(`처리오류 - Response status code : ${response.status}`);
						return;
					}
					this.addDropdownItem(noteData.title, noteData.id); // dropdown목록 확인후 추가
					const indexOfItem = this.getNoteIndexById();
					if(indexOfItem !== -1) {
						this.#noteNameList[indexOfItem] = noteData;
					} else {
						this.#noteNameList.push(noteData);
						this.#openTabs.push(noteData.id);
					}
					this.setMonitorLabel("저장됨.");
				}
				break;
			// 삭제할 때 이벤트. 해당하는 데이터 삭제와 동시에 리스트와 드롭다운 목록에서 제거
			case "delete":
				actionOfBtn = async (e) => {
					const response = await this.notepadStorage.deleteContent(this.noteTextarea.noteId, this.#userEmail);
					if(response.status !== 201)  {
						this.setMonitorLabel(`처리오류 - Response status code : ${response.status}`);
						return;
					}
					this.dropdownList.deleteDropdownItem(this.noteTextarea.noteId, "dropdownMenu");
					this.closeNotepad();
					const opentabId = this.#openTabs.findIndex((element) => element === this.noteTextarea.noteId);
					this.#openTabs.splice(opentabId, 1);
					this.#noteNameList = this.#noteNameList.filter((element) => element.title !== this.noteTextarea.noteId);
				}
				break;
			// 다른이름저장할 때 이벤트. 다른이름으로 저장 칸을 내용을 토대로 저장.
			case "saveAs":
				actionOfBtn = async (e) => {
					const noteData = textareaValue();
					noteData.title = document.getElementById("saveAsInput").value;;
					const response = await this.notepadStorage.saveAsContent(this.#userEmail, noteData.title, textareaForm.value);
					if(response.status === 400)  {
						this.setMonitorLabel(`처리오류 - Response status code : ${response.status}`);
						return;
					}
					noteData.id = response.noteId;
					this.addDropdownItem(noteData.title);
					this.#noteNameList.push(noteData);
					this.addItemAtList(noteData.title, noteData.id);
					this.clickListAndSaveLog(noteData.id);
				}
				break;
			// 닫을 때 이벤트
			default:
				actionOfBtn = (e) => {
					const opentabId = this.#openTabs.findIndex((element) => element === this.noteTextarea.noteId);
					this.#openTabs.splice(opentabId, 1);
					this.closeNotepad();
				}
		}
		btn.addEventListener("click", actionOfBtn);
		return btn;
	}

	async saveOpenNote() {
		await this.userStorage.saveOpenNote(this.#userEmail, this.#openTabs, this.noteTextarea.noteId);
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
		saveAsInput.value = this.noteTextarea.noteId ? this.getNoteById().title : "";

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
		if(!this.noteTextarea.noteId) noteForm.classList.add("disNone");
		noteForm.id = "noteFormDiv";

		const noteNameIndex = this.getNoteById();
        const noteTextarea = noteNameIndex ? this.noteTextarea.initArea(noteNameIndex.content) : this.noteTextarea.initArea();
        noteForm.appendChild(noteTextarea);
		
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