import OpenAI from "openai"

const MODELS = {
	"gpt-4o": "gpt-4o",
	"gpt-4-turbo": "gpt-4-turbo"
}

const SETTINGS = {
	MODEL: MODELS["gpt-4-turbo"]
}


const EXAMPLES = [
	{
		id: 'chatcmpl-Be4TVIIvwM0tP0PKU00dpiV4uePJ7',
		object: 'chat.completion',
		created: 1748890021,
		model: 'gpt-4-turbo-2024-04-09',
		choices: [
			{
				index: 0,
				message: [Object],
				logprobs: null,
				finish_reason: 'stop'
			}
		],
		usage: {
			prompt_tokens: 33,
			completion_tokens: 20,
			total_tokens: 53,
			prompt_tokens_details: { cached_tokens: 0, audio_tokens: 0 },
			completion_tokens_details: {
				reasoning_tokens: 0,
				audio_tokens: 0,
				accepted_prediction_tokens: 0,
				rejected_prediction_tokens: 0
			}
		},
		service_tier: 'default',
		system_fingerprint: 'fp_de235176ee'
	},
	{
		id: 'chatcmpl-Be4Uhaeaz52EfLaxMFnjHehB9gTK8',
		object: 'chat.completion',
		created: 1748890095,
		model: 'gpt-4-turbo-2024-04-09',
		choices: [
			{
				index: 0,
				message: [Object],
				logprobs: null,
				finish_reason: 'stop'
			}
		],
		usage: {
			prompt_tokens: 1139,
			completion_tokens: 209,
			total_tokens: 1348,
			prompt_tokens_details: { cached_tokens: 0, audio_tokens: 0 },
			completion_tokens_details: {
				reasoning_tokens: 0,
				audio_tokens: 0,
				accepted_prediction_tokens: 0,
				rejected_prediction_tokens: 0
			}
		},
		service_tier: 'default',
		system_fingerprint: 'fp_de235176ee'
	},
	{
		id: 'chatcmpl-Be4YRMgW8dHL38j5Cn6IBMPL6IdGb',
		object: 'chat.completion',
		created: 1748890327,
		model: 'gpt-4-turbo-2024-04-09',
		choices: [
			{
				index: 0,
				message: {
					"role": "assistant",
					"content": "Это вид на город Киев, столицу Украины. Здесь видны характерные места, такие как мост через реку Днепр и вид на Подол, один из исторических районов города."
				},
				logprobs: null,
				finish_reason: 'stop'
			}
		],
		usage: {
			prompt_tokens: 2468,
			completion_tokens: 242,
			total_tokens: 2710,
			prompt_tokens_details: { cached_tokens: 0, audio_tokens: 0 },
			completion_tokens_details: {
				reasoning_tokens: 0,
				audio_tokens: 0,
				accepted_prediction_tokens: 0,
				rejected_prediction_tokens: 0
			}
		},
		service_tier: 'default',
		system_fingerprint: 'fp_de235176ee'
	},
	{
		id: 'chatcmpl-Be4Z869OEhjmiphPCJaDh505HpM3m',
		object: 'chat.completion',
		created: 1748890370,
		model: 'gpt-4-turbo-2024-04-09',
		choices: [
			{
				index: 0,
				message: {
					"role": "assistant",
					"content": "По изображению видно, что небо облачное с просветами, что указывает на переменчивую погоду. На реке Днепр нет льда, что может указывать на относительно теплую погоду для зимнего или ранневесеннего периода. Однако для точного ответа о погоде в Киеве в настоящий момент, я рекомендую проверить актуальный прогноз в интернете или погодных приложениях."
				},
				logprobs: null,
				finish_reason: 'stop'
			}
		],
		usage: {
			prompt_tokens: 3833,
			completion_tokens: 88,
			total_tokens: 3921,
			prompt_tokens_details: { cached_tokens: 0, audio_tokens: 0 },
			completion_tokens_details: {
				reasoning_tokens: 0,
				audio_tokens: 0,
				accepted_prediction_tokens: 0,
				rejected_prediction_tokens: 0
			}
		},
		service_tier: 'default',
		system_fingerprint: 'fp_de235176ee'
	}
]


class MyGPT {
	constructor({apiKey, history}){
		this.initGPT(apiKey)
		this.history = history
	}

	initGPT(apiKey){
		this.openAI = new OpenAI({
			apiKey
		})
	}

	async ask(){
		try {
			const result = EXAMPLES[EXAMPLES.length - 1]
			return result

			// return this.openAI.chat.completions.create({
			// 	model: SETTINGS.MODEL,
			// 	messages: this.history.getHistory()
			// })
		} catch (error) {
			console.log(error)
			return false
		}
	}
}

export default MyGPT