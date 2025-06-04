import { writeFileHistory } from "./helpers.js";

const TYPE_ROLE = {
	USER: "user",
	SYSTEM: "system",
	ASSISTANT: "assistant"
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
			writeFileHistory(JSON.stringify({history: this.fullHistory}, null, 2), this.createdDate)
		}
	}
	pushMessage({role, message, cost = null}){
		const messageObj = { role, content: message }
		
		if(cost){
			messageObj.cost = cost
		}

		this.fullHistory.push(messageObj)
		this.history.push(messageObj)

		if(this.saveHistory){
			writeFileHistory(JSON.stringify({history: this.fullHistory}, null, 2), this.createdDate)
		}
	}
	pushUser(message){
		this.pushMessage({role: TYPE_ROLE.USER, message})
	}
	pushAssistant (answerGPT){
		const message = answerGPT.choices[0].message.content

		this.pushMessage({role: TYPE_ROLE.ASSISTANT, message, cost: answerGPT.usage})
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