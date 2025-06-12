import {transformeImageToBase64} from "./helper/helper.js";


export async function workerTextGPT ({msg, chats, bot}){
	const chatID = msg.chat.id
	const chat = chats[chatID]
	
	const messageText = msg.text
	if(!chat.waiting){
		if(!chat.hotFiles){
			chat.historyMessages.pushUser(messageText)
		} else {
			chat.historyMessages.pushUser(messageText, chat.hotFiles.map(url => transformeImageToBase64(url)))
			chat.clearFiles()
		}
	} else {
		clearTimeout(chat.waiting)
		chat.historyMessages.pushUser(messageText)
	}


	const askerGPT = async () => {
		chat.historyMessages.pushMessage()
		const answerGPT = await chat.myGPT.ask()

		try {
			bot.sendMessage(chatID, answerGPT.choices[0].message.content, {
				parse_mode: "Markdown"
			})
		} catch (error) {
			console.log(answerGPT)
		}
		chat.waiting = null
	}

	chat.waiting = setTimeout(askerGPT, 1000)

}