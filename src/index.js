import TelegramBot from "node-telegram-bot-api"
import { workerCommand } from "./workderCommands.js"
import { workerTextGPT } from "./workerText.js"
import { Chat } from "./ChatClient.js"

const FAKE_ID = 'faijefoiajefo'

const initFaceRequest = async () => {
	const chat = new Chat({chatID: FAKE_ID})

	const answerGPT = await chat.myGPT.ask()
	const content = answerGPT.choices[0].message.content

	// bot.sendMessage(FAKE_ID, content)
	chat.historyMessages.pushAssistant(answerGPT)
}
// initFaceRequest()

const initTelegram = () => {
	const chats = {}

	const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
		polling: {

		}
	})
	
	bot.on("message", async (msg) => {
		if(/^\//.test(msg?.text)) return workerCommand({msg, chats, bot})
		
		const chat = chats[msg.chat.id]
		if(!chat) return 

		if(chat.getStatusFiles()) {
			console.log('files', chat.getStatusFiles())
			if(msg.photo){
				const objPhoto = msg.photo[msg.photo.length - 1]
				chat.addFile(objPhoto)
			}
		}

		if(msg.text) return workerTextGPT({msg, chats, bot})
	})
	return "some"
}

initTelegram()
