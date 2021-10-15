import  Notepad from "./formAndButton.js";

export class MyWindow {
	constructor(id) {
		this.currentUserId = id;
	}

	async initMyWindow() {
		const myNotepad = new Notepad();
		await myNotepad.initNotepad(this.currentUserId);
		const lastTabId = myNotepad.noteTextarea.noteId;
		
		const mainSection = document.querySelector("section.notepad");
		myNotepad.setNotepadForm(mainSection);
		myNotepad.clickNewFile();
		myNotepad.openTabs.forEach((tab) => {
			myNotepad.addItemAtList(myNotepad.getNoteById(parseInt(tab)).title, tab);
		})
		myNotepad.noteNameList.forEach((note) => {
			myNotepad.addDropdownItem(note.title, note.id);
		});
		myNotepad.navbarList.toggleItem(`noteId${lastTabId}`, "a.notelink");
	}
}
