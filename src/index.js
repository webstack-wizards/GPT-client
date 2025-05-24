import MyGPT from "./ClientGPT.js"
import MessageHistory from "./MessageHistory.js"
import MyConsole from "./MyConsole.js"

// console.log(process.env.OPEN_AI_API_KEY)

const init = async () => {
	const historyMessages = new MessageHistory()
	const myCosnole = new MyConsole(historyMessages)
	const myGPT = new MyGPT({
		apiKey: process.env.OPEN_AI_API_KEY, 
		history: historyMessages
	})

	let lastAnswer = "What you want to ask?"
	while (true) {
		const result = await myCosnole.question(lastAnswer)
		
		if(!result){
			continue
		}
		if(result === "q"){
			// exit
			console.log("Thank for work, goodbye")
			break
		}
		if(result === "new"){
			historyMessages.clear()
			continue
		}


		try {
			const answerGPT = await myGPT.ask()
			// console.log(answerGPT)
			if(!answerGPT){
				break
			}

			if(answerGPT.choices.length !== 1){
				console.log('more then one choise')
			}
			
			lastAnswer = answerGPT.choices[0].message.content
			historyMessages.pushAssistant(answerGPT.choices[0].message.content)
		} catch (error) {
			break
		}

	}

	myCosnole.close()
	// console.log()

	console.log(historyMessages.getHistory())
	// setTimeout(() => {}, 4000);
}

init()