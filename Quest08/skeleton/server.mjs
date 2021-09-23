import http from 'http';
import qs from "querystring";
import fs from "fs";
import { Buffer } from "buffer";

const ROOT = "http://localhost:8080";
const server = http.createServer((req, res) => {
    const myUrl = new URL(ROOT+req.url);
    if('/' === myUrl.pathname) {
        res.end("home");
    }
    if('/foo' === myUrl.pathname) {
        if(req.method === "GET") {
            res.end(`Hello, ${myUrl.searchParams.get("bar")}`);
        } else if(req.method === "POST") {
            req.setEncoding('utf-8');
            let resData = '';

            req.on('data', (chunk) => {
                resData += chunk;
                resData = qs.parse(resData);
            });
            
            req.on('end', () => {
                const { bar } = resData;
                res.end(`Hello, ${bar}`);
            })
        }
    }

    const picUrl = myUrl.pathname.split('/');
    if(picUrl[1] === "pic") {
        if(picUrl[2] === "upload") {
            let fileSrc;
            req.on('data', (chunk) => {
                console.log(chunk);
                fileSrc = chunk; //new Buffer.from(chunk).toString('base64');
                console.log(fileSrc);
            })
            req.on('end', () => {
                fs.writeFile("test.jpg", fileSrc, (err) => {
                    console.log(err);
                });

            })
        }
    }

    console.log(req.method);
});

const data = JSON.stringify({
    "msg": 'postimmm'
})

const options = {
    hostname: "localhost",
    port: 8000,
    path: '/foo',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(`Hello, ${data}`)
    }
};

server.listen(8000);