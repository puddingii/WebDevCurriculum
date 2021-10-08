import  Notepad from "./formAndButton.js";

export class MyWindow {
	constructor() {}

	async initMyWindow() {
		const myNotepad = new Notepad();
		await myNotepad.initNotepad();
		myNotepad.addItemAtList("navContainer", myNotepad.noteId);

		const mainSection = document.querySelector("section.notepad");
		myNotepad.setNotepadForm(mainSection);
		myNotepad.clickNewFile();
		myNotepad.noteNameList.forEach((note) => {
			myNotepad.addDropdownItem(note.title ,".dropdown-menu");
		});
	}
}