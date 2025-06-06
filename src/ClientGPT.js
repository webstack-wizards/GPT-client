import OpenAI from "openai"
import { SETTINGS, writeFile } from "./helpers.js"
import MessageHistory from "./MessageHistory.js"


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


	async toolsWorker ({toolsFn, calledTools}){
		for(let callFn of calledTools){
			if(callFn.type === "function"){
				const callFunction = toolsFn.fns[callFn.function.name];
				if(!callFunction){
					console.log("Error, function not defind", callFn.name)
					writeFile({data: JSON.stringify(response, null, 4), name: `${this.history.createdDate}-${Date.now()}.json`, route: "logs/fn-not-defind"})
				}
				const argumentsFn = JSON.parse(callFn.function.arguments)
				const resultFm = JSON.stringify(await callFunction(argumentsFn))
				this.history.pushToolResult(callFn.id, resultFm)
			}
		}
	}

	async ask({toolsFn = null} = {}){
		try {
			const settingsMessage = {
				model: SETTINGS.gptModel,
				messages: this.history.getHistory(),
				store: true,
			}

			if(toolsFn){
				settingsMessage.tools = toolsFn.tools
			}

			const response = await this.openAI.chat.completions.create(settingsMessage);
			
			this.history.pushAssistant(response)

			const answer = response.choices[0];

			if(answer.finish_reason === "stop"){
				return response
			}
			if(answer.finish_reason === "tool_calls"){
				await this.toolsWorker({toolsFn, calledTools: answer.message.tool_calls})
				return this.ask()
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