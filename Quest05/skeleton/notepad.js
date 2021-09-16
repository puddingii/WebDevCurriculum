class NButton {
	#title;
	constructor(title) {
		this.#title = title;
	}
	get title() {
		return this.#title;
	}
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
	setDifSave(btn) { 
		btn.id = "difBtn";
		const handleDifSave = (e) => {
			const id = e.target.parentNode.querySelector("input").value;
			const value = e.target.parentNode.parentNode.querySelector("textarea").value;
			localStorage[id] = value;
			location.reload();
		}
		btn.addEventListener("click", handleDifSave);
	}
	setSave(btn) {
		const handleSave = (e) => {
			const text = e.target.parentNode.querySelector("textarea").value;
			localStorage[this.#title] = text;
			location.reload();
		}
		btn.addEventListener("click", handleSave);
	}
	setClose(btn) {
		const handleClose = (e) => {
			e.target.parentNode.parentNode.remove();
			document.querySelector(`#${this.#title}`).parentNode.remove();
		}
		btn.addEventListener("click", handleClose);
	}
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
	initNotepad() {
		const div = document.createElement("div");
		div.className= `form-floating ${super.title}Form`;
		const textarea = document.createElement("textarea");
		textarea.className = "form-control";
		textarea.id = super.title;
		textarea.value = this.#content;
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

	getStorageItem(text) {
		return localStorage.getItem(text);
	}

	loadContent() {
		const content = [];
		for(let i = 0; i < localStorage.length; i+= 1) {
			const tmp = localStorage.key(i);
			content.push({title:tmp, content:this.getStorageItem(tmp)});
		}
		return content;
	}
	
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
