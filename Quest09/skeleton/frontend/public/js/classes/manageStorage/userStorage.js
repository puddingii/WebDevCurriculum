class UserStorage {
	constructor(id) {
		this.currentUserId = id;
	}

    async saveOpenNote(email, opentab, lasttab) {
        const response = await fetch("http://localhost:8000/api/users/saveOpenNote", {
            method: "post",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({ email, opentab: opentab.toString(), lasttab })
        });
        return response;
    }
}