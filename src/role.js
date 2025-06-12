import { COMMANDS } from "./helper/helper.js";

const CAND_ADMIN = ["TESTING"]

export const roles = {
	user: [
		COMMANDS.START,
		COMMANDS.HISTORY,
		COMMANDS.NEW,
		COMMANDS.GET_COST
	],
	admin: Object.keys(COMMANDS).filter(item => !CAND_ADMIN.some(name => name === item)).map(name => COMMANDS[name]),
	creator: COMMANDS
}
