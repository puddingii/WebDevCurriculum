class MyLocalStorage {
	constructor(id) {
		this.currentUserId = id;
	}
	async loadContent() {
		const response = await fetch(`http://localhost:8000/api/loadAllData?email=${this.currentUserId}`, {
		});
		const storage = await response.json();
		return storage;
	}

	async deleteContent(id) {
		const response = await fetch("http://localhost:8000/api/delete", {
			method: "delete",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({ id })
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

	async saveAsContent(id, email, title, text) {
		const response = await fetch("http://localhost:8000/api/saveAs", {
			method: "post",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({ id, email, title, text })
		});
		return response;
	}
}