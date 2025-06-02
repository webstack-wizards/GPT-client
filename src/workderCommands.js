import { ADMIN_ID, getterFile } from "./helpers.js";
import { Chat } from "./ChatClient.js";


export async function workerCommand ({msg, chats, bot}){
	const chatID = msg.chat.id;
	const userID = msg.from.id
	const messageText = msg.text
	if(String(userID) !== ADMIN_ID) return

	if(!messageText) return 

	if(messageText === '/start'){
		chats[chatID] = new Chat ({chatID})
		return bot.sendMessage(chatID, "Чат успішно створений")
	} 

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
			if(chat.messageFiles.length < 1){
				bot.sendMessage(chatID, "Окей без файлів")
			} else {
				bot.sendMessage(chatID, "Файли готуються, трохи підождіть")
				chat.hotFiles = await Promise.all(chat.messageFiles.map(preImage => bot.getFile(preImage.file_id)).map((promImage) => getterFile(promImage)))
				bot.sendMessage(chatID, "Файли готові, можете писати промпт")
			}
			break;
		case "/cost":
				bot.sendMessage(chatID, JSON.stringify({
					lastMessage: chat.historyMessages.getCost(),
					sessionMessage: chat.historyMessages.getCost(),
					allMessage: chat.historyMessages.getCost()
				}, null, 4))
		case "/testing":
			// const answerGPT = await chat.myGPT.ask()
			// const content = answerGPT.choices[0].message.content

			// bot.sendMessage(chatID, content)
			// chat.historyMessages.pushAssistant(content)
			// break;
		default:
			bot.sendMessage(chatID, "Цієї команди не знаю")
			break;
	}
}