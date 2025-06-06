import { COMMANDS, getterFile, SETTINGS } from "./helpers.js";
import { Chat } from "./ChatClient.js";
import { roles } from "./role.js";



async function handleHistory(chat, bot, chatID){
	bot.sendMessage(chatID, "The history of this session is being prepared.")
	bot.sendMessage(chatID, JSON.stringify(chat.historyMessages.getHistory(), null, 4))
	bot.sendMessage(chatID, "That's the whole story of this session.") 
}
async function handleCloseFiles(chat, bot, chatID) {
	chat.endFilesSession()
	if(chat.messageFiles.length < 1){
		bot.sendMessage(chatID, "Okay, no files")
	} else {
		bot.sendMessage(chatID, "Files are being prepared, please wait a moment")
		chat.hotFiles = await Promise.all(chat.messageFiles.map(preImage => bot.getFile(preImage.file_id)).map((promImage) => getterFile(promImage)))
		bot.sendMessage(chatID, "The files are ready, you can write the prompt.")
	}
}


export async function workerCommand ({msg, chats, bot, user}){
	const chatID = msg.chat.id;
	const messageText = msg.text;

	if(!messageText) return bot.sendMessag(chatID, `Wrong message ${messageText}`)

	if (
			!roles[user.role].includes(messageText) || 
			(SETTINGS.supportImageJPEG === false &&
				(messageText === COMMANDS.OPEN_FILES || messageText === COMMANDS.CLOSE_FILES)
				)
		) {
    return bot.sendMessage(chatID, "You don't have rigth for using this command or this command switch off.");
  }


	if(messageText === COMMANDS.START){
		chats[chatID] = new Chat ({chatID})
		return bot.sendMessage(chatID, "Chat successfully created")
	} 

	const chat = chats[chatID]
	if(!chat) return
	
	switch (messageText) {
		case COMMANDS.HISTORY:
			return handleHistory(chat, bot, chatID)
		case COMMANDS.NEW:
		case COMMANDS.RESET:
			chat.historyMessages.clear()
			bot.sendMessage(chatID, "Context cleared.")
			break;
		case COMMANDS.OPEN_FILES:
			chat.startFileSession()
			break;
		case COMMANDS.CLOSE_FILES:
			return handleCloseFiles(chat, bot, chatID)
		case COMMANDS.GET_COST:
			bot.sendMessage(chatID, JSON.stringify({
				lastMessage: chat.historyMessages.getCost(),
				sessionMessage: chat.historyMessages.getCost("session"),
				allMessage: chat.historyMessages.getCost("all")
			}, null, 4))
			break;
		case COMMANDS.TESTING:
			
		default:
			bot.sendMessage(chatID, "Command not recognized")
			break;
	}
}