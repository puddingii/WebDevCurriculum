const notepads = [];
for(let i =0; i<50; i++) {
	notepads.push({
		content: "",
		title: `notepad${i}`
	});
}

class Button {
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
	setClickList() {
		const list = document.getElementById(this.#title);
		const clickButton = (e) => {
			if(e.target.classList.value === "nav-link") {
				const as = document.querySelectorAll("a");
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
		list.addEventListener("click", clickButton);
	}
	setDifSave(btn) { 
		const handleDifSave = (e) => {
			console.log(e.target.parentNode);
		}
		btn.addEventListener("click", handleDifSave);
	}
	setSave(btn) {
		const handleSave = (e) => {
			const text = e.target.parentNode.querySelector("textarea").value;
			localStorage[this.#title] = text;
			console.log(localStorage[this.#title]);
		}
		btn.addEventListener("click", handleSave);
	}
	setClose(btn) {
		const handleClose = (e) => {
			e.target.parentNode.remove();
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
		const button1 = super.setButton("btn btn-outline-primary","저장");
		const button2 = super.setButton("btn btn-outline-primary","다른이름으로 저장");
		const button3 = super.setButton("btn btn-outline-danger","닫기");

		div.appendChild(textarea);
		div.appendChild(label);
		div.appendChild(button1);
		div.appendChild(button2);
		div.appendChild(button3);
		div.style.display = "none";

		return div;
	}
	setStorage() {

	}
	saveLocal() {

	}
	loadLocal() {

	}
};

class Terminal {
	#notepads
	constructor(count) {
		const lcStorage = [];
		for(let i = 0; i< count; i+=1) {
			lcStorage.push(new Notepad(notepads[i].title, notepads[i].content));
		}
		this.#notepads = lcStorage;
	}
	get notepads() {
		return this.#notepads;
	}
	set notepads(pads) {
		this.#notepads = pads;
	}
	initTerminal() {
		const navbar = document.querySelector(".navba");
		const notepad = document.querySelector(".notepad");
		for(let not of this.#notepads) {
			const note = new Notepad(not.title, "a");
			// button & textarea setting
			const li = note.initTitles();
			const textForm = note.initNotepad();
			navbar.appendChild(li);
			notepad.appendChild(textForm);
			note.setClickList();
		}
	}
	closeNote() {

	}
};
