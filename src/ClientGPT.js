import OpenAI from "openai"
import { SETTINGS, writeFile } from "./helpers.js"


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

	async ask({tools = null} = {}){
		try {
			const settingsMessage = {
				model: SETTINGS.gptModel,
				messages: this.history.getHistory(),
				store: true,
			}

			if(tools){
				settingsMessage.tools = tools
			}

			const response = await this.openAI.chat.completions.create(settingsMessage);
			
			this.history.pushAssistant(response)

			const answer = response.choices[0];

			if(answer.finish_reason === "stop"){
				return response
			}
			if(answer.finish_reason === "tool_calls"){
				const listTolls = answer.message.tool_calls.map(callFn => {

				})
			}

			writeFile({data: JSON.stringify(response, null, 4), name: `${this.history.createdDate}-${Date.now()}.json`, route: "logs/histroty-something"})
			return response

		} catch (error) {
			console.log(error)
			return false
		}
	}
}

export default MyGPT