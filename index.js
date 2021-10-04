const express = require("express");
const { google } = require("googleapis");
const app = express();
const cors = require("cors");

// CONSTANTES DEFINIDAS
const auth = new google.auth.GoogleAuth({
    keyFile: "cred.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
});

// Create client instance for auth
const client = auth.getClient();

// Instance of Google Sheets API
const googleSheets = google.sheets({ version: "v4", auth: client });

const spreadsheetId = "1mUhl_FfdbIVPv48MBp0ZLqkBTXcwCKhCxsREMnE8PqY";

app.set('views', './views');
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));
app.use(cors());


app.get("/", (req, res) => {
    res.json('wsup');
});


app.post("/submit", async (req, res) => {
    let { monto, tipo, paga, tipoPers } = req.body;
    const fecha = new Date();
    const sheetnum = fecha.getMonth().toLocaleDateString("en-GB");
    if (paga === 'FC') { paga = ''; };
    if (tipo === 'pers') {tipo = tipoPers}
    if (tipo === 'INGRESO' ) {
        await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: sheetnum+"!A:E",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [[fecha.toLocaleDateString("en-GB"), tipo, monto, '', paga]],
            }
        })
    } else {
        await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: sheetnum+"!A:E",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [[fecha.toLocaleDateString("en-GB"), tipo, '', monto, paga]],
            }
        })
    }
    res.redirect('back');
});

app.listen(process.env.PORT || 1337, (req, res) => console.log('wsup'));