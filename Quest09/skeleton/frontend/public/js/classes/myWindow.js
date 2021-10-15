import  Notepad from "./formAndButton.js";

export class MyWindow {
	constructor(id) {
		this.currentUserId = id;
	}

	async initMyWindow() {
		const myNotepad = new Notepad();
		await myNotepad.initNotepad(this.currentUserId);
		const lastTabId = parseInt(myNotepad.noteTextarea.noteId);
		const lastTabName = myNotepad.getNoteById(lastTabId).title;
		
		const mainSection = document.querySelector("section.notepad");
		myNotepad.setNotepadForm(mainSection);
		myNotepad.clickNewFile();
		myNotepad.addItemAtList(lastTabName, lastTabId);
		myNotepad.navbarList.toggleItem(`noteId${lastTabId}`, "a.notelink");
		myNotepad.noteNameList.forEach((note) => {
			myNotepad.addDropdownItem(note.title, note.id);
		});
	}
}
