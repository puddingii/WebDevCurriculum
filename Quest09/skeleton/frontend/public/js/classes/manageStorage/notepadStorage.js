class NotepadStorage {
	constructor(id) {
		this.currentUserId = id;
	}
	async loadContent() {
		const response = await fetch(`http://localhost:8000/api/loadAllData?email=${this.currentUserId}`, {
		});
		const storage = await response.json();
		return storage;
	}

	async deleteContent(noteId, email) {
		const response = await fetch("http://localhost:8000/api/delete", {
			method: "delete",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({ noteId, email })
		});
		return response;
	}

	async saveContent(id, email, title, text) {
		const response = await fetch("http://localhost:8000/api/save", {
			method: "post",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({ id, email, title, text })
		});
		return response;
	}

	async saveAsContent(email, title, text) {
		const response = await fetch("http://localhost:8000/api/saveAs", {
			method: "post",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({ email, title, text })
		});
		const storage = await response.json();
		return storage;
	}
}