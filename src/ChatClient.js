import MyGPT from "./ClientGPT.js"
import MessageHistory from "./MessageHistory.js"

export class Chat {
	chatID = null;
	historyMessages = null;
	myGPT = null;
	gettingFiles = false;
	allFiles = [];
	messageFiles = [];
	hotFiles = null;
	waiting = null;

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
		this.hotFiles = null
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
