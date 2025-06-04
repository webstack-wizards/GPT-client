import fs from "fs";
import request from "request";
import path from "path"

const rootPath = process.cwd()

function checkDir(route) {
	const createdRoute = path.join(rootPath, route)
	fs.mkdirSync(createdRoute, { recursive: true })
}

export function writeFile ({data, name = `${Date.now()}.txt`, route = "/logs/other"}) {
	checkDir(route)
	fs.writeFileSync(path.join(rootPath, route, name), data)
}



export const ADMIN_ID = process.env.ADMIN_TELEGRAM_ID

export function taskDate(timestamp) {
	const date = new Date(timestamp);
	const formattedDate = date.toISOString().split('T')[0];
	return formattedDate
}

export function writeFileHistory (data, timestamp = Date.now()){
	writeFile({
		data,
		route: "/logs/histories",
		name: `${timestamp}.json`
	})
}
export function downloadFile (url, fileName){
	return new Promise((resolve, reject) => {
		request.head(url, (err, res, body) => {
			checkDir("/files")
			request(url)
			.pipe(
				fs.createWriteStream(`./files/${fileName}`)
			).on('close', () => {
				resolve(fileName)
				console.log(`File ${fileName} downloaded!`)
			});
		});
	})
}

export async function getterFile (data) {
	const dataImage = await data
	const format = dataImage.file_path.match(/(?<=\.)\w*$/)?.[0]
	// // place for error
	return downloadFile(`http://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${dataImage.file_path}`, `${dataImage.file_unique_id}.${format}`)
}


export function transformeImageToBase64 (nameFile) {
	const fileData = fs.readFileSync(`./files/${nameFile}`, { encoding: "base64" });
	return `data:image/jpeg;base64,${fileData}`;
}