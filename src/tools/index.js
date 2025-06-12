import { getWeather } from "./weather.js"

export { getWeather }


// example of using tool in client.ask()

// const toolsFn = {
// 	tools: [
// 		{
// 			type: "function",
// 			function: {
// 					name: "get_weather",
// 					description: "Get current temperature for provided coordinates in celsius.",
// 					parameters: {
// 							type: "object",
// 							properties: {
// 									latitude: { type: "number" },
// 									longitude: { type: "number" }
// 							},
// 							required: ["latitude", "longitude"],
// 							additionalProperties: false
// 					},
// 					strict: true
// 			},
// 		}
// 	],
// 	fns: {
// 		get_weather: getWeather
// 	}
// }