const http = require('http');
const url = require('url');
const fs = require('fs');

// Lab 3
const date = require('./COMP4537/lab3/modules/utils')

class HttpServer {
    static startServer() {
        http.createServer(function(req, res) {
            const reqUrl = url.parse(req.url, true);
            
            // Add dot so pathing works
            const filename = "." + reqUrl.pathname;
            console.log(filename);

            // Lab 3 is exclusively server-side; handle special case
            if(reqUrl.pathname.startsWith("/COMP4537/lab3")) {
                return HttpServer.handleLab3(req, res);
            }

            // If not lab 3, assume static file GET request
            return HttpServer.handleStaticLabs(filename, res);
        }).listen(8080);
    }

    static handleStaticLabs(filename, res) {
        // Set request to index.html if no file specified
        fs.readFile(filename + (filename.endsWith("/") ? "index.html" : ""), function(err, data) {
            if(err) {
                console.log(err);
                res.writeHead(404, {
                    'Content-Type': 'text/html'
                });
                return res.end(filename + " 404 not found");
            }

            const contentType = (filename.endsWith(".js")) ? 'application/javascript' :
                                (filename.endsWith(".css")) ? 'text/css' :
                                'text/html';

            res.writeHead(200, {
                'Content-Type': contentType
            });

            res.end(data);
        });
    }

    static handleLab3(req, res) {
        const urlObj = url.parse(req.url, true);
        console.log(urlObj.query);
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end('<p style="color: blue;">Hello ' + (urlObj.query['name'] || 'User') 
              + '. Server current date and time is ' + date.getDate() + '.</p>');
    }
}

HttpServer.startServer();