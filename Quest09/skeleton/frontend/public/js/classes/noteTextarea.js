export default class NoteTextarea {
    #noteId = "";
    #noteName = "";
    #textareaId;
    #labelId;
	constructor(textareaId, labelId) {
        this.#textareaId = textareaId;
        this.#labelId = labelId;
    }
    get noteId() {
        return this.#noteId;
    }
    set noteId(noteId) {
        this.#noteId = parseInt(noteId);
    }
    get noteName() {
        return this.#noteName;
    }
    set noteName(noteName) {
        this.#noteName = noteName;
    }

    // textarea생성과 textarea처리를 위한 버튼 생성
    monitorValue(textarea, text) {
        const handleTextarea = (e) => {
            document.getElementById(this.#labelId).innerText = text;
        }
        textarea.addEventListener("input", handleTextarea);
    }

    // 텍스트 적을곳 생성
	initArea(value = "") {
		const noteArea = document.createElement("textarea");
		noteArea.className = "form-control";
        noteArea.id = this.#textareaId;
        noteArea.value = value;
		this.monitorValue(noteArea, "저장 안됨.");

		return noteArea;
	}

	// textarea value 설정
	loadValue(inputId, inputValue, textareaValue = "") {
		const noteArea = document.getElementById(this.#textareaId);
		noteArea.value = textareaValue;

		const saveAsInput = document.getElementById(inputId);
		saveAsInput.value = inputValue;
	}
}