import { ADMIN_ID, getterFile } from "./helpers";
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