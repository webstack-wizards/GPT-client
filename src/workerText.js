import {transformeImageToBase64} from "./helpers.js";

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

	const answerGPT = await chat.myGPT.ask()

	try {
		bot.sendMessage(chatID, answerGPT.choices[0].message.content, {
			parse_mode: "Markdown"
		})
		chat.historyMessages.pushAssistant(answerGPT)
	} catch (error) {
		console.log(answerGPT)
	}

}