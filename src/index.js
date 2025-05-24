import MessageHistory from "./MessageHistory.js"
import MyConsole from "./MyConsole.js"


const init = async () => {
	const historyMessages = new MessageHistory()
	// const myGPT = new MyGPT(process.env.OPEN_AI_API_KEY, historyMessages)
	const myCosnole = new MyConsole(historyMessages)

	while (true) {
		const result = await myCosnole.question("What you want to ask?")
		
		if(result === "q"){
			// exit
			console.log("Thank for work, goodbye")
			break
		}
		if(result === "new"){
			historyMessages.clear()
		}
	}

	myCosnole.close()

	console.log(historyMessages.getHistory())
	// setTimeout(() => {}, 4000);
}

init()