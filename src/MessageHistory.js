import { writeFile } from "./helpers.js";

const TYPE_ROLE = {
	USER: "user",
	SYSTEM: "system",
	ASSISTANT: "assistant"
}

const BASE_HISTORY = [
	{ role: TYPE_ROLE.SYSTEM, content: "I'm GPT4-turbo working now through the telegram interface as a chat bot"}
]

class MessageHistory{
	constructor(argObj){
		const {history, save} = {history: BASE_HISTORY, save: false, ...argObj}
		this.baseHistory = history;
		this.saveHistory = save
		this.createdDate = Date.now()
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
	pushMessageWithImage(role, message, urlFiles){
		const messageObj = {
			role,
			content: [
				{ type: "text", text: message },
			]
		}

		messageObj.content = [...messageObj.content, ...urlFiles.map(url => ({ type: "image_url", image_url: {url}}))]


		this.fullHistory.push(messageObj)
		this.history.push(messageObj)
		if(this.saveHistory){
			writeFile(JSON.stringify({history: this.fullHistory}, null, 2), this.createdDate)
		}
	}
	pushMessage(role, message){
		this.fullHistory.push({ role, content: message })
		this.history.push({ role, content: message })
		if(this.saveHistory){
			writeFile(JSON.stringify({history: this.fullHistory}, null, 2), this.createdDate)
		}
	}
	pushUser(message){
		this.pushMessage(TYPE_ROLE.USER, message)
	}
	pushAssistant (message){
		this.pushMessage(TYPE_ROLE.ASSISTANT, message)
	}
}

export default MessageHistory