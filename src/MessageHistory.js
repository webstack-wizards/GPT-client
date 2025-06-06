import { writeFileHistory, SETTINGS } from "./helpers.js";

const TYPE_ROLE = {
	USER: "user",
	SYSTEM: "system",
	ASSISTANT: "assistant",
	TOOL: "tool"
}

const BASE_HISTORY = [
	{ role: TYPE_ROLE.SYSTEM, content: SETTINGS.basePrompt}
]

function resucerCosts (a, b){
	return {
		"prompt_tokens": a.prompt_tokens + b.prompt_tokens,
		"completion_tokens": a.completion_tokens + b.completion_tokens,
		"total_tokens": a.total_tokens + b.total_tokens,
		"prompt_tokens_details": {
			"cached_tokens": a.prompt_tokens_details.cached_tokens + b.prompt_tokens_details.cached_tokens,
			"audio_tokens": a.prompt_tokens_details.audio_tokens + b.prompt_tokens_details.audio_tokens
		},
		"completion_tokens_details": {
			"reasoning_tokens": a.completion_tokens_details.reasoning_tokens + b.completion_tokens_details.reasoning_tokens,
			"audio_tokens": a.completion_tokens_details.audio_tokens + b.completion_tokens_details.audio_tokens,
			"accepted_prediction_tokens": a.completion_tokens_details.accepted_prediction_tokens + b.completion_tokens_details.accepted_prediction_tokens,
			"rejected_prediction_tokens": a.completion_tokens_details.rejected_prediction_tokens + b.completion_tokens_details.rejected_prediction_tokens
		}
	}
}
function getterCosts(arrayMessage) {
	return arrayMessage.filter(message => message.role === "assistant" && !!message.cost).map(msg => msg.cost).reduce(resucerCosts, {
		"prompt_tokens": 0,
		"completion_tokens": 0,
		"total_tokens": 0,
		"prompt_tokens_details": {
			"cached_tokens": 0,
			"audio_tokens": 0
		},
		"completion_tokens_details": {
			"reasoning_tokens": 0,
			"audio_tokens": 0,
			"accepted_prediction_tokens": 0,
			"rejected_prediction_tokens": 0
		}
	})
}

class MessageHistory{
	constructor(argObj){
		const {history, save} = {history: BASE_HISTORY, save: false, ...argObj}
		this.baseHistory = history;
		this.savedHistory = save
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
		this.lastMessage = null
		this.history = [...this.baseHistory]
	}
	addContentMessage(message){
		const content = this.lastMessage.content
		if(content){
			content.push(message)
		} else {
			this.lastMessage.content = [message]
		}
	}

	addText(message){
		this.addContentMessage({
			type: "text",
			text: message
		})
	}
	addMedias(urlFiles){
		urlFiles.forEach(url => {
			this.addContentMessage({
				type: "image_url",
				image_url: {url}
			})	
		});		
	}
	createMessage({role, message, medias, copy, cost}){
		if(!copy){
			this.lastMessage = { 
				role,
				content: null
			}

			if(!!message){
				this.addText(message)
			}
			if(!!medias){
				this.addMedias(medias)
			}
		} else {
			this.lastMessage = copy
		}

		if(role){
			this.lastMessage.role = role
		}
		if(cost){
			this.lastMessage.cost = cost
		}

		
		this.fullHistory.push(this.lastMessage)
		this.history.push(this.lastMessage)
		
		return this.lastMessage
	}

	saveHistory(){
		return writeFileHistory(JSON.stringify({history: this.fullHistory}, null, 2), this.createdDate)
	}

	pushMessage(){
		this.lastMessage = null
		if(this.savedHistory){
			this.saveHistory()
		}
	}
	
	pushToolResult(tool_call_id, content){
		this.createMessage({role: TYPE_ROLE.TOOL, copy: {tool_call_id, content}})
		this.pushMessage()
	}
	pushUser(message, urlFiles){
		this.createMessage({role: TYPE_ROLE.USER, message, medias: urlFiles})
		this.pushMessage()
	}
	pushAssistant (answerGPT){
		this.createMessage({copy: answerGPT.choices[0].message, role: TYPE_ROLE.ASSISTANT, cost: answerGPT.usage})
		this.pushMessage()
	}
	getCost (type){
		switch (type) {
			case "session":
				return getterCosts(this.history)
			case "all":
				return getterCosts(this.fullHistory)
			default:
				return this.history[this.history.length - 1].cost
		}
	}
}

export default MessageHistory