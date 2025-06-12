import TelegramBot from "node-telegram-bot-api"
import { workerCommand } from "./workderCommands.js"
import { workerTextGPT } from "./workerText.js"
import { SETTINGS } from "./helper/helper.js"
import DB_users from "./dbUsers.js"



const initTelegram = () => {
	const userWorker = new DB_users({adminID: process.env.ADMIN_TELEGRAM_ID})
	const chats = {}

	const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
		polling: {

		}
	})
	
	bot.on("message", async (msg) => {
		const userID = msg.from.id;
		const userData = userWorker.getUser(userID)

		if(userData.role !== "admin") return
		if(/^\//.test(msg?.text)) return workerCommand({msg, chats, bot, user: userData})
		
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
