import { readFile, writeFile } from "./helper/helper.js"

const SETTINGS_USERS = {
	nameFile: "users.json",
	routeFile: "db"
}

class DB_users {
	constructor({adminID}){
		this.getDatabase()

		if(adminID){
			this.addUser(adminID, "admin")
		}
	}
	getDatabase(){
		try {
			const resultReaded = readFile({name: SETTINGS_USERS.nameFile, route: SETTINGS_USERS.routeFile})
			this.database = JSON.parse(resultReaded)
			return this.database
		} catch (error) {
			this.updateDB([])
		}
	}
	updateDB(data){
		this.database = data
		writeFile({data: JSON.stringify(data), name: SETTINGS_USERS.nameFile, route: SETTINGS_USERS.routeFile})
	}
	getUser(id) {
		return this.database.find(user => user.id === String(id))
	}
	addUser(id, role){
		if(this.getUser(id)){
			console.log(id, "This user already exist")
			return false
		}

		const user = {
			id: id,
			role,
			created: Date.now()
		}
		this.updateDB([...this.database, user])
	}
	removeUser(id){
		if(this.getUser(id)){
			console.log(id, "This user not exist")
			return false
		}
		updateDB([...this.database.filter(user => user.id === id)])
	}
	editUser(id){

	}
}

export default DB_users