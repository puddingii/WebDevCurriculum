export default class NoteButton {
    #type;
	constructor(type) {
        this.#type = type;
    }
    get type() {
        return this.#type;
    }

    // 버튼을 생성후 반환.
	setButton(className) {
		const submitBtn = document.createElement("button");
		submitBtn.type = "button";
		submitBtn.className = className;
		submitBtn.id = this.#type;
		submitBtn.innerText = this.#type;

		return submitBtn;
	}
}