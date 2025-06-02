import fs from "fs";
import request from "request";

export function taskDate(timestamp) {
	const date = new Date(timestamp);
	const formattedDate = date.toISOString().split('T')[0];
	return formattedDate
}

export function writeFile (data, timestamp = Date.now()) {
	fs.writeFileSync(`./logs/history-${timestamp}.json`, data);
}

export function downloadFile (url, fileName){
	return new Promise((resolve, reject) => {
		request.head(url, (err, res, body) => {
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

export function transformeImageToBase64 (nameFile) {
	const fileData = fs.readFileSync(`./files/${nameFile}`, { encoding: "base64" });
	return `data:image/jpeg;base64,${fileData}`;
}