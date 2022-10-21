const PORT = process.env.PORT || 3000;
const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();

const path = require('path');

const multer = require('multer');

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './subidas')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:4200/'
}));

app.get('/', (req, res) => {
    return res.send('aqui')
});

app.post('/upload', upload.single('file'), (req, res) => {
    const response = {
        id: uuidv4(),
        file: req.file
    }
    return res.send(response);
});

app.post('/delete', (req, res) => {
    const url = __dirname + '/subidas/' + req.body.id;
    fs.unlink(url, (error) => {
        if (error) {
            return res.json({
                ok: false,
                error: error,
                messagge: 'Error eliminando archivo' 
            })
        }
        return res.json({
            ok: true,
            error: false,
            messagge: 'Archivo eliminado'
        })
    })
   
});

app.listen(PORT, () => {
    console.log(`server in : ${PORT}`);
})
