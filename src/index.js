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

	while (true) {
		const result = await myCosnole.question("User message:")
		
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
			console.log("Chat cleared, now you have new context.")
			continue
		}


		try {
			const answerGPT = await myGPT.ask()
			// console.log(answerGPT)
			if(!answerGPT){
				break
			}

			if(answerGPT.choices.length !== 1){
				console.log('More then one choise!')
			}
			
			// gpt answer 
			console.log(`\n\nGPT:\n${answerGPT.choices[0].message.content}\n\n`)
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