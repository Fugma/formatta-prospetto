// Converte la larghezza "in caratteri" (come ColumnWidth di VBA) in punti (usati da Office.js)
const larg = (c) => Math.round((c * 7 + 5) * 0.75 * 100) / 100;

// Regole sulle intestazioni (il confronto ignora maiuscole/minuscole e spazi ai bordi)
// da: nomi riconosciuti | nuovo: nuovo nome (opzionale) | w: larghezza | fmt: formato numero | mono: Courier New 8
const REGOLE = [
  { da: ["CODICE DIPENDENTE"],               nuovo: "COD.DIP.",       w: 3,    fmt: "0" },
  { da: ["COGNOME", "NOME"],                                           w: 11 },
  { da: ["MESE DAL"],                        nuovo: "MM DAL",         w: 3,    fmt: "0", mono: true },
  { da: ["ANNO DAL"],                        nuovo: "AA DAL",         w: 4,    fmt: "0", mono: true },
  { da: ["TIPO CEDOLINO DAL"],               nuovo: "CED DAL",        w: 3,    fmt: "0", mono: true },
  { da: ["MESE AL"],                         nuovo: "MM AL",          w: 3,    fmt: "0", mono: true },
  { da: ["ANNO AL"],                         nuovo: "AA AL",          w: 4,    fmt: "0", mono: true },
  { da: ["TIPO CEDOLINO AL"],                nuovo: "CED AL",         w: 3,    fmt: "0", mono: true },
  { da: ["DATA DI ELABORAZIONE", "DATA ELABORAZIONE"], nuovo: "DATA ELABORAZ.", w: 10, fmt: "m/d/yyyy" },
  { da: ["TIPO CEDOLINO"],                   nuovo: "TIPO CED",       w: 4,    fmt: "0", mono: true },
  { da: ["DAL MESE"],                        nuovo: "DA",             w: 10,   fmt: "m/d/yyyy" },
  { da: ["AL MESE"],                         nuovo: " A",             w: 10,   fmt: "m/d/yyyy" },
  { da: ["CODICE FISCALE"],                  nuovo: "COD.FISCALE",    w: 14.5, mono: true }
];

Office.onReady(() => {
  const btn = document.getElementById("btn");
  btn.disabled = false;
  document.getElementById("stato").textContent = "Pronto.";
  btn.onclick = async () => {
    const stato = document.getElementById("stato");
    btn.disabled = true;
    stato.textContent = "Formattazione in corso...";
    try {
      await formattaDati();
      let msg = "Formattazione completata ✓";
      try { await impostaStampa(); } catch (e) { msg += "\n(Impostazioni di stampa non applicate: " + e.message + ")"; }
      stato.textContent = msg;
    } catch (e) {
      stato.textContent = "Errore: " + e.message;
    }
    btn.disabled = false;
  };
});

async function formattaDati() {
  await Excel.run(async (ctx) => {
    const ws = ctx.workbook.worksheets.getActiveWorksheet();

    // Ambiente 2: c'è solo la Meritor -> elimina le colonne A:B
    const b2 = ws.getRange("B2");
    b2.load("values");
    await ctx.sync();
    if (String(b2.values[0][0]).trim() === "MERITOR HVS CAMERI SPA") {
      ws.getRange("A:B").delete(Excel.DeleteShiftDirection.left);
      await ctx.sync();
    }

    const used = ws.getUsedRange();
    used.load("rowCount,columnCount");
    const intest = used.getRow(0);
    intest.load("values");
    await ctx.sync();

    const nRighe = used.rowCount, nCol = used.columnCount;

    // Riga 1: altezza, allineamento, a capo
    intest.format.rowHeight = 58;
    intest.format.horizontalAlignment = "Center";
    intest.format.verticalAlignment = "Center";
    intest.format.wrapText = true;
    used.format.autofitColumns();
    await ctx.sync();

    // Regole sulle singole colonne
    for (let c = 0; c < nCol; c++) {
      const nome = String(intest.values[0][c]).trim().toUpperCase();
      if (nome === "") break;                       // come il "Do Until ActiveCell = ''"
      const r = REGOLE.find((x) => x.da.includes(nome));
      if (!r) continue;

      if (r.nuovo) ws.getCell(0, c).values = [[r.nuovo]];
      ws.getCell(0, c).format.columnWidth = larg(r.w);

      if (nRighe > 1) {
        const dati = ws.getRangeByIndexes(1, c, nRighe - 1, 1);
        if (r.fmt) dati.numberFormat = Array.from({ length: nRighe - 1 }, () => [r.fmt]);
        if (r.mono) { dati.format.font.name = "Courier New"; dati.format.font.size = 8; }
      }
    }

    // Intestazione: colore e font
    const riga1 = ws.getRangeByIndexes(0, 0, 1, nCol);
    riga1.format.font.name = "Calibri Light";
    riga1.format.font.size = 8;
    riga1.format.font.bold = true;
    riga1.format.fill.color = "#4072C4";
    riga1.format.font.color = "#FFFFFF";

    // Bordi neri su tutta la tabella
    const bordi = ["EdgeTop", "EdgeBottom", "EdgeLeft", "EdgeRight"];
    if (nCol > 1) bordi.push("InsideVertical");
    if (nRighe > 1) bordi.push("InsideHorizontal");
    bordi.forEach((k) => {
      const b = used.format.borders.getItem(k);
      b.style = "Continuous";
      b.color = "#000000";
    });

    // Filtro automatico e riquadri bloccati
    ws.autoFilter.apply(used);
    ws.freezePanes.freezeRows(1);
    ws.getRange("A1").select();
    await ctx.sync();
  });
}

async function impostaStampa() {
  await Excel.run(async (ctx) => {
    const pl = ctx.workbook.worksheets.getActiveWorksheet().pageLayout;
    pl.orientation = Excel.PageOrientation.landscape;
    pl.paperSize = Excel.PaperType.a4;
    pl.zoom = { horizontalFitToPages: 1, verticalFitToPages: 1000 };
    pl.setPrintMargins("Inches", { left: 0.2, right: 0.2, top: 0.8, bottom: 0.6, header: 0.4, footer: 0.3 });
    pl.setPrintTitleRows("$1:$1");
    pl.headersFooters.defaultForAllPages.leftFooter = "&Z&F";
    pl.headersFooters.defaultForAllPages.rightFooter = "&P / &N";
    await ctx.sync();
  });
}
