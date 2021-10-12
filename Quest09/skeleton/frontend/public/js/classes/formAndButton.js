import DropdownList from "./dropdownItem.js";
import NavBar from "./navBar.js";
import NoteButton from "./noteButton.js";
import NoteTextarea from "./noteTextarea.js";

export default class Notepad {
	#noteNameList = [];
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

	// 데이터 불러오는 초기화함수 *
	async initNotepad() {
		const allData = await new MyLocalStorage().loadContent();
		const endTitle = allData.pop().endTitle;
		this.noteTextarea.noteId = allData.length !== 0 ? endTitle : "";
		this.#noteNameList = allData;
		this.#noteNameList.sort((a, b) => a.content.id - b.content.id);
	}

    // Dropdown에 아이템 추가 *
	addDropdownItem(value) {
		const itemInfo = {
			className: "",
			id: "",
            dataset: {
				key: "currentid",
				value
			}
        };
        const linkInfo = {
            className: "dropdown-item",
			id: "",
            href: "#",
            dataset: {
                key: "currentid",
                value
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
			const title = e.target.innerText;
			const items = document.querySelectorAll(".notelink");

			if(!this.navbarList.isItemInList(items, title)) this.addItemAtList(title);
			this.clickListAndSaveLog(title);
			
			const listValue = this.#noteNameList.find((element) => element.title === title);
			this.noteTextarea.loadValue("textareaForm", "saveAsInput", listValue.content.text);
		}

		item.addEventListener("click", handleLoadValue);
	}

	// 리스트에 있는 아이템 클릭시 기존에 적어둔 값 저장, 클릭한 리스트의 값 표시 
	clickListAndSaveLog(currentid) {
		const getBeforeValue = this.#noteNameList.findIndex((element) => element.title === this.noteTextarea.noteId);
		noteFormDiv.classList.remove("disNone");

		if(getBeforeValue !== -1) this.#noteNameList[getBeforeValue].content.text = textareaForm.value; // notelist에서 해당 content값 수정
		this.navbarList.toggleItem(`noteId${currentid}`, "a.notelink");
		this.noteTextarea.noteId = currentid; // 클릭한 거 가르키기
		
		const getAfterValue = this.#noteNameList.findIndex((element) => element.title === currentid);
		this.noteTextarea.loadValue("textareaForm", "saveAsInput", this.#noteNameList[getAfterValue].content.text);
	}

	// 리스트 클릭 이벤트등록
	setClickListEvent(list) {
		const handleList = async (e) => {
			this.clickListAndSaveLog(e.target.dataset.currentid);
		}
		list.addEventListener("click", handleList);
	}

	// noteName값으로 header쪽의 리스트 생성 *
	addItemAtList(value) {
		if(!value) return;
		const itemInfo = {
            className: "nav-item notetab",
            id: `noteList${value}`,
			dataset: {
				key: "",
				value: "",
			}
        };
        const linkInfo = {
            className: "nav-link notelink",
            href: "#",
            dataset: {
                key: "currentid",
                value
            },
            id: `noteId${value}`,
            text: value
        };
		const item = this.navbarList.initItem(itemInfo, linkInfo);
		this.setClickListEvent(item); // 클릭이벤트

		this.navbarList.myList.appendChild(item);
		this.navbarList.toggleItem(`noteId${value}`, "a.notelink");
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
			this.addItemAtList(random);
			this.clickListAndSaveLog(random);
			this.noteTextarea.loadValue("textareaForm", "saveAsInput");
		}
		openBtn.addEventListener("click", handleNewFile);
	}

	// textarea+Button부분을 없앤다.(display: none) *
	closeNotepad() {
		noteFormDiv.classList.add("disNone");

		const note = document.getElementById(`noteList${this.noteTextarea.noteId}`);
		this.noteTextarea.noteId = "";
		note.remove();
	}

	// 버튼을 눌렀을 때 이벤트 처리.(textarea에 있는 value값을 가지고 저장함.) *
	setButtonWithData(type, classOfBtn) {
		const buttonController = new NoteButton(type);
		const btn = buttonController.setButton(classOfBtn);
		const textLabel = document.getElementById("textareaLabel");
		const textareaValue = () => {
			return {  //id 부분 다시 나중에 확인할 것 asdf 
				title: this.noteTextarea.noteId,
				content: {
					text: textareaForm.value,
					id: this.#noteNameList[this.#noteNameList.length]
				}
			};
		}
		const setTextlabelValue = (value) => { textLabel.innerText = value; }

		let actionOfBtn;
		switch(type) {
			// 저장할 때 이벤트. 가르키고 있는 노트를 저장한 노트의 이름으로 바꾸고 드롭다운목록에 없다면 추가해줌. 
			case "save":
				actionOfBtn = async (e) => {
					const noteData = textareaValue();
					const response = await this.myLocalStorage.saveContent(this.noteTextarea.noteId, textareaForm.value);
					if(response.status !== 201)  {
						setTextlabelValue(`처리오류 - Response status code : ${response.status}`);
						return;
					}
					this.addDropdownItem(this.noteTextarea.noteId); // dropdown목록 확인후 추가
					const indexOfItem = this.#noteNameList.findIndex((element) => element.title === this.noteTextarea.noteId);
					indexOfItem !== -1 ? this.#noteNameList[indexOfItem] = noteData : this.#noteNameList.push(noteData);
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
					const saveAsInput = document.getElementById("saveAsInput").value;
					const response = await this.myLocalStorage.saveAsContent(saveAsInput, textareaForm.value);
					if(response.status !== 201)  {
						setTextlabelValue(`처리오류 - Response status code : ${response.status}`);
						return;
					}
					this.addDropdownItem(saveAsInput);
					noteData.title = saveAsInput;
					this.#noteNameList.push(noteData);
					this.addItemAtList(saveAsInput);
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
		saveAsInput.value = this.noteTextarea.noteId;

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

		const noteNameIndex = this.#noteNameList.find((element) => element.title === this.noteTextarea.noteId);
        const noteTextarea = noteNameIndex ? this.noteTextarea.initArea(noteNameIndex.content.text) : this.noteTextarea.initArea();
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