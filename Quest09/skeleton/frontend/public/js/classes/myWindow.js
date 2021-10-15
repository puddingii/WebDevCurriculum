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
		this.myNotepad.openTabs.forEach((tab) => {
			this.myNotepad.addItemAtList(this.myNotepad.getNoteById(parseInt(tab)).title, tab);
		})
		this.myNotepad.noteNameList.forEach((note) => {
			this.myNotepad.addDropdownItem(note.title, note.id);
		});
		this.myNotepad.navbarList.toggleItem(`noteId${lastTabId}`, "a.notelink");

		// window.addEventListener("beforeunload", async() => {
		// 	if(location.pathname === "/") {
		// 		console.log(location.pathname)
		// 		await this.myNotepad.saveOpenNote();
		// 	}
		// });
	}

	logout(btnId) {
		const logoutBtn = document.getElementById(btnId);
		const clickLogout = async () => {
			// await this.myNotepad.saveOpenNote();
			location.href = "/logout";
		}
		logoutBtn.addEventListener("click", clickLogout);
	}
}
