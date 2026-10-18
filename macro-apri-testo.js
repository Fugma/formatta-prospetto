// MACRO 3 - Apri tutto in formato testo: importa un file di testo (separatori ; e tabulazione),
// tutte le colonne come testo, in una nuova cartella di lavoro.

function scegliFile() {
  return new Promise((resolve) => {
    const i = document.createElement("input");
    i.type = "file";
    i.onchange = () => resolve(i.files[0] || null);
    i.oncancel = () => resolve(null);
    i.click();
  });
}

async function leggiTesto(file) {
  const buf = await file.arrayBuffer();
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buf);
  } catch (e) {
    return new TextDecoder("windows-1252").decode(buf);
  }
}

function analizzaTesto(testo) {
  const righe = [];
  let riga = [], campo = "", tra = false;
  for (let i = 0; i < testo.length; i++) {
    const ch = testo[i];
    if (tra) {
      if (ch === '"') {
        if (testo[i + 1] === '"') { campo += '"'; i++; } else tra = false;
      } else campo += ch;
    } else if (ch === '"' && campo === "") {
      tra = true;
    } else if (ch === ";" || ch === "\t") {
      riga.push(campo); campo = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && testo[i + 1] === "\n") i++;
      riga.push(campo); righe.push(riga); riga = []; campo = "";
    } else campo += ch;
  }
  if (campo !== "" || riga.length) { riga.push(campo); righe.push(riga); }
  return righe;
}

function creaXlsxBase64(righe) {
  const ws = {};
  const larg = [];
  let maxC = 1;
  righe.forEach((r, i) => r.forEach((v, j) => {
    if (v === "") return;
    ws[XLSX.utils.encode_cell({ r: i, c: j })] = { t: "s", v: v };
    if (j + 1 > maxC) maxC = j + 1;
    larg[j] = Math.max(larg[j] || 8, Math.min(v.length + 2, 50));
  }));
  ws["!ref"] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: righe.length - 1, c: maxC - 1 } });
  ws["!cols"] = Array.from({ length: maxC }, (_, j) => ({ wch: larg[j] || 8 }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Foglio1");
  return XLSX.write(wb, { bookType: "xlsx", type: "base64" });
}

async function scriviInNuovoFoglio(righe) {
  const nCol = Math.max(...righe.map((r) => r.length));
  await Excel.run(async (ctx) => {
    const ws = ctx.workbook.worksheets.add("Import " + new Date().toLocaleTimeString("it-IT").replace(/:/g, "."));
    ws.getRangeByIndexes(0, 0, righe.length, nCol).numberFormat = Array.from({ length: righe.length }, () => Array(nCol).fill("@"));
    await ctx.sync();
    for (let i = 0; i < righe.length; i += 1000) {
      const blocco = righe.slice(i, i + 1000).map((r) => Array.from({ length: nCol }, (_, j) => r[j] ?? ""));
      ws.getRangeByIndexes(i, 0, blocco.length, nCol).values = blocco;
      await ctx.sync();
    }
    ws.getUsedRange().format.autofitColumns();
    ws.activate();
    await ctx.sync();
  });
}

async function macroApriTesto() {
  const file = await scegliFile();
  if (!file) return "Nessun file selezionato.";

  const righe = analizzaTesto(await leggiTesto(file));
  if (righe.length === 0) return "Il file è vuoto.";

  try {
    await Excel.createWorkbook(creaXlsxBase64(righe));
    return "File \"" + file.name + "\" aperto in una nuova cartella di lavoro (" + righe.length + " righe) ✓\nPer formattarlo premi Macro Studio nella nuova finestra.";
  } catch (e) {
    await scriviInNuovoFoglio(righe);
    return "Non è stato possibile creare una nuova cartella di lavoro, quindi ho usato un nuovo foglio di questa (" + righe.length + " righe) ✓";
  }
}
