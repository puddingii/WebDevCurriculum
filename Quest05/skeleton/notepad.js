class NButton {
	#title;
	constructor(title) {
		this.#title = title;
	}
	get title() {
		return this.#title;
	}

	// haeder에 있는 리스트들 쓰기
	initTitles() {
		const li = document.createElement("li");
		li.className = "nav-item";
		const a = document.createElement("a");
		a.className = "nav-link";
		a.ariaCurrent = "page";
		a.href= "#";
		a.id = this.#title;
		a.innerText = this.#title;
		li.appendChild(a);
		
		return li;
	}

	// 클릭이벤트 처리
	setClickList(li) {
		const clickButton = (e) => {
			if(e.target.classList.value === "nav-link") {
				const as = document.querySelectorAll("a.nav-link");
				as.forEach((a) => {
					if(e.target.id !== a.id) {
						a.className = "nav-link";
						document.querySelector(`.${a.id}Form`).style.display = "none";
					}
				})
				e.target.classList.toggle("active");
				document.querySelector(`.${this.#title}Form`).style.display = "";
			}
		}
		li.addEventListener("click", clickButton);
	}

	// 다른이름으로 저장버튼 이벤트처리
	// dropdown리스트에 바로 안뜨기 때문에 reload로 넘김.
	setDifSave(btn) { 
		btn.id = "difBtn";
		const handleDifSave = (e) => {
			const id = e.target.parentNode.querySelector("input").value;
			const value = e.target.parentNode.parentNode.querySelector("textarea").value;
			console.log(localStorage[id]);
			if(localStorage[id]) {
				alert("같은 이름의 파일이 있습니다!")
			} else {
				localStorage[id] = value;
				location.reload();
			}
			
		}
		btn.addEventListener("click", handleDifSave);
	}

	// 저장버튼 이벤트처리
	// dropdown리스트에 바로 안뜨기 때문에 reload로 넘김.
	setSave(btn) {
		const handleSave = (e) => {
			const text = e.target.parentNode.parentNode.querySelector("textarea").value;
			localStorage[this.#title] = text;
			alert("저장되었습니다.");
			location.reload();
		}
		btn.addEventListener("click", handleSave);
	}

	// 닫기버튼 이벤트처리
	setClose(btn) {
		const handleClose = (e) => {
			e.target.parentNode.parentNode.remove();
			document.querySelector(`#${this.#title}`).parentNode.remove();
		}
		btn.addEventListener("click", handleClose);
	}

	// 버튼을 만들고 각 버튼에 맞는 이벤트 처리
	setButton(className, innerText) {
		const btn = document.createElement("button");
		btn.type = "button";
		btn.className=className;
		btn.innerText=innerText;
		switch(innerText) {
			case "닫기":
				this.setClose(btn);
				break;
			case "저장":
				this.setSave(btn);
				break;
			default:
				this.setDifSave(btn);
		}

		return btn;
	}
}

class Notepad extends NButton{
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
			e.target.parentNode.querySelector("label").innerText = "저장 안됨."
		}
		textarea.addEventListener("input", handleTextarea);
	}

	initNotepad() {
		const div = document.createElement("div");
		div.className= `form-floating ${super.title}Form`;
		const textarea = document.createElement("textarea");
		textarea.className = "form-control";
		textarea.id = super.title;
		textarea.value = this.#content;
		this.detectTextarea(textarea);
		const label = document.createElement("label");
		label.for = super.title;
		label.innerText = "Write";
		const btnGroup = document.createElement("div");
		btnGroup.id = "btnGroup";
		const button1 = super.setButton("btn btn-outline-primary","저장");
		const button2 = super.setButton("btn btn-outline-primary","다른이름으로 저장");
		const button3 = super.setButton("btn btn-outline-danger","닫기");
		const input = document.createElement("input");
		input.type= "text";
		input.className = "form-control";
		input.id = "difBtn";
		input.value = super.title;

		div.appendChild(textarea);
		div.appendChild(label);
		btnGroup.appendChild(button1);
		btnGroup.appendChild(button2);
		btnGroup.appendChild(button3);
		btnGroup.appendChild(input);
		div.appendChild(btnGroup);
		div.style.display = "none";

		return div;
	}
};

class Terminal {
	#notepads
	constructor() {
		this.#notepads = this.loadContent();
	}
	get notepads() {
		return this.#notepads;
	}
	set notepads(pads) {
		this.#notepads = pads;
	}

	// localStorage에서 text에 맞는 value 긁기. 
	getStorageItem(text) {
		return localStorage.getItem(text);
	}

	// localStorage 전체 읽기.
	loadContent() {
		const content = [];
		for(let i = 0; i < localStorage.length; i+= 1) {
			const tmp = localStorage.key(i);
			content.push({title:tmp, content:this.getStorageItem(tmp)});
		}
		return content;
	}
	
	// Dropdown에 localStorage내용물을 긁어와서 표시
	loadDropdownMenu(value) {
		const dropd = document.querySelector(".dropdown-menu");
		const li = document.createElement("li");
		const a =document.createElement("a");
		a.className = "dropdown-item";
		a.href="";
		a.innerText= value;
		li.appendChild(a);
		dropd.appendChild(li);
	}

	// id와 value값으로 header쪽의 리스트와 textarea노트 생성
	setListAndNote(id, value) {
		const navbar = document.querySelector(".navba");
		const notepad = document.querySelector(".notepad");
		const note = new Notepad(id, value);
		// button & textarea setting
		const li = note.initTitles();
		const textForm = note.initNotepad();
		navbar.appendChild(li);
		notepad.appendChild(textForm);
		note.setClickList(li);
	}

	// dropdown안에 있는 요소 클릭시 발생하는 이벤트설정. 
	// 클릭시 만약 리스트에 없다면 setListAndNote를 사용해 불러옴.
	setDropMenuAction() {
		const loadList = document.querySelectorAll(".dropdown-item");
		const handleLoadList = (e) => {
			e.preventDefault();
			const currentList = document.querySelectorAll(".nav-link");
			let isExisting = false;
			currentList.forEach((item) => {
				if(item.id === e.target.innerText) {
					isExisting = true;
				}
			});
			if(!isExisting) {
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
			const random = Math.floor(Math.random()*1000000+1);
			this.setListAndNote(`tmp${random}`, "");
		}
		openBtn.addEventListener("click", handleOpenFile);
	}
	
	initTerminal() {
		for(let not of this.#notepads) {
			this.loadDropdownMenu(not.title);
			this.setListAndNote(not.title, not.content);
		}
		this.setDropMenuAction();
		this.initNewFile();
	}
};
