import MyGPT from "./ClientGPT.js"
import { downloadFile, transformeImageToBase64, writeFile } from "./helpers.js";
import MessageHistory from "./MessageHistory.js"
import TelegramBot from "node-telegram-bot-api"

const ADMIN_ID = process.env.ADMIN_TELEGRAM_ID

const placeHOlder = [
  {
    file_id: 'AgACAgIAAxkBAAIBoGg8vaWbJGsbYW_3qfjsLlmq1g8BAAJt9DEbcdLgSWoEdnvk0EwcAQADAgADeQADNgQ',
    file_unique_id: 'AQADbfQxG3HS4El-',
    file_size: 69447,
    width: 1026,
    height: 248
  },
  {
    file_id: 'AgACAgIAAxkBAAIBs2g8vnv7lJRwvm82502-NMPUkONaAAJ69DEbcdLgSRkgIL6KA-H7AQADAgADeAADNgQ',
    file_unique_id: 'AQADevQxG3HS4El9',
    file_size: 8301,
    width: 800,
    height: 114
  },
  {
    file_id: 'AgACAgIAAxkBAAIBpGg8vbLHETzkQtYHBKCmhSKEDmp9AAJu9DEbcdLgSR4QNIY6-IloAQADAgADeAADNgQ',
    file_unique_id: 'AQADbvQxG3HS4El9',
    file_size: 26806,
    width: 658,
    height: 201
  },
  {
    file_id: 'AgACAgIAAxkBAAIBpWg8vcgTDtfOQMo06svmX9-sJs3KAAJv9DEbcdLgSWDiE537C5WdAQADAgADeQADNgQ',
    file_unique_id: 'AQADb_QxG3HS4El-',
    file_size: 47352,
    width: 1132,
    height: 583
  },
  {
    file_id: 'AgACAgIAAxkBAAIBpmg8vciHoC16oiaTwqSgvpGkBULPAAJw9DEbcdLgSYxuX0NxrmHUAQADAgADeAADNgQ',
    file_unique_id: 'AQADcPQxG3HS4El9',
    file_size: 23715,
    width: 519,
    height: 515
  },
  {
    file_id: 'AgACAgIAAxkBAAIB8Wg8xnjtAl9EiKaKfdO626tLgQMlAAKn9DEbcdLgSbfsEcv2MA-IAQADAgADeQADNgQ',
    file_unique_id: 'AQADp_QxG3HS4El-',
    file_size: 37485,
    width: 928,
    height: 502
  }
]
const PHOTO_ID = "AgACAgIAAxkBAAIBnWg8rRhKdc3ASwy1383aFwjGS_IkAAIR9DEbcdLgSeQaEnDuRhIdAQADAgADeAADNgQ"

class Chat {
	chatID = null;
	historyMessages = null;
	myGPT = null;
	gettingFiles = false;
	allFiles = [];
	messageFiles = [];
	hotFiles = null;

	constructor({chatID, saving = true}){
		this.chatID = chatID;
		this.historyMessages = new MessageHistory({save: saving});
		this.myGPT = new MyGPT({
			apiKey: process.env.OPEN_AI_API_KEY, 
			history: this.historyMessages
		});
	}

	// working with sending photos
	addFile = function (obj) {
		this.allFiles.push(obj)
		this.messageFiles.push(obj)
	};
	clearFiles = function () {
		this.messageFiles = []
	};
	getStatusFiles = function (){
		return this.gettingFiles;
	};
	startFileSession = function () {
		this.gettingFiles = true
	};
	endFilesSession = function () {
		this.gettingFiles = false
	}
	// end working with sending photos
}


async function getterFile (data) {
	const dataImage = await data
	const format = dataImage.file_path.match(/(?<=\.)\w*$/)?.[0]
	// // place for error
	return downloadFile(`http://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${dataImage.file_path}`, `${dataImage.file_unique_id}.${format}`)
}

async function workerCommand ({msg, chats, bot}){
	const chatID = msg.chat.id;
	const userID = msg.from.id
	const messageText = msg.text
	if(String(userID) !== ADMIN_ID) return

	if(!messageText) return 

	if(messageText === '/start'){
		const historyMessages = 
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
			bot.sendMessage(chatID, "Команда")
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

		if(msg.media_group_id) {

		}
	})


}


initTelegram()