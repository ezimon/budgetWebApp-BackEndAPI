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

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/views"));
app.use(cors());
app.use(express.json());
// app.use(bodyParser.json);

app.get("/", (req, res) => {
  res.json("Whatchu looking at?");
});

//////////////////////////////////////////////////////
// SALDAR

app.get("/saldarD", (req, res) => {
  const sheetname = moment().format("MMMM");
  googleSheets.spreadsheets.values.get(
    {
      auth,
      spreadsheetId,
      range: sheetname + "!J2",
    },
    (err, result) => {
      if (err) {
        console.log("err");
      } else {
        const saldaD = result.data.values[0].join("");
        res.json(saldaD);
      }
    }
  );
});

app.get("/saldarS", (req, res) => {
  const sheetname = moment().format("MMMM");
  googleSheets.spreadsheets.values.get(
    {
      auth,
      spreadsheetId,
      range: sheetname + "!K2",
    },
    (err, result) => {
      if (err) {
        console.log("err");
      } else {
        const saldaS = result.data.values[0].join("");
        res.json(saldaS);
      }
    }
  );
});

//////////////////////////////////////////////////////
// CORRESP

app.get("/correspD", (req, res) => {
  const sheetname = moment().format("MMMM");
  googleSheets.spreadsheets.values.get(
    {
      auth,
      spreadsheetId,
      range: sheetname + "!I2",
    },
    (err, result) => {
      if (err) {
        console.log("err");
      } else {
        const correspD = result.data.values[0].join("");
        res.json(correspD);
      }
    }
  );
});

app.get("/correspS", (req, res) => {
  const sheetname = moment().format("MMMM");
  googleSheets.spreadsheets.values.get(
    {
      auth,
      spreadsheetId,
      range: sheetname + "!H2",
    },
    (err, result) => {
      if (err) {
        console.log("err");
      } else {
        const correspS = result.data.values[0].join("");
        res.json(correspS);
      }
    }
  );
});

//////////////////////////////////////////////////////

app.get("/promedio", (req, res) => {
  const sheetname = moment().format("MMMM");
  const daysLeft = 30 - moment().format("DD");
  googleSheets.spreadsheets.values.get(
    {
      auth,
      spreadsheetId,
      range: sheetname + "!G2",
    },
    (err, result) => {
      if (err) {
        console.log("err");
      } else {
        const saldo = result.data.values[0].join("");
        const promedioRaw = saldo / daysLeft;
        const promedio = Math.round(promedioRaw);
        res.json(promedio);
      }
    }
  );
});

// app.get("/update", (reg, res) => {
//   const sheetname = moment().format("MMMM");
//   const sheetnameP = moment().subtract(1, "M").format("MMMM");

//   if (moment().format("D") === 1) {
//     googleSheets.spreadsheets.values.get(
//       {
//         auth,
//         spreadsheetId,
//         range: sheetnameP + "!G2",
//       },
//       (err, result) => {
//         if (err) {
//           console.log("err");
//         } else {
//           const saldoP = result.data.values[0].join("");
//         }
//       }
//     );
//   }
// });

// googleSheets.spreadsheets.values.get({
//     auth,
//     spreadsheetId,
//     range: sheetname + '!U2',
// }, (err, result) => {
//     if (err) {
//         console.log('err')
//     } else {
//         const dia = result.data.values[0].join('').slice(0, 2);
//         res.json(30-dia);
//     }
// });
// googleSheets.spreadsheets.values.get({
//     auth,
//     spreadsheetId,
//     range: sheetname + '!G2',
// }, (err, result) => {
//     if (err) {
//         console.log(err)
//     } else {
//         const saldo = result.data.value[0].join('');
//         res.json(saldo);
//     }
// }
// )

app.get("/saldo", (req, res) => {
  const sheetname = moment().format("MMMM");
  googleSheets.spreadsheets.values.get(
    {
      auth,
      spreadsheetId,
      range: sheetname + "!G2",
    },
    (err, result) => {
      if (err) {
        console.log("err");
      } else {
        const saldo = result.data.values[0].join("");
        res.json(saldo);
      }
    }
  );
});

app.get("/cakeCurrent", (req, res) => {
  const sheetname = moment().format("MMMM");
  googleSheets.spreadsheets.values.get(
    {
      auth,
      spreadsheetId,
      range: sheetname + "!L2:T2",
    },
    (err, result) => {
      if (err) {
        console.log("err");
      } else {
        const cake = result.data.values[0];
        res.json(cake);
      }
    }
  );
});

app.get("/recount", (req, res) => {
  const sheetname = moment().format("MMMM");
  googleSheets.spreadsheets.values.get(
    {
      auth,
      spreadsheetId,
      range: "Recount!C2:K2",
    },
    (err, result) => {
      if (err) {
        console.log("err");
      } else {
        const recount = result.data.values[0];
        res.json(recount);
      }
    }
  );
});




app.get("/promedio", (req, res) => {
  const sheetname = moment().format("MMMM");
  googleSheets.spreadsheets.values.get(
    {
      auth,
      spreadsheetId,
      range: sheetname + "!H2",
    },
    (err, result) => {
      if (err) {
        console.log("err");
      } else {
        const correspS = result.data.values[0].join("");
        res.json(correspS);
      }
    }
  );
});

app.post("/submit", async (req, res) => {
  let { monto, tipo, paga, tipoPers, sheetname, specs } = req.body;
  const fecha = moment().format("DD/MM/YYYY");
//   const sheetname = moment().format("MMMM");
  console.log(req.body);
  if (paga === "FC") {
    paga = "";
  } 
  if (sheetname === 'mesA') {sheetname = moment().format("MMMM")}
  if (tipo === "pers") {
    tipo = tipoPers;
  }
  if (tipo === "INGRESO") {
    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: sheetname + "!A:F",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[fecha, tipo, monto, "", paga, specs]],
      },
    });
  } else {
    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: sheetname + "!A:F",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[fecha, tipo, "", monto, paga, specs]],
      },
    });
  }
  // res.status(200);
  res.status(200).send("¨Something DIED");
  res.redirect("back");
});

app.listen(process.env.PORT || 1337, (req, res) => console.log("wsgood"));
