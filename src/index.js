import { Chat } from "./ChatClient.js";
import { transformeImageToBase64, getterFile } from "./helpers.js";
import TelegramBot from "node-telegram-bot-api"

const ADMIN_ID = process.env.ADMIN_TELEGRAM_ID

async function workerCommand ({msg, chats, bot}){
	const chatID = msg.chat.id;
	const userID = msg.from.id
	const messageText = msg.text
	if(String(userID) !== ADMIN_ID) return

	if(!messageText) return 

	if(messageText === '/start'){
		chats[chatID] = new Chat ({chatID})
		return bot.sendMessage(chatID, "Чат успішно створений")
	} 

	if(String(userID) !== ADMIN_ID) return

	const chat = chats[chatID]
	if(!chat) return
	
	switch (messageText) {
		case "/history":
			bot.sendMessage(chatID, "Готується істрія ції сессії")
			bot.sendMessage(chatID, JSON.stringify(chat.historyMessages.getHistory(), null, 4))
			bot.sendMessage(chatID, "Це вся історія цієї сессії") 
			break;
		case "/new":
		case "/reset":
			chat.historyMessages.clear()
			bot.sendMessage(chatID, "Контекст успішно видалений")
			break;
		case "/openfiles":
			chat.startFileSession()
			break;
		case "/closefiles":
			chat.endFilesSession()
			bot.sendMessage(chatID, "Файли готуються, трохи підождіть")
			chat.hotFiles = await Promise.all(chat.messageFiles.map(preImage => bot.getFile(preImage.file_id)).map((promImage) => getterFile(promImage)))
			bot.sendMessage(chatID, "Файли готові, можете писати промпт")
			break;
		default:
			bot.sendMessage(chatID, "Цієї команди не знаю")
			break;
	}
}

async function workerTextGPT ({msg, chats, bot}){
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

	bot.sendMessage(chatID, answerGPT.choices[0].message.content)
	chat.historyMessages.pushAssistant(answerGPT.choices[0].message.content)
}


const initTelegram = () => {
	const chats = {}

	const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
		polling: {

		}
	})
	
	bot.on("message", async (msg) => {
		if(/(?=\/)/.test(msg?.text)) return workerCommand({msg, chats, bot})
		
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