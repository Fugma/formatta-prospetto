// MACRO 6 - Apri tutti i CSV di una cartella: unisce i file in un foglio RIEPILOGO.
// Dal 1° file importa tutto (intestazione compresa), dagli altri dalla riga 2 in poi.
// Usa leggiTesto() e analizzaTesto() di macro-apri-testo.js (separatori ; e tabulazione).

function scegliCartella() {
  return new Promise((resolve) => {
    const i = document.createElement("input");
    i.type = "file";
    i.webkitdirectory = true;
    i.multiple = true;
    i.onchange = () => resolve(Array.from(i.files));
    i.oncancel = () => resolve(null);
    i.click();
  });
}

function avanzamento(testo) {
  const el = document.getElementById("stato");
  if (el) el.textContent = testo;
}

// Prepara un valore come farebbe l'importazione di testo di Excel (formato "Generale")
function preparaValore(v) {
  if (v === "") return "";
  if (/^\d[\d.,]*-$/.test(v)) return "-" + v.slice(0, -1);              // numeri con il meno finale
  if (v[0] === "=") return "'" + v;                                      // mai interpretare come formula
  if (/^[+-]/.test(v) && !/^[+-]?\d[\d.,]*%?$/.test(v)) return "'" + v;
  return v;
}

async function macroApriCartella() {
  const tutti = await scegliCartella();
  if (!tutti) return "Nessuna cartella selezionata.";

  // Solo i file direttamente nella cartella scelta (non nelle sottocartelle), .csv e .txt
  const file = tutti
    .filter((f) => (f.webkitRelativePath || f.name).split("/").length === 2 && /\.(csv|txt)$/i.test(f.name))
    .sort((a, b) => a.name.localeCompare(b.name, "it", { numeric: true, sensitivity: "base" }));
  const ignorati = tutti.filter((f) => (f.webkitRelativePath || f.name).split("/").length === 2).length - file.length;
  if (file.length === 0) return "Nessun file .csv o .txt trovato in quella cartella.";

  // Lettura e unione in memoria
  const righe = [];
  let intestazione = null, nCol = 0;
  const diversi = [];
  for (let k = 0; k < file.length; k++) {
    avanzamento("Lettura file " + (k + 1) + " di " + file.length + ": " + file[k].name);
    const r = analizzaTesto(await leggiTesto(file[k]));
    while (r.length && r[r.length - 1].every((c) => c === "")) r.pop();   // toglie le righe vuote finali
    if (r.length === 0) continue;

    const chiave = r[0].map((c) => c.trim()).join("|");
    if (intestazione === null) {
      intestazione = chiave;
      r.forEach((x) => righe.push(x));            // 1° file: tutto
    } else {
      if (chiave !== intestazione) diversi.push(file[k].name);
      r.slice(1).forEach((x) => righe.push(x));   // gli altri: dalla riga 2
    }
    r.forEach((x) => { if (x.length > nCol) nCol = x.length; });
  }
  if (righe.length === 0) return "I file sono vuoti.";

  // Scrittura nel nuovo foglio RIEPILOGO (dopo il foglio attivo)
  avanzamento("Scrittura di " + righe.length + " righe nel foglio RIEPILOGO...");
  let nomeFoglio = "RIEPILOGO";
  await Excel.run(async (ctx) => {
    const fogli = ctx.workbook.worksheets;
    fogli.load("items/name");
    const attivo = fogli.getActiveWorksheet();
    attivo.load("position");
    await ctx.sync();

    const esistenti = fogli.items.map((x) => x.name.toUpperCase());
    for (let n = 2; esistenti.includes(nomeFoglio.toUpperCase()); n++) nomeFoglio = "RIEPILOGO (" + n + ")";

    const ws = fogli.add(nomeFoglio);
    ws.position = attivo.position + 1;
    await ctx.sync();

    const passo = Math.max(100, Math.floor(25000 / nCol));
    for (let i = 0; i < righe.length; i += passo) {
      const blocco = righe.slice(i, i + passo).map((r) =>
        Array.from({ length: nCol }, (_, j) => preparaValore(r[j] === undefined ? "" : r[j])));
      ws.getRangeByIndexes(i, 0, blocco.length, nCol).values = blocco;
      await ctx.sync();
    }
    ws.getRange("A1").select();
    ws.activate();
    await ctx.sync();
  });

  let msg = "Importazione completata ✓\nFile uniti: " + file.length + "\nRighe nel foglio " + nomeFoglio + ": " + righe.length + " (intestazione compresa)";
  if (ignorati > 0) msg += "\nFile ignorati (non .csv/.txt): " + ignorati;
  if (diversi.length) msg += "\n\nAttenzione: intestazione diversa dal 1° file in:\n" + diversi.slice(0, 8).join("\n") + (diversi.length > 8 ? "\n... e altri " + (diversi.length - 8) : "");
  return msg;
}
