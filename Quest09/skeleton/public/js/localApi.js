class MyLocalStorage {
    constructor() {}
    async loadContent() {
		const response = await fetch("http://localhost:8000/api/loadAllData");
		const storage = await response.json();
		return storage;
	}

	async deleteContent(title) {
		const response = await fetch("http://localhost:8000/api/deleteNote", {
			method: "delete",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({ title })
		});
		return response;
	}

	async saveContent(title, text) {
		const response = await fetch("http://localhost:8000/api/saveNote", {
			method: "post",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({ title, text })
		});
		return response;
	}

	async saveAsContent(title, text) {
		const response = await fetch("http://localhost:8000/api/saveDifNote", {
			method: "post",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({ title, text })
		});
		return response;
	}
}