
const TYPE_ROLE = {
	USER: "user",
	SYSTEM: "system",
	ASSISTANT: "assistant"
}

const BASE_HISTORY = [
	{ role: TYPE_ROLE.SYSTEM, content: "Ты помощник через консоль."}
]

class MessageHistory{
	constructor({history} = {history: BASE_HISTORY}){
		this.baseHistory = history
		this.history = [...this.baseHistory]
		this.fullHistory = [...this.baseHistory]
	}
	getHistory(){
		return this.history
	}
	getAllHistory(){
		return this.fullHistory
	}
	clear(){
		this.history = [...this.baseHistory]
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