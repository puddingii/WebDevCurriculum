import DropdownList from "./dropdownItem.js";
import NavBar from "./navBar.js";
import NoteButton from "./noteButton.js";
import NoteTextarea from "./noteTextarea.js";

export default class Notepad {
	#noteNameList = [];
	#userEmail;
	myLocalStorage = new MyLocalStorage();
	textareaForm = document.getElementById("textareaForm");
	noteFormDiv = document.getElementById("noteFormDiv");
	
	// 데이터 가져온 뒤 private변수에 저장
    constructor() { 
		this.noteTextarea = new NoteTextarea("");
		this.dropdownList = new DropdownList("dropdownMenu");
		this.navbarList = new NavBar("navContainer");
	}

	set noteNameList(noteNameList) {
		this.#noteNameList = noteNameList;
	}
	get noteNameList() {
		return this.#noteNameList;
	}

	getLastItemId() {
		return this.#noteNameList[this.#noteNameList.length-1].id;
	}
	getNoteById(noteId = this.noteTextarea.noteId) {
		return this.#noteNameList.find((element) => element.id === noteId);
	}
	// 데이터 불러오는 초기화함수 *
	async initNotepad(currentUserId) {
		const allData = await new MyLocalStorage(currentUserId).loadContent();
		const { endTitle, openTab } = allData.pop();
		this.#userEmail = currentUserId;
		this.noteTextarea.noteId = allData.length ? endTitle : "";
		this.#noteNameList = allData;
		this.noteTextarea.noteName = this.getNoteById().title;
		this.#noteNameList.sort((a, b) => a.id - b.id);
	}

    // Dropdown에 아이템 추가 *
	addDropdownItem(value, currentId) { // key값에 value 값 변경해야함.(title->id)
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

			if(!this.navbarList.isItemInList(items, currentId)) this.addItemAtList(e.target.innerText, currentId);
			this.clickListAndSaveLog(currentId);
			
			const itemOfNavbar = this.getNoteById(currentId);
			this.noteTextarea.loadValue("textareaForm", "saveAsInput", itemOfNavbar.title,itemOfNavbar.content);
		}

