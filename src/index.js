import MyGPT from "./ClientGPT.js"
import MessageHistory from "./MessageHistory.js"
import TelegramBot from "node-telegram-bot-api"


const initTelegram = () => {
	const chats = {}

	const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true})

	bot.on("message", async (msg) => {
		const chatId = msg.chat.id;
		const messageText = msg.text
		const userID = msg.from.id

		if(String(userID) !== process.env.ADMIN_TELEGRAM_ID) return

		if(messageText === '/start'){
			const historyMessages = new MessageHistory({save: true})
			chats[chatId] = {
				chatId,
				historyMessages,
				myGPT: new MyGPT({
					apiKey: process.env.OPEN_AI_API_KEY, 
					history: historyMessages
				})
			}
			
			bot.sendMessage(chatId, "Чат успішно створений")
		}

		console.log(msg)

		const chat = chats[chatId]
		if(!chat) return


		if(messageText?.[0] === "/"){
			switch (messageText) {
				case "/history":
					
					bot.sendMessage(chatId, "Готується істрія ції сессії")
					bot.sendMessage(chatId, chat.historyMessages.getHistory())
					bot.sendMessage(chatId, "Це вся історія цієї сессії")
					break;
				case "/new":
				case "/reset":
					chat.historyMessages.clear()
					bot.sendMessage(chatId, "Контекст успішно видалений")
					break;
			
				default:
					break;
			}
		} else {
			chat.historyMessages.pushUser(messageText)
			// // const answerGPT = await chat.myGPT.ask()

			// bot.sendMessage(chat.chatId, answerGPT.choices[0].message.content)
			// chat.historyMessages.pushAssistant(answerGPT.choices[0].message.content)
		}
		console.log(messageText)
	})
}


initTelegram()