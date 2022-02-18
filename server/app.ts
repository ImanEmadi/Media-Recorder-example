import * as express from "express";
import { createServer } from 'http';
import * as multer from "multer";
import * as path from "path";
import * as fs from 'fs';
const app = express();
const server = createServer(app);

const multerMW = multer({
    storage: multer.diskStorage({
        destination: path.join(__dirname, "/temp"),
        filename: (req, file: Express.Multer.File, cb) => {
            cb(null, Math.ceil(Math.random() * 9e10).toString(28));
        }
    })
});



app.use((req, res, next) => {
    res.header({
        'Access-Control-Allow-Origin': 'http://127.0.0.1:5500',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept ,contentType,enctype,credential',
        'Access-Control-Allow-Credentials': 'true',
        'x-xss-protection': 0,
        'X-Download-Options': 'noopen',
        'X-Content-Type-Options': 'nosniff',
    });
    next();
});

// app.use(express.json({ limit: '1000mb' }));

app.use((req, res, next) => { //* resolve preflight requests
    if (req.method.toLowerCase() === 'options')
        res.status(200).end();
    else
        next();
});

app.get('/', (req, res, next) => {
    res.status(200).send("ALL FINE ! cheers mate !");
});

const uploadPath = path.join(__dirname, '/files');
app.post('/record', (req, res, next) => {
    multerMW.any()(req, res, function (err) {
        if (err) {
            console.error(err);
            return res.status(503).send('multer error');
        }
        if (!fs.existsSync(uploadPath)) {
            console.log('creating files dir');
            fs.mkdirSync(uploadPath);
        }
        Array.isArray(req.files) && req.files.forEach(f => {
            fs.renameSync(f.path, path.join(__dirname, "/files/", f.filename + ".mkv")); // for keeping original extension => + "f.originalname"
        });
        res.status(200).send('files received!');
    });
});


server.listen(3000);