		item.addEventListener("click", handleLoadValue);
	}

	// 리스트에 있는 아이템 클릭시 기존에 적어둔 값 저장, 클릭한 리스트의 값 표시 
	clickListAndSaveLog(currentid) {
		const getBeforeValue = this.#noteNameList.findIndex((element) => element.id === this.noteTextarea.noteId);
		noteFormDiv.classList.remove("disNone");

		if(getBeforeValue !== -1) this.#noteNameList[getBeforeValue].content = textareaForm.value; // notelist에서 해당 content값 수정
		this.navbarList.toggleItem(`noteId${currentid}`, "a.notelink");
		this.noteTextarea.noteId = currentid; // 클릭한 거 가르키기
		this.noteTextarea.noteName = this.getNoteById();
		
		const getAfterValue = this.#noteNameList.findIndex((element) => element.id === currentid);
		this.noteTextarea.loadValue("textareaForm", "saveAsInput", this.#noteNameList[getAfterValue].title, this.#noteNameList[getAfterValue].content);
	}

	// 리스트 클릭 이벤트등록
	setClickListEvent(list) {
		const handleList = async (e) => {
			this.clickListAndSaveLog(parseInt(e.target.dataset.currentid));
		}
		list.addEventListener("click", handleList);
	}

	// noteName값으로 header쪽의 리스트 생성 *
	addItemAtList(value, id) {
		if(!value) return;
		const itemInfo = {
            className: "nav-item notetab",
            id: `noteList${id}`,
			dataset: {
				key: "",
				value: "",
			}
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
		this.navbarList.toggleItem(`noteId${id}`, "a.notelink");
	}

	// 파일 만들때 난수 생성해서 이름짓고 리스트추가(저장 안된상태)
	clickNewFile() {
		const openBtn = document.getElementById("openFile");
		const handleNewFile = (e) => {
			const random = `tmp${Math.floor(Math.random()*1000000+1)}`;
			const id = this.getLastItemId() + 1;
			this.#noteNameList.push({
				id,
				email: this.#userEmail,
				title: random,
				content: "",
			});
			this.addItemAtList(random, id);
			this.clickListAndSaveLog(id);
			this.noteTextarea.loadValue("textareaForm", "saveAsInput", random);
		}
		openBtn.addEventListener("click", handleNewFile);
	}

	// textarea+Button부분을 없앤다.(display: none) *
	closeNotepad() {
		noteFormDiv.classList.add("disNone");

		const note = document.getElementById(`noteList${this.noteTextarea.noteId}`);
		this.noteTextarea.noteId = "";
		this.noteTextarea.noteName = "";
		note.remove();
	}

	// 버튼을 눌렀을 때 이벤트 처리.(textarea에 있는 value값을 가지고 저장함.) *
	setButtonWithData(type, classOfBtn) {
		const buttonController = new NoteButton(type);
		const btn = buttonController.setButton(classOfBtn);
		const textLabel = document.getElementById("textareaLabel");
		const textareaValue = () => {
			const textValue = document.getElementById("textareaForm");
			return {  //id 부분 다시 나중에 확인할 것 asdf 
				id: this.noteTextarea.noteId,
				email: this.#userEmail,
				title: this.noteTextarea.noteName,
				content: textValue.value,
			};
		}
		const setTextlabelValue = (value) => { textLabel.innerText = value; }

		let actionOfBtn;
		switch(type) {  // 싹다 고쳐야함.
			// 저장할 때 이벤트. 가르키고 있는 노트를 저장한 노트의 이름으로 바꾸고 드롭다운목록에 없다면 추가해줌. 
			case "save":
				actionOfBtn = async (e) => {
					const noteData = textareaValue();
					const response = await this.myLocalStorage.saveContent(this.noteTextarea.noteId, this.#userEmail, this.noteTextarea.noteName, textareaForm.value);
					if(response.status !== 201)  {
						setTextlabelValue(`처리오류 - Response status code : ${response.status}`);
						return;
					}
					this.addDropdownItem(this.noteTextarea.noteId); // dropdown목록 확인후 추가
					const indexOfItem = this.getNoteById();
					(indexOfItem !== -1) ? this.#noteNameList[indexOfItem] = noteData : this.#noteNameList.push(noteData);
					setTextlabelValue("저장됨.");
				}
				break;
			// 삭제할 때 이벤트. 해당하는 데이터 삭제와 동시에 리스트와 드롭다운 목록에서 제거
			case "delete":
				actionOfBtn = async (e) => {
					const response = await this.myLocalStorage.deleteContent(this.noteTextarea.noteId);
					if(response.status !== 201)  {
						setTextlabelValue(`처리오류 - Response status code : ${response.status}`);
						return;
					}
					this.dropdownList.deleteDropdownItem(this.noteTextarea.noteId, "dropdownMenu");
					this.closeNotepad();
					this.#noteNameList = this.#noteNameList.filter((element) => element.title !== this.noteTextarea.noteId);
					setTextlabelValue("저장됨.");
				}
				break;
			// 다른이름저장할 때 이벤트. 다른이름으로 저장 칸을 내용을 토대로 저장.
			case "saveAs":
				actionOfBtn = async (e) => {
					const noteData = textareaValue();
					noteData.title = document.getElementById("saveAsInput").value;;
					noteData.id = this.getLastItemId() + 1;
					const response = await this.myLocalStorage.saveAsContent(noteData.id, this.#userEmail, noteData.title, textareaForm.value);
					if(response.status !== 201)  {
						setTextlabelValue(`처리오류 - Response status code : ${response.status}`);
						return;
					}
					this.addDropdownItem(noteData.title);
					this.#noteNameList.push(noteData);
					this.addItemAtList(noteData.title, noteData.id);
					setTextlabelValue("저장됨.");
				}
				break;
			// 닫을 때 이벤트
			default:
				actionOfBtn = (e) => {
					this.closeNotepad();
				}
		}
		btn.addEventListener("click", actionOfBtn);
		return btn;
	}

	// 저장, 다른이름저장, 닫기 버튼 관리 *
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
		saveAsInput.value = this.getNoteById().title;

		btnGroup.appendChild(saveBtn);
		btnGroup.appendChild(saveAsBtn);
		btnGroup.appendChild(deleteBtn);
		btnGroup.appendChild(closeBtn);
		btnGroup.appendChild(saveAsInput);

		return btnGroup;
	}

    // textarea와 버튼들을 합치고 보여주는 기능. *
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