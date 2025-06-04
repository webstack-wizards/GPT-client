import TelegramBot from "node-telegram-bot-api"
import { workerCommand } from "./workderCommands.js"
import { workerTextGPT } from "./workerText.js"
import { ADMIN_ID, SETTINGS } from "./helpers.js"


const initTelegram = () => {
	const chats = {}

	const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
		polling: {

		}
	})
	
	bot.on("message", async (msg) => {
		if(String(msg.from.id) !== ADMIN_ID) return
		if(/^\//.test(msg?.text)) return workerCommand({msg, chats, bot})
		
		const chat = chats[msg.chat.id]
		if(!chat) return 

		if(chat.getStatusFiles()) {
			if(SETTINGS.supportImageJPEG){
				console.log('files', chat.getStatusFiles())
				if(msg.photo){
					const objPhoto = msg.photo[msg.photo.length - 1]
					chat.addFile(objPhoto)
				}
			} else {
				bot.sendMessage("Sorry but now image switch off")
			}
		}

		if(msg.text) return workerTextGPT({msg, chats, bot})
	})
}

initTelegram()
