import { COMMANDS, getterFile } from "./helpers.js";
import { Chat } from "./ChatClient.js";



async function handleHistory(chat, bot, chatID){
	bot.sendMessage(chatID, "Готується істрія ції сессії")
	bot.sendMessage(chatID, JSON.stringify(chat.historyMessages.getHistory(), null, 4))
	bot.sendMessage(chatID, "Це вся історія цієї сессії") 
}
async function handleCLoseFiles(chat, bot, chatID) {
	chat.endFilesSession()
	if(chat.messageFiles.length < 1){
		bot.sendMessage(chatID, "Окей без файлів")
	} else {
		bot.sendMessage(chatID, "Файли готуються, трохи підождіть")
		chat.hotFiles = await Promise.all(chat.messageFiles.map(preImage => bot.getFile(preImage.file_id)).map((promImage) => getterFile(promImage)))
		bot.sendMessage(chatID, "Файли готові, можете писати промпт")
	}
}


export async function workerCommand ({msg, chats, bot}){
	const chatID = msg.chat.id;
	const messageText = msg.text;
	

	if(!messageText) return 

	if(messageText === COMMANDS.START){
		chats[chatID] = new Chat ({chatID})
		return bot.sendMessage(chatID, "Чат успішно створений")
	} 

	const chat = chats[chatID]
	if(!chat) return
	
	switch (messageText) {
		case COMMANDS.HISTORY:
			return handleHistory()
		case COMMANDS.NEW:
		case COMMANDS.RESET:
			chat.historyMessages.clear()
			bot.sendMessage(chatID, "Контекст успішно видалений")
			break;
		case COMMANDS.OPEN_FILES:
			chat.startFileSession()
			break;
		case COMMANDS.CLOSE_FILES:
			return handleCLoseFiles()
		case COMMANDS.GET_COST:
			bot.sendMessage(chatID, JSON.stringify({
				lastMessage: chat.historyMessages.getCost(),
				sessionMessage: chat.historyMessages.getCost("session"),
				allMessage: chat.historyMessages.getCost("all")
			}, null, 4))
			break;
		case COMMANDS.TESTING:
			
		default:
			bot.sendMessage(chatID, "Цієї команди не знаю")
			break;
	}
}