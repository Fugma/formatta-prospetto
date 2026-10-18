// ELENCO DELLE MACRO: per aggiungerne una basta aggiungere una riga qui sotto
// (e il file con la funzione, incluso in taskpane.html).
const MACRO = [
  { titolo: "Formatta prospetto",          desc: "Intestazioni, colori, filtro e stampa",         esegui: macroFormatta },
  { titolo: "Presenze",                    desc: "Unisce ORE e MINUTI in TOT HH, formatta le date", esegui: macroPresenze },
  { titolo: "Apri tutto in formato testo", desc: "Importa un file di testo in una nuova cartella", esegui: macroApriTesto, senzaBlocco: true }
];

let inCorso = false;

Office.onReady(() => {
  const elenco = document.getElementById("elenco");
  const stato = document.getElementById("stato");

  MACRO.forEach((m) => {
    const b = document.createElement("button");
    const t = document.createElement("span");
    const d = document.createElement("span");
    t.className = "titolo"; t.textContent = m.titolo;
    d.className = "desc";   d.textContent = m.desc;
    b.append(t, d);

    b.onclick = async () => {
      if (!m.senzaBlocco) {
        if (inCorso) return;
        inCorso = true;
      }
      stato.textContent = m.titolo + ": in corso...";
      try {
        stato.textContent = await m.esegui();
      } catch (e) {
        stato.textContent = "Errore: " + e.message;
      }
      if (!m.senzaBlocco) inCorso = false;
    };
    elenco.appendChild(b);
  });

  stato.textContent = "Pronto.";
});
