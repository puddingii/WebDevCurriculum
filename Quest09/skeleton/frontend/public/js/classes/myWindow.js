import Notepad from "./formAndButton.js";

export class MyWindow {
	myNotepad = new Notepad();
	constructor(id) {
		this.currentUserId = id;
	}

	async initMyWindow() {
		await this.myNotepad.initNotepad(this.currentUserId);
		const lastTabId = this.myNotepad.noteTextarea.noteId;
		
		const mainSection = document.querySelector("section.notepad");
		this.myNotepad.setNotepadForm(mainSection);
		this.myNotepad.clickNewFile();
		if(this.myNotepad.openTabs) {
			this.myNotepad.openTabs.forEach((tab) => {
				this.myNotepad.addItemAtList(this.myNotepad.getNoteById(parseInt(tab)).title, tab);
			});
			this.myNotepad.navbarList.toggleItem(`noteId${lastTabId}`, "a.notelink");
		}
		if(this.myNotepad.noteNameList) {
			this.myNotepad.noteNameList.forEach((note) => {
				this.myNotepad.addDropdownItem(note.title, note.id);
			});
		}

		window.addEventListener("beforeunload", async() => {
			if(location.pathname === "/") {
				await this.myNotepad.saveOpenNote();
			}
		});
	}

	logout(btnId) {
		const logoutBtn = document.getElementById(btnId);
		const clickLogout = () => {
			location.href = "/logout";
		}
		logoutBtn.addEventListener("click", clickLogout);
	}
}
