const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("node:path");

// Lab 3
const LAB_3_PATH = "/COMP4537/lab3";
const utils = require(`.${LAB_3_PATH}/modules/utils`);
const strings = require(`.${LAB_3_PATH}/lang/messages/en/user`);

// Lab 4
const LAB_4_API_PATH = "/COMP4537/lab4/api/v1/sql/"
const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();
const mysqlPool = mysql.createPool({
	host: process.env.MYSQLHOST,
	port: process.env.MYSQLPORT,
	user: process.env.MYSQLUSER,
	password: process.env.MYSQLPASSWORD,
	database: process.env.MYSQLDATABASE
})

class HttpServer {
	static startServer() {
		http.createServer(function (req, res) {
			const reqUrl = url.parse(req.url, true);

			// Add dot so pathing works
			const filename = "." + reqUrl.pathname;
			console.log(filename);

			// Lab 3 is exclusively server-side; handle special case
			if (reqUrl.pathname.startsWith(LAB_3_PATH)) {
				return HttpServer.handleLab3(req, res);
			}

			// Lab 4 is both server requests and static files;
			// Send to both
			if(reqUrl.pathname.startsWith(LAB_4_API_PATH)) {
				return HttpServer.handleLab4Api(req, res);
			}

			// If not lab 3 or 4, assume static file GET request
			return HttpServer.handleStaticLabs(filename, res);
		}).listen(8080);
	}

	static handleStaticLabs(filename, res) {
		// Set request to index.html if no file specified
		fs.readFile(
			filename + (filename.endsWith("/") ? "index.html" : ""),
			function (err, data) {
				if (err) {
					console.log(err);
					res.writeHead(404, {
						"Content-Type": "text/html",
					});
					return res.end(strings.fileNotFound(filename));
				}

				const contentType = filename.endsWith(".js") ? "application/javascript"
					              : filename.endsWith(".css") ? "text/css"
						                                      : "text/html";

				res.writeHead(200, {
					"Content-Type": contentType,
				});

				res.end(data);
			},
		);
	}

	static handleLab3(req, res) {
		const urlObj = url.parse(req.url, true);

		if (urlObj.pathname.startsWith(LAB_3_PATH + "/writeFile/")) {
			HttpServer.handleWriteFile(urlObj, res);
		} else if (urlObj.pathname.startsWith(LAB_3_PATH + "/readFile/")) {
			HttpServer.handleReadFile(urlObj, res);
		} else {
			HttpServer.handleLab3Greeting(urlObj, res);
		}
	}

	static handleWriteFile(urlObj, res) {
		const LAB_3_READFILE = "." + LAB_3_PATH + "/readFile/";
		const content = urlObj.query.text;
		if (content === undefined) {
			res.writeHead(200, {
				"Content-Type": "text/html",
			});

			res.end(strings.NOTHING_TO_WRITE);
			return;
		}

		try {
			if (!fs.existsSync(LAB_3_READFILE)) {
				fs.mkdirSync(LAB_3_READFILE);
				fs.writeFile(`${LAB_3_READFILE}file.txt`, "", (err) => {
					if (err) {
						console.log(err);
					} else {
						console.log(`Created ${LAB_3_READFILE}file.txt`);
					}
				});
			}
		} catch (err) {
			console.error(err);
		}

		fs.appendFile(`${LAB_3_READFILE}file.txt`, content + "\n", (err) => {
			if (err) {
				console.log(err);
			} else {
				res.writeHead(200, {
					"content-Type": "text/html",
				});
				res.end(strings.successfulWrite(content, LAB_3_READFILE));
			}
		});
	}

	static handleReadFile(urlObj, res) {
		const file = path.basename(urlObj.pathname);

		fs.readFile(`.${LAB_3_PATH}/readFile/${file}`, "utf8", (err, data) => {
			if (err) {
				console.log(err);
				res.writeHead(404, {
					"Content-Type": "text/html",
				});
				return res.end(strings.fileNotFound(file));
			}
			res.writeHead(200, {
				"Content-Type": "text/html",
			});
			res.end(`<p style="white-space:pre-wrap;">${data}</p>`);
		});
	}

	static handleLab3Greeting(urlObj, res) {
		console.log(urlObj.query);

		res.writeHead(200, {
			"Content-Type": "text/html",
		});
		res.end(`<p style="color: blue;">${
                strings.greeting(urlObj.query.name || strings.DEFAULT_USERNAME, 
                                 utils.getDate())
                }</p>`);
	}

	static handleLab4Api(req, res) {
		// Since we know the url path starts with the lab 4 API path,
		// we can ignore the first few characters up to the length of
		// the lab 4 API path to (hopefully) get the SQL statement
		const urlObj = url.parse(req.url, true);
		console.log(urlObj);
		const SQLStatement = urlObj.pathname.substring(LAB_4_API_PATH.length);

		mysqlPool.query(decodeURIComponent(SQLStatement), function (err, result, fields) {
			console.log("err: ", err, "res: ", result, "fields: ", fields)

			res.writeHead(200, {
				"Content-Type": "text/html"
			});
			res.end(result);
		});
	}
}

HttpServer.startServer();
