const express = require("express");
const { google } = require("googleapis");
const app = express();
const cors = require("cors");
const moment = require("moment");

// CONSTANTES DE GOOGLE DEFINIDAS
const auth = new google.auth.GoogleAuth({
  keyFile: "cred.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});
const client = auth.getClient();
const googleSheets = google.sheets({ version: "v4", auth: client });
const cuotasSheetId = "1i_wKKLCKeAhMVkVm23W_CSoSB18vfdCXXpw9864VWhY";
const spreadsheets = [
  "1mUhl_FfdbIVPv48MBp0ZLqkBTXcwCKhCxsREMnE8PqY",
  "1OJOn8N0sz8P3W1qjIRRO5aao4ARydBm3Au5VvcFRyCU",
];
spreadsheetId = spreadsheets[moment().format("YYYY") - 2021];
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/views"));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json("Whatchu looking at?");
});

app.get("/difCaja", (req, res) => {
  const sheetname = moment().format('MMMM');
  googleSheets.spreadsheets.values.append
})

app.post("/submit", async (req, res) => {
  let { monto, tipo, paga, tipoPers, sheetname, specs } = req.body;
  const fecha = moment().format("DD/MM/YYYY");
  data = [fecha, tipo, "", monto, paga, specs];

  if (sheetname === "mesA") {
    sheetname = moment().format("MMMM");
  }
  if (tipo === "pers") {
    tipo = tipoPers;
  }
  if (tipo === "INGRESO") {
    data[2] = data[3];
    data[3] = "";
  }
  googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: sheetname + "!A:F",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [data],
    },
  });
  res.status(200).send("sup");
});

app.post("/cuotas", (req, res) => {
  let { cantidad, monto, concepto } = req.body;
  mesA = Number(moment().format("MM"));
  data = [concepto, `$${monto}`];
  mesesT = mesA + Number(cantidad);
  year = Number(moment().format("YYYY"));
  let arrayFull;
  const googleAppend = (year, data) => {
    googleSheets.spreadsheets.values
      .append({
        auth,
        spreadsheetId: cuotasSheetId,
        range: year + "!A1",
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [data],
        },
      })
      .then(() => res.status(200).json({}))
      .catch((err) => console.log(err));
  };
  for (var i = 0; i < mesA; i++) {
    data.push("");
  }
  for (var i = 0; i < cantidad; i++) {
    data.push(`$${monto / cantidad}`);
  }
  const sliceArray = (data) => {
    if (data.length / 14 > 1) {
      const dataA = data.slice(0, 14);
      const dataB = [concepto, `$${monto}`, data.slice(14, 26)].flat();
      const dataC = [concepto, `$${monto}`, data.slice(26, 38)].flat();
      const dataD = [concepto, `$${monto}`, data.slice(38, 50)].flat();
      arrayFull = [dataA, dataB, dataC, dataD];
    } else {
      return data;
    }
  };
  sliceArray(data);
  for (let i = 0; i < arrayFull.length; i++) {
    if (arrayFull[i].length <= 2) {
      arrayFull[i] = [];
    }
  }
  for (let i = 0; i < arrayFull.length; i++) {
    const element = arrayFull[i];
    googleAppend(year + i, element);
  }
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
  // index = indexes[0] + 3;

  const delFunction = (index) => {
    googleSheets.spreadsheets.values.update(
      {
        auth,
        spreadsheetId,
        range: `${sheetname}!A${index}:F${index}`,
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [[fecha, "ELIMINADO", "", "", "", ""]],
        },
      },
      (err, result) => {
        if (err) {
          console.log(err);
        }
      }
    );
  };

  indexes.forEach((index) => delFunction(index + 3));
  res.status(200).json({});
  res.redirect("back");
});

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

app.get("/saldar", (req, res) => {
  const sheetname = moment().format("MMMM");
  googleSheets.spreadsheets.values.get(
    {
      auth,
      spreadsheetId,
      range: sheetname + "!J2:K2",
    },
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const saldar = result.data.values[0];
        res.json(saldar);
      }
    }
  );
});

app.get("/corresp", (req, res) => {
  const sheetname = moment().format("MMMM");
  googleSheets.spreadsheets.values.get(
    {
      auth,
      spreadsheetId,
      range: sheetname + "!H2:I2",
    },
    (err, result) => {
      if (err) {
        console.log("err");
      } else {
        const correspD = result.data.values[0];
        res.json(correspD);
      }
    }
  );
});

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

app.get("/cakeCurrent", async (req, res) => {
  const sheetname = moment().format("MMMM");
  cake1 = [];
  const num = Number(moment().format("MM")) + 1;
  function numToSSColumn(num) {
    let s = "",
      t;
    while (num > 0) {
      t = (num - 1) % 26;
      s = String.fromCharCode(65 + t) + s;
      num = ((num - t) / 26) | 0;
    }
    return s || undefined;
  }
  const column = numToSSColumn(num);
  cake2 = [];
  const row = Number(moment().format("YYYY") - 2019);
  await googleSheets.spreadsheets.values
    .get({
      auth,
      spreadsheetId,
      range: sheetname + "!L2:T2",
    })
    .then((data) => (cake1 = data.data.values[0]))
    .catch((err) => res.json(err).status(400));
  await googleSheets.spreadsheets.values
    .get({
      auth,
      spreadsheetId: cuotasSheetId,
      range: "Recount!" + column + row,
    })
    .then((data) => (cake2 = data.data.values[0][0]))
    .catch((err) => console.log(err));

  cake1.push(cake2);
  res.json(cake1).status(200);
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

app.get("/check", (req, res) => {
  googleSheets.spreadsheets.values.get(
    {
      auth,
      spreadsheetId,
      range: "Recount!N11",
    },
    (err, result) => {
      if (err) {
        console.log("err");
      } else {
        const resp = result.data.values[0].join("");
        res.json(resp);
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

app.post("/helen", (req, res) => {
  console.log(req.body.email)
  if (
    req.body.email === 'simonespeche123@gmail.com'
    // process.env.ADMIN_EMAIL === req.body ||
    // process.env.ADMIN_EMAIL1 === req.body ||
    // process.env.ADMIN_EMAIL2 === req.body
  ) {
    res.status(200).send('Success');
    // res.json("Success");
  } else {
    console.log('swah bby')
    res.status(403).send('F');
    // res.json("F");
  }
});

app.listen(process.env.PORT || 1337, (req, res) => console.log("wsgood"));
