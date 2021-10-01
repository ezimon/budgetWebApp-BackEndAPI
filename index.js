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



// app.post("/", async (req, res) => {
//     const { request, name } = req.body;
//     res.json('CARGADOOO');

//     // Get metadata about spreadsheet
//     const metaData = await googleSheets.spreadsheets.get({
//         auth,
//         spreadsheetId,
//     });

//     // Read rows from spreadsheet
//     const getRows = await googleSheets.spreadsheets.values.get({
//         auth,
//         spreadsheetId,
//         range: "pito!A:A",
//     });

//     // Write row(s) to spreadsheet
//     await googleSheets.spreadsheets.values.append({
//         auth,
//         spreadsheetId,
//         range: "pito!A:B",
//         valueInputOption: "USER_ENTERED",
//         resource: {
//             values: [['Concepto', 'Egreso']],
//         },
//     });

//     res.send("Successfully submitted! Thank you!");
// });

// const addInput = () => {
    
// }

app.post("/submit", async (req, res) => {
    let  {monto, tipo} = req.body;
    let fecha = new Date();
    await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "pito!A:C",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [[monto, tipo, fecha.toLocaleDateString("en-GB")]],
            }
        })
        res.redirect('http://localhost:3000');
    });

app.listen(process.env.PORT || 1337, (req, res) => console.log('wsup'));