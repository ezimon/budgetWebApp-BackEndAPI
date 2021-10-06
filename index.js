const express = require("express");
const { google } = require("googleapis");
const app = express();
const cors = require("cors");
const moment = require("moment");
// const bodyParser = require('body-parser');

// CONSTANTES DE GOOGLE DEFINIDAS
const auth = new google.auth.GoogleAuth({
    keyFile: "cred.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
});
const client = auth.getClient();
const googleSheets = google.sheets({ version: "v4", auth: client });
const spreadsheetId = "1mUhl_FfdbIVPv48MBp0ZLqkBTXcwCKhCxsREMnE8PqY";

app.set('views', './views');
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));
app.use(cors());
app.use(express.json())
// app.use(bodyParser.json);

app.get("/", (req, res) => {
    res.json('wsup');
});


app.get("/saldo", (req, res) => {
    const sheetname = moment().format('MMMM');
    googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: sheetname + '!G2',
    }, (err, result) => {
        if (err) {
            console.log('err')
        } else {
            const saldo = result.data.values[0].join('');
            res.json(saldo)
        }
    });
});


// app.get("/prueba", async(req, res) => {
//     const sheetname = moment().format('MMMM');
//     googleSheets.spreadsheets.values.get({
//         auth,
//         spreadsheetId,
//         range: sheetname+'!E:E',
//     }, (err, result) => {
//         if (err) {
//             console.log(err)
//         } else {
//             const cellValues = result.data.values;
//             console.log(cellValues);
//         }
//     });
// });

app.post("/submit", async (req, res) => {
    const fecha = new Date();
    let { monto, tipo, paga, tipoPers } = req.body;
    const sheetname = moment().format('MMMM');
    console.log(req.body);
    if (paga === 'FC') { paga = ''; };
    if (tipo === 'pers') { tipo = tipoPers };
    if (tipo === 'INGRESO') {
        await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: sheetname + "!A:E",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [[fecha.toLocaleDateString("en-GB"), tipo, monto, '', paga]],
            }
        })
    } else {
        await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: sheetname + "!A:E",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [[fecha.toLocaleDateString("en-GB"), tipo, '', monto, paga]],
            }
        })
    }
    res.status(200);
    res.redirect('back');
});

app.listen(process.env.PORT || 1337, (req, res) => console.log('wsup'));