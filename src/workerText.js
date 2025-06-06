import {transformeImageToBase64, getWeather} from "./helpers.js";

const toolsFn = {
	tools: [
		{
			type: "function",
			function: {
					name: "get_weather",
					description: "Get current temperature for provided coordinates in celsius.",
					parameters: {
							type: "object",
							properties: {
									latitude: { type: "number" },
									longitude: { type: "number" }
							},
							required: ["latitude", "longitude"],
							additionalProperties: false
					},
					strict: true
			},
		}
	],
	fns: {
		get_weather: getWeather
	}
}

export async function workerTextGPT ({msg, chats, bot}){
	const chatID = msg.chat.id
	const chat = chats[chatID]
	
	const messageText = msg.text
	if(!chat.hotFiles){
		chat.historyMessages.pushUser(messageText)
	} else {
		chat.historyMessages.pushUser(messageText, chat.hotFiles.map(url => transformeImageToBase64(url)))
		chat.clearFiles()
	}

	const answerGPT = await chat.myGPT.ask({toolsFn})

	try {
		bot.sendMessage(chatID, answerGPT.choices[0].message.content, {
			parse_mode: "Markdown"
		})
	} catch (error) {
		console.log(answerGPT)
	}

}