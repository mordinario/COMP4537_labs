const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("node:path");

// Lab 3
const LAB_3_PATH = "/COMP4537/lab3";
const utils = require(`.${LAB_3_PATH}/modules/utils`);

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

			// If not lab 3, assume static file GET request
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
					return res.end(`${filename}${utils.getString("404")}`);
				}

				const contentType = filename.endsWith(".js")
					? "application/javascript"
					: filename.endsWith(".css")
						? "text/css"
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
			HttpServer.handleLab3PartB(urlObj, res);
		}
	}

	static handleWriteFile(urlObj, res) {
		const LAB_3_READFILE = "." + LAB_3_PATH + "/readFile/";
		const content = urlObj.query.text;
		if (content === undefined) {
			res.writeHead(200, {
				"Content-Type": "text/html",
			});

			res.end(utils.getString("nothing"));
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

		fs.appendFile(`${LAB_3_READFILE}file.txt`, content, (err) => {
			if (err) {
				console.log(err);
			} else {
				res.writeHead(200, {
					"content-Type": "text/html",
				});
				res.end(
					`<p>${utils.getString("successfulWrite1")}
						${content}
						${utils.getString("successfulWrite2")}
						${LAB_3_READFILE}
						${utils.getString("successfulWrite3")}
					</p>`,
				);
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
				return res.end(`${file}${utils.getString("404")}`);
			}
			res.writeHead(200, {
				"Content-Type": "text/html",
			});

			res.end(data);
		});
	}

	static handleLab3PartB(urlObj, res) {
		console.log(urlObj.query);

		res.writeHead(200, {
			"Content-Type": "text/html",
		});
		res.end(
			`<p style="color: blue;">
				${utils.getString("greeting")}
				${urlObj.query["name"] || utils.getString("user")}
				${utils.getString("serverTime")}
				${utils.getDate()}.</p>`,
		);
	}
}

HttpServer.startServer();
