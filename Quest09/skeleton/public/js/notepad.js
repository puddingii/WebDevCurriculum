class Button {
	#title;
	constructor(title) {
		this.#title = title;
	}
	get title() {
		return this.#title;
	}

	// haeder에 있는 리스트들 쓰기
	initTitleBtn() {
		const noteList = document.createElement("li");
		noteList.className = "nav-item notetab";

		const noteLink = document.createElement("a");
		noteLink.className = "nav-link notelink";
		noteLink.ariaCurrent = "page";
		noteLink.href= "#";
		noteLink.id = this.#title;
		noteLink.innerText = this.#title;
		noteList.appendChild(noteLink);
		
		return noteList;
	}

	toggleList(listTarget) {
		const noteLinks = document.querySelectorAll("a.notelink");
		noteLinks.forEach((notelink) => {
			const textForm = document.querySelector(`.${notelink.id}Form`);
			if(listTarget !== notelink.id) {
				notelink.classList.remove("active");
				textForm.classList.add("disNone");
			} else {
				notelink.classList.add("active");
				textForm.classList.remove("disNone");
			}
		})
	}

	// 위의 리스트들 클릭이벤트 처리
	setClickList(li) {
		const clickButton = (e) => {
			this.toggleList(e.target.id);
		}
		li.addEventListener("click", clickButton);
	}

	getStorageId() {
		return Array.from({length: localStorage.length}, (_, i) => {
			const title = localStorage.key(i);
			const content = JSON.parse(localStorage.getItem(title));
			return content.id;
		});
	}

	// 다른이름으로 저장버튼 이벤트처리
	// dropdown리스트에 바로 안뜨기 때문에 reload로 넘김.
	setClickDifSave(difBtn) { 
		difBtn.id = "difBtn";
		const handleDifSave = (e) => {
			const currentForm = document.querySelector(".noteDiv:not(.disNone)");
			const id = currentForm.querySelector(".difInput").value;
			const text = currentForm.querySelector("textarea").value;
			if(localStorage[id]) {
				alert("같은 이름의 파일이 있습니다!");
			} else {
				const value = {
					text,
					id: this.getStorageId().length !== 0 ? this.getMaxId(this.getStorageId()) + 1 : 0
				}
				localStorage[id] = JSON.stringify(value);
				location.reload();
			}
		}
		difBtn.addEventListener("click", handleDifSave);
	}

	// 저장버튼 이벤트처리
	// dropdown리스트에 바로 안뜨기 때문에 reload로 넘김.
	setClickSave(btn) {
		const handleSave = async (e) => {
			const currentForm = document.querySelector(".noteDiv:not(.disNone)");
			const text = currentForm.querySelector("textarea").value;
			const currentStatus = currentForm.querySelector("label");

			const response = await fetch("http://localhost:8000/api/saveNote", {
				method: "post",
				headers: {
					"Content-type": "application/json"
				},
				body: JSON.stringify({ text, title: this.#title })
			})
			if(response.status === 201) {
				currentStatus.innerText = "저장됨.";
			} else {
				currentStatus.innerText = "통신오류.";
			}
			
		}
		btn.addEventListener("click", handleSave);
	}

	// 해당 리스트부분과 textarea 제거
	removeNote() {
		const currentForm = document.querySelector(".noteDiv:not(.disNone)");
		const currentTitle = document.querySelector(`#${this.#title}`).parentNode;
		currentForm.remove();
		currentTitle.remove();
	}

	// 닫기버튼 이벤트처리
	setClickClose(btn) {
		const handleClose = (e) => {
			this.removeNote();
		}
		btn.addEventListener("click", handleClose);
	}

	// 삭제버튼 이벤트 처리
	setClickDelete(btn) {
		const handleDelete = (e) => {
			this.removeNote();
			localStorage.removeItem(this.#title);
		}
		btn.addEventListener("click", handleDelete);
	}

	// 버튼을 만들고 각 버튼에 맞는 이벤트 처리
	setButton(className, innerText) {
		const submitBtn = document.createElement("button");
		submitBtn.type = "button";
		submitBtn.className = className;
		submitBtn.innerText = innerText;
		switch(innerText) {
			case "닫기":
				submitBtn.type = "button";
				this.setClickClose(submitBtn);
				break;
			case "저장":
				this.setClickSave(submitBtn);
				break;
			case "삭제":
				this.setClickDelete(submitBtn);
				break;
			default:
				this.setClickDifSave(submitBtn);
		}

		return submitBtn;
	}
}

class Notepad extends Button{
	#content;
	constructor(title, content = "") {
		super(title);
		this.#content = content;
	}
	get content() {
		return this.#content;
	}
	set content(con) {
		this.#content = con;
	}
	// textarea생성과 textarea처리를 위한 버튼 생성
	detectTextarea(textarea) {
		const handleTextarea = (e) => {
			const currentForm = document.querySelector(".noteDiv:not(.disNone)");
			currentForm.querySelector("label").innerText = "저장 안됨."
		}
		textarea.addEventListener("input", handleTextarea);
	}

	// 저장, 다른이름저장, 닫기 버튼 관리
	setButtonGroup() {
		const btnGroup = document.createElement("div");
		btnGroup.id = "btnGroup";
		const saveBtn = super.setButton("btn btn-outline-primary","저장");
		const saveDifBtn = super.setButton("btn btn-outline-primary","다른이름으로 저장");
		const deleteBtn = super.setButton("btn btn-outline-danger","삭제");
		const closeBtn = super.setButton("btn btn-outline-danger","닫기");
		const difInput = document.createElement("input");
		difInput.type= "text";
		difInput.className = "form-control difInput";
		difInput.id = "difBtn";
		difInput.value = super.title;
		btnGroup.appendChild(saveBtn);
		btnGroup.appendChild(saveDifBtn);
		btnGroup.appendChild(deleteBtn);
		btnGroup.appendChild(closeBtn);
		btnGroup.appendChild(difInput);

		return btnGroup;
	}

	// 텍스트 적을곳 셋팅
	setTextarea() {
		const textarea = document.createElement("textarea");
		textarea.className = "form-control";
		textarea.id = super.title;
		textarea.value = this.#content;
		this.detectTextarea(textarea);

		return textarea;
	}

	// textarea, 버튼 등 셋팅
	initNotepad() {
		const contentDiv = document.createElement("div");
		contentDiv.className= `form-floating ${super.title}Form noteDiv disNone`;
		const textarea = this.setTextarea();
		const detectLabel = document.createElement("label");
		detectLabel.innerText = "Write";
		const btnGroup = this.setButtonGroup();

		contentDiv.appendChild(textarea);
		contentDiv.appendChild(detectLabel);
		contentDiv.appendChild(btnGroup);

		return contentDiv;
	}
};

class MyWindow {
	#notepads
	constructor() {
		const loadedContent = this.loadContent();
		this.#notepads = loadedContent;
	}
	get notepads() {
		return this.#notepads;
	}
	set notepads(pads) {
		this.#notepads = pads;
	}

	// localStorage에서 text에 맞는 value 긁기. 
	getStorageItem(text) {
		return JSON.parse(localStorage.getItem(text));
	}

	// localStorage 전체 읽기.
	loadContent() {
		const storage = Array.from({length: localStorage.length}, (_, i) => ({
			title: localStorage.key(i),
			content: this.getStorageItem(localStorage.key(i))
		}));
		return storage;
	}
	
	// Dropdown에 localStorage내용물을 긁어와서 표시
	loadDropdownMenu(value) {
		const loadMenu = document.querySelector(".dropdown-menu");
		const loadList = document.createElement("li");
		const itemLink = document.createElement("a");
		itemLink.className = "dropdown-item";
		itemLink.href="";
		itemLink.innerText= value;
		loadList.appendChild(itemLink);
		loadMenu.appendChild(loadList);
	}

	// id와 value값으로 header쪽의 리스트와 textarea노트 생성
	setListAndNote(id, value) {
		const navContainer = document.querySelector(".navContainer");
		const notepad = document.querySelector(".notepad");
		const note = new Notepad(id, value);
		// button & textarea setting
		const titles = note.initTitleBtn();
		const textForm = note.initNotepad();
		navContainer.appendChild(titles);
		notepad.appendChild(textForm);
		note.setClickList(titles);
	}

	// dropdown안에 있는 요소 클릭시 발생하는 이벤트설정. 
	// 클릭시 만약 리스트에 없다면 setListAndNote를 사용해 불러옴.
	setDropMenuAction() {
		const loadList = document.querySelectorAll(".dropdown-item");
		const handleLoadList = (e) => {
			e.preventDefault();
			const currentList = document.querySelectorAll(".notelink");
			let isExisting = true;
			currentList.forEach((item) => {
				if(item.id === e.target.innerText) {
					isExisting = false;
				}
			});
			if(isExisting) {
				const id = e.target.innerText;
				this.setListAndNote(id, this.getStorageItem(id));
			}
		}
		loadList.forEach((item) => {
			item.addEventListener("click", handleLoadList);
		});
	}

	// 파일 만들때 난수 생성해서 이름짓고 리스트추가 및 노트생성.(저장 안된상태)
	initNewFile() {
		const openBtn = document.getElementById("openFile");
		const handleOpenFile = (e) => {
			const random = `tmp${Math.floor(Math.random()*1000000+1)}`;
			this.setListAndNote(random, "");
			new Button().toggleList(random);
		}
		openBtn.addEventListener("click", handleOpenFile);
	}
	
	initTerminal() {
		const sortedNotes = this.#notepads.sort((a, b) => a.content.id - b.content.id);
		for(let note of sortedNotes) {
			this.loadDropdownMenu(note.title);
			this.setListAndNote(note.title, note.content.text);
		}
		this.setDropMenuAction();
		this.initNewFile();
	}
};
