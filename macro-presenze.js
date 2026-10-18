// MACRO 2 - Presenze: unisce ORE e MINUTI in una colonna TOT HH e formatta le date
const FORMATO_ORE = '_-* #,##0.00 _€_-;-* #,##0.00 _€_-;_-* "-"?? _€_-;_-@_-';

async function macroPresenze() {
  let coppie = 0, date = 0;

  await Excel.run(async (ctx) => {
    const ws = ctx.workbook.worksheets.getActiveWorksheet();
    const used = ws.getUsedRange();
    used.load("rowIndex,rowCount,columnIndex,columnCount");
    await ctx.sync();

    const ultimaRiga = used.rowIndex + used.rowCount;
    const nDati = ultimaRiga - 1;
    const nCol = used.columnIndex + used.columnCount;
    if (nDati < 1) return;

    const intest = ws.getRangeByIndexes(0, 0, 1, nCol);
    intest.load("values");
    await ctx.sync();

    const h = intest.values[0].map((v) => String(v).trim().toUpperCase());
    let limite = h.indexOf("");
    if (limite < 0) limite = nCol;

    const num = (x) => {
      const n = parseFloat(String(x).replace(",", "."));
      return isNaN(n) ? 0 : n;
    };

    // Da destra verso sinistra, così eliminare colonne non sposta quelle ancora da elaborare
    for (let c = limite - 1; c >= 0; c--) {
      if (h[c] === "DATA PRESENZE" || h[c] === "FINE MESE") {
        ws.getRangeByIndexes(1, c, nDati, 1).numberFormat = Array.from({ length: nDati }, () => ["dd/mm/yyyy"]);
        date++;
      }

      const coppia = c + 1 < nCol &&
        ((h[c] === "ORE" && h[c + 1] === "MINUTI") ||
         (h[c] === "ORE TEORICHE" && h[c + 1] === "MINUTI TEORICI"));

      if (coppia) {
        const origine = ws.getRangeByIndexes(1, c, nDati, 2);
        origine.load("values");
        await ctx.sync();

        const dest = ws.getRangeByIndexes(1, c, nDati, 1);
        dest.numberFormat = Array.from({ length: nDati }, () => [FORMATO_ORE]);
        dest.values = origine.values.map(([ore, min]) => [num(ore) + num(min) / 60]);
        ws.getCell(0, c).values = [["TOT HH"]];
        ws.getRangeByIndexes(0, c + 1, 1, 1).getEntireColumn().delete(Excel.DeleteShiftDirection.left);
        await ctx.sync();
        coppie++;
      }
    }
    ws.getRange("A1").select();
    await ctx.sync();
  });

  if (coppie === 0) return "Nessuna coppia ORE / MINUTI trovata nel foglio attivo.";
  return "Presenze elaborate ✓\nColonne TOT HH create: " + coppie + "\nColonne data formattate: " + date;
}
