// MACRO 4 - Budget: elimina le colonne inutili, unisce NUMERO RIGO + DESCRIZIONE RIGO in DESCRIZIONE,
// formatta gli importi (TOTALE e mesi), nasconde la griglia.

const BUDGET_DA_ELIMINARE = new Set([
  "CODICE AZIENDA", "DENOMINAZIONE", "MATRICOLA", "MODELLO", "TIPOL.MODELLO DI BUDGET EST.",
  "TIPO BUDGET", "PROSPETTIVA", "ELABORATA AL", "COD.DITTA BUDGET EST.", "COD.DIPEND. PER BUDGET EST.",
  "QUALIFICA BUDGET EST.", "LIVELLO BUDGET EST.", "COD.ELEMENTO PER BUDGET EST.",
  "PREFISSO CREAZIONE COD DIPENDENTE"
]);
const BUDGET_PREFISSI_MESI = ["GEN_", "FEB_", "MAR_", "APR_", "MAG_", "GIU_", "LUG_", "AGO_", "SET_", "OTT_", "NOV_", "DIC_"];
const BUDGET_FORMATO = '_-* #,##0.00 _€_-;-* #,##0.00 _€_-;_-* "-"?? _€_-;_-@_-';

async function macroBudget() {
  let eliminate = 0, unite = 0, importi = 0;

  await Excel.run(async (ctx) => {
    const ws = ctx.workbook.worksheets.getActiveWorksheet();
    const used = ws.getUsedRange();
    used.load("rowIndex,rowCount,columnIndex,columnCount");
    await ctx.sync();

    const ultimaRiga = used.rowIndex + used.rowCount;
    const nDati = ultimaRiga - 1;
    const nCol = used.columnIndex + used.columnCount;
    const intest = ws.getRangeByIndexes(0, 0, 1, nCol);
    intest.load("values");
    await ctx.sync();

    // Copia di lavoro delle intestazioni: la teniamo allineata alle colonne eliminate/unite
    const h = intest.values[0].map((v) => String(v).trim().toUpperCase());

    const testoTEXT = (v) => {                       // equivalente di TEXT(x;"000")
      if (v === "") return "000";
      const n = Number(String(v).replace(",", "."));
      return isNaN(n) ? String(v) : String(Math.round(n)).padStart(3, "0");
    };

    let c = 0;
    while (c < h.length && h[c] !== "") {
      const nome = h[c];

      if (BUDGET_DA_ELIMINARE.has(nome)) {
        ws.getRangeByIndexes(0, c, 1, 1).getEntireColumn().delete(Excel.DeleteShiftDirection.left);
        h.splice(c, 1);
        eliminate++;
        continue;                                     // la colonna successiva ora occupa la stessa posizione
      }

      if (nome === "NUMERO RIGO" && h[c + 1] === "DESCRIZIONE RIGO") {
        if (nDati >= 1) {
          const origine = ws.getRangeByIndexes(1, c, nDati, 2);
          origine.load("values");
          await ctx.sync();
          ws.getRangeByIndexes(1, c, nDati, 1).values =
            origine.values.map(([num, desc]) => [testoTEXT(num) + "-" + desc]);
        }
        ws.getCell(0, c).values = [["DESCRIZIONE"]];
        ws.getRangeByIndexes(0, c + 1, 1, 1).getEntireColumn().delete(Excel.DeleteShiftDirection.left);
        ws.getRangeByIndexes(0, c, ultimaRiga, 1).format.autofitColumns();
        h.splice(c + 1, 1);
        h[c] = "DESCRIZIONE";
        unite++;
        c++;
        continue;
      }

      if (nome.startsWith("TOTALE") || BUDGET_PREFISSI_MESI.some((p) => nome.startsWith(p))) {
        if (nDati >= 1) {
          ws.getRangeByIndexes(1, c, nDati, 1).numberFormat = Array.from({ length: nDati }, () => [BUDGET_FORMATO]);
        }
        importi++;
      }
      c++;
    }

    ws.showGridlines = false;
    ws.getRange("A1").select();
    await ctx.sync();
  });

  return "Budget elaborato ✓\nColonne eliminate: " + eliminate +
         "\nColonne DESCRIZIONE create: " + unite +
         "\nColonne importi formattate: " + importi;
}
