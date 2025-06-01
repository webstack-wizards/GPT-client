import fs from "fs";
import http from "http";
import https from "https";
import path, { resolve } from "path";
import request from "request";

export function taskDate(timestamp) {
	const date = new Date(timestamp);
	const formattedDate = date.toISOString().split('T')[0];
	return formattedDate
}

export function writeFile (data, timestamp = Date.now()) {
	fs.writeFileSync(`./logs/history-${taskDate(timestamp)}.json`, data);
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

// export function downloadFile(url, fileName) {
//   return new Promise((resolve, reject) => {
//     const fileStream = fs.createWriteStream(`./files/${fileName}`);
//     const stream = request(url)
//       .pipe(fileStream)
//       .on("finish", () => {
//         console.log(`File ${fileName} downloaded!`);
//         resolve(); // Файл успешно загружен
//       })
//       .on("error", (err) => {
//         console.error("Error while downloading:", err);
//         reject(err); // Ошибка при скачивании
//       });
//   });
// }