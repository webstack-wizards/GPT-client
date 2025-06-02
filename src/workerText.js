import {transformeImageToBase64} from "./helpers";

export async function workerTextGPT ({msg, chats, bot}){
	const chatID = msg.chat.id
	const chat = chats[chatID]
	
	const messageText = msg.text
	if(!chat.hotFiles){
		chat.historyMessages.pushUser(messageText)
	} else {
		chat.historyMessages.pushMessageWithImage("user", messageText, chat.hotFiles.map(url => transformeImageToBase64(url)))
		chat.clearFiles()
	}

	const answerGPT = await chat.myGPT.ask()
	const content = answerGPT.choices[0].message.content

	bot.sendMessage(chatID, content)
	chat.historyMessages.pushAssistant(content)
}