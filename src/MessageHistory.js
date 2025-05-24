
const TYPE_ROLE = {
	USER: "user",
	SYSTEM: "system",
	ASSISTANT: "assistant"
}

class MessageHistory{
	constructor(){
		this.history = []
		this.fullHistory = []
	}
	getHistory(){
		return this.history
	}
	getAllHistory(){
		return this.fullHistory
	}
	clear(){
		this.history = []
	}
	pushMessage(role, message){
		this.fullHistory.push({ role, content: message })
		this.history.push({ role, content: message })
	}
	pushUser(message){
		this.pushMessage(TYPE_ROLE.USER, message)
	}
	pushAssistant (message){
		this.pushMessage(TYPE_ROLE.ASSISTANT, message)
	}
}

export default MessageHistory