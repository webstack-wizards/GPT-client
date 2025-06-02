import {transformeImageToBase64} from "./helpers.js";

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

}