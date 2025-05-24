import readline from 'node:readline'

class MyConsole {
	constructor(history){
		this.history = history
		this.rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		})
	}
	question(questionText){
		this.history.pushAssistant(questionText)
		return new Promise(resolve => {
			this.rl.question(`${questionText}\n`, (text) => {
				this.history.pushUser(text)
				resolve(text)
			})
		})
	}
	close(){
		this.rl.close()
	}
}

export default MyConsole