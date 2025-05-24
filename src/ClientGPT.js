import OpenAI from "openai"

const MODELS = {
	"gpt-4o": "gpt-4o",
	"gpt-4-turbo": "gpt-4-turbo"
}

const SETTINGS = {
	MODEL: MODELS["gpt-4-turbo"]
}

class MyGPT {
	constructor({apiKey, history}){
		this.initGPT(apiKey)
		this.history = history
	}

	initGPT(apiKey){
		this.openAI = new OpenAI({
			apiKey: apiKey
		})
	}

	async ask(){
		try {
			return this.openAI.chat.completions.create({
				model: SETTINGS.MODEL,
				messages: this.history.getHistory()
			})
		} catch (error) {
			console.log(error)
			return false
		}
	}
}

export default MyGPT