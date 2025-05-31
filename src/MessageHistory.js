import fs from "fs";

function writeFile (name, data) {
	fs.writeFileSync(`./logs/history-${name}.json`, data);
}

function taskDate(dateMilli) {
    var d = (new Date(dateMilli) + '').split(' ');
    d[2] = d[2] + ',';

    return [d[0], d[1], d[2], d[3]].join(' ');
}

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
	pushMessage(role, message){
		this.fullHistory.push({ role, content: message })
		this.history.push({ role, content: message })
		console.log('rs1')
		if(this.saveHistory){
		console.log('rs2')
			writeFile(this.createdDate, JSON.stringify({history: this.history}))
		console.log('rs3')
		}
	}
	pushUser(message){
		console.log('rs4')
		this.pushMessage(TYPE_ROLE.USER, message)
	}
	pushAssistant (message){
		this.pushMessage(TYPE_ROLE.ASSISTANT, message)
	}
}

export default MessageHistory