const express = require("express");
const {google} = require("googleapis");
const app = express();

app.get("/", async (req, res) => {

    const auth = new google.auth.googleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();

    const spreadsheetId = "1mUhl_FfdbIVPv48MBp0ZLqkBTXcwCKhCxsREMnE8PqY";

    const googleSheets = google.sheets({version: "v4", auth: client});

    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,
    })

    res.send(metaData);


});

app.listen(1337, (req, res) => console.log("runnin"));