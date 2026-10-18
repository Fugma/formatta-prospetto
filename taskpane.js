// ELENCO DELLE MACRO: per aggiungerne una basta aggiungere una riga qui sotto
// (e il file con la funzione, incluso in taskpane.html).
// colore = colore di sfondo del pulsante, testo = colore della scritta (codici esadecimali, es. "#2E7D32").
// Se si omettono, il pulsante è blu con scritta bianca.
const MACRO = [
  { titolo: "Formatta prospetto",          desc: "Intestazioni, colori, filtro e stampa",            esegui: macroFormatta,     colore: "#4072C4", testo: "#FFFFFF" },
  { titolo: "Presenze",                    desc: "Unisce ORE e MINUTI in TOT HH, formatta le date",   esegui: macroPresenze,     colore: "#2E7D32", testo: "#FFFFFF" },
  { titolo: "Apri tutto in formato testo", desc: "Importa un file di testo in una nuova cartella",    esegui: macroApriTesto,    colore: "#B45309", testo: "#FFFFFF", senzaBlocco: true },
  { titolo: "Budget",                      desc: "Toglie colonne inutili, unisce descrizioni, importi", esegui: macroBudget,     colore: "#6A4C93", testo: "#FFFFFF" },
  { titolo: "Formule LAMBDA",              desc: "Aggiunge le formule personalizzate (rr_...)",       esegui: macroFormuleLambda, colore: "#444441", testo: "#FFFFFF" }
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
    if (m.colore) b.style.setProperty("--bg", m.colore);
    if (m.testo)  b.style.setProperty("--fg", m.testo);

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
