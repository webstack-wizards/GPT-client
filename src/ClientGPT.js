import OpenAI from "openai"
import { SETTINGS } from "./helpers.js"


class MyGPT {
	constructor({apiKey, history}){
		this.initGPT(apiKey)
		this.history = history
	}

	initGPT(apiKey){
		this.openAI = new OpenAI({
			apiKey
		})
	}

	async ask(){
		try {
			const settingsMessage = {
				model: SETTINGS.gptModel,
				messages: this.history.getHistory()
			}

			return this.openAI.chat.completions.create(settingsMessage)
		} catch (error) {
			console.log(error)
			return false
		}
	}
}

export default MyGPT