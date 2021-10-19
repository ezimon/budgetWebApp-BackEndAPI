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

app.get("/historial/:sheetname", (req, res) => {
  sheetname = req.params.sheetname;
  if (sheetname === "mesA") {
    sheetname = moment().format("MMMM");
  }
  googleSheets.spreadsheets.values.get(
    {
      auth,
      spreadsheetId,
      range: sheetname + "!A3:F1000",
    },
    (err, result) => {
      if (err) {
        console.log("err");
      } else {
        var swag = [];
        const hists = result.data.values;
        if (hists === undefined) {
          res.json([{ 0: "", 1: "NO DATA" }]);
        } else {
          var hist = hists.filter((hists) => Object.keys(hists).length !== 0);
          for (var i = 0; i < hist.length; i++) {
            var histElem = hist[i];
            var obj = {};
            for (var j = 0; j < histElem.length; j++) {
              Object.assign(obj, histElem);
            }
            swag.push(obj);
            if (obj[2] === "") {
              obj[2] = obj[3];
              obj[3] = "";
            }
          }
          res.json(swag);
        }
      }
    }
  );
});

app.post("/delete", (req, res) => {
  let { indexes, sheetname } = req.body;
  if (sheetname === "mesA") {
    sheetname = moment().format("MMMM");
  }
  const fecha = moment().format("DD/MM/YYYY");
  index = indexes[0] + 3;
  console.log(indexes)
  console.log(index);
  googleSheets.spreadsheets.values.update(
    {
      auth,
      spreadsheetId,
      range: `${sheetname}!A${index}:F${index}`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [['', '', '', '', '', '', ]],
      },
    },
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send("Something DIED");
        res.redirect("back");
      }
    }
  );
});

//////////////////////////////////////////////////////////
// TOTALES DE CONCEPTO AUTO

app.get("/totales", (req, res) => {
  googleSheets.spreadsheets.values.get(
    {
      auth,
      spreadsheetId,
      range: "Recount!B2:M10",
    },
    (err, result) => {
      if (err) {
        console.log("err");
      } else {
        const data = result.data.values;
        res.json(data);
      }
    }
  );
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
        console.log(err);
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
        console.log(err);
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

app.get("/promediomes", (req, res) => {
  googleSheets.spreadsheets.values.get(
    {
      auth,
      spreadsheetId,
      range: "Recount!P2:P11",
    },
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const data = result.data.values;
        res.json(data);
      }
    }
  );
});

app.get("/promediodia", (req, res) => {
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
        const promedioS = Math.round(promedioRaw);
        const promedio = Math.ceil(promedioS / 10) * 10;
        res.json(promedio);
      }
    }
  );
});

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
      range: "Recount!N2:N10",
    },
    (err, result) => {
      if (err) {
        console.log("err");
      } else {
        const recount = result.data.values.flat();
        res.json(recount);
        // console.log(recount)
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
  // if (paga === "FC") {
  //   paga = "";
  // }
  if (sheetname === "mesA") {
    sheetname = moment().format("MMMM");
  }
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
  res.status(200).send("Something DIED");
  res.redirect("back");
});

app.listen(process.env.PORT || 1337, (req, res) => console.log("wsgood"));
