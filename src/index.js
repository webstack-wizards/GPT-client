import TelegramBot from "node-telegram-bot-api"
import { workerCommand } from "./workderCommands.js"
import { workerTextGPT } from "./workerText.js"



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
