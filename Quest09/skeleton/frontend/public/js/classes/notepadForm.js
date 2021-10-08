export class NotepadForm {
    #noteName;
	myLocalStorage = new MyLocalStorage();
	constructor(noteName) {
        this.#noteName = noteName;
    }
    get noteName() {
        return this.#noteName;
    }
    set noteName(noteName) {
        this.#noteName = noteName;
    }

    // textarea생성과 textarea처리를 위한 버튼 생성
    monitorTextarea(textarea, labelId, text) {
        const handleTextarea = (e) => {
            document.getElementById(labelId).innerText = text;
        }
        textarea.addEventListener("input", handleTextarea);
    }

    // 텍스트 적을곳 생성
	initTextarea(value = "") {
		const noteArea = document.createElement("textarea");
		noteArea.className = "form-control";
        noteArea.id = "textareaForm";
        noteArea.value = value;
		this.monitorTextarea(noteArea, "textareaLabel", "저장 안됨.");

		return noteArea;
	}

	// textarea value 설정
	loadTextareaValue(textId, inputId, value = "") {
		const noteArea = document.getElementById(textId);
		noteArea.value = value;

		const saveAsInput = document.getElementById(inputId);
		saveAsInput.value = this.#noteName;
	}
}