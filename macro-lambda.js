// MACRO 5 - Formule LAMBDA: crea nella cartella di lavoro i nomi con le formule personalizzate (rr_...)
// Generato dalla macro formule_lambda. Per aggiungere una formula: aggiungere una riga {nome, formula}.
const FORMULE = [
  {nome: "rrauto_co2_percentuale",
   formula: "=LAMBDA({\"CO2 fino a 60 grammi per km\",0.25;\"CO2 superiori a 60, ma non a 160 grammi per km\",0.3;\"CO2 superiori a 160, ma non a 190 grammi per km\",0.5;\"CO2 superiori a 190 grammi per km\",0.6})"},
  {nome: "rrcalc_detrazione_coniuge",
   formula: "=LAMBDA(ImponibileFiscale,Mesi_a_Carico, LET(primaDetrazione, IF(AND(ImponibileFiscale >= 29000, ImponibileFiscale < 29200), 10, IF(AND(ImponibileFiscale >= 29200, ImponibileFiscale < 34700), 20, IF(AND(ImponibileFiscale >= 34700, ImponibileFiscale < 35000), 30, IF(AND(ImponibileFiscale >= 35000, ImponibileFiscale < 35100), 20, IF(AND(ImponibileFiscale >= 35100, ImponibileFiscale < 35200), 10, 0))))), secondaDetrazione, IF(ImponibileFiscale < 0, 0, IF(AND(ImponibileFiscale > 0, ImponibileFiscale <= 15000), ROUND((800 - (110 * TRUNC((ImponibileFiscale / 15000), 4))) / 12 * Mesi_a_Carico, 2), IF(AND(ImponibileFiscale > 15000, ImponibileFiscale < 40000), ROUND(690 / 12 * Mesi_a_Carico, 2), IF(AND(ImponibileFiscale > 40000, ImponibileFiscale <= 80000), ROUND((690 * TRUNC(((80000 - ImponibileFiscale) / 40000), 4)) / 12 * Mesi_a_Carico, 2))))), primaDetrazione + secondaDetrazione))"},
  {nome: "rrcalc_detrazione_figli",
   formula: "=LAMBDA(ImponibileFiscale,NumeroFigliMag21anni,PercentualeCarico,MesiCarico, LET(QuindicimilaxFiglio, IF(NumeroFigliMag21anni > 1, 15000 * NumeroFigliMag21anni - 15000, 0), ImportoTeorico, 950 * NumeroFigliMag21anni * PercentualeCarico / 12 * MesiCarico, DetrazioneFigli, ROUND(ImportoTeorico * TRUNC(((95000 + QuindicimilaxFiglio) - ImponibileFiscale) / (95000 + QuindicimilaxFiglio), 4), 2), IF(DetrazioneFigli < 0, 0, DetrazioneFigli)))"},
  {nome: "rr_calc_detrazione_lav_dipendente",
   formula: "=LAMBDA(ImponibileFiscale,GiorniDetrazione, LET(ggDetrazione, IF(GiorniDetrazione > 365, 365, GiorniDetrazione), primaDetrazione, IF(AND(ImponibileFiscale > 25000, ImponibileFiscale <= 35000), 65, 0), secondaDetrazione, IF(ImponibileFiscale < 0, 0, IF(AND(ImponibileFiscale > 0, ImponibileFiscale <= 15000), 1955 / 365 * ggDetrazione, IF(AND(ImponibileFiscale > 15000, ImponibileFiscale <= 28000), ROUND((((1910 + 1190 * TRUNC((28000 - ImponibileFiscale) / 13000, 4))) / 365 * ggDetrazione), 2), IF(AND(ImponibileFiscale > 28000, ImponibileFiscale <= 50000), ROUND((1910 * TRUNC(((50000 - ImponibileFiscale) / 22000), 4)) / 365 * ggDetrazione, 2), IF(ImponibileFiscale > 50000, 0))))), IF(GiorniDetrazione = 0, 0, primaDetrazione + secondaDetrazione)))"},
  {nome: "rr_calc_Irpef_2024",
   formula: "=LAMBDA(imponibileIrpef,mesiScaglioni, LET(scaglione1, 28000 / 12 * mesiScaglioni, scaglione2, 50000 / 12 * mesiScaglioni, aliquota1, 0.23, aliquota2, 0.35, aliquota3, 0.43, ROUND(IF(imponibileIrpef < 0, 0, IF(AND(imponibileIrpef >= 0, imponibileIrpef <= scaglione1), imponibileIrpef * aliquota1, IF(AND(imponibileIrpef > scaglione1, imponibileIrpef <= scaglione2), scaglione1 * aliquota1 + (imponibileIrpef - scaglione1) * aliquota2, IF(imponibileIrpef > scaglione2, scaglione1 * aliquota1 + (scaglione2 - scaglione1) * aliquota2 + (imponibileIrpef - scaglione2) * aliquota3)))), 2)))"},
  {nome: "rr_calc_Irpef_2024_dettaglio",
   formula: "=LAMBDA(ImponibileFiscale,NumeroMesi, LET(intestazioni, {\"SCAGLIONE DA\",\"SCAGLIONE A\",\"ALIQUOTA\",\"IMPORTO\"}, aliquota1, 23%, aliquota2, 35%, aliquota3, 43%, limite1, 28000 / 12 * NumeroMesi, limite2, 50000 / 12 * NumeroMesi, limite3, 9999999, scaglione1_da, 0, scaglione1_a, IF(ImponibileFiscale < limite1, ImponibileFiscale, limite1), scaglione2_da, IF(ImponibileFiscale < limite1, 0, scaglione1_a), scaglione2_a, IF(ImponibileFiscale < limite1, 0, IF(AND(ImponibileFiscale >= limite1, ImponibileFiscale < limite2), ImponibileFiscale, limite2)), scaglione3_da, IF(ImponibileFiscale < limite2, 0, scaglione2_a), scaglione3_a, IF(ImponibileFiscale < limite2, 0, IF(AND(ImponibileFiscale >= limite2, ImponibileFiscale < limite3), ImponibileFiscale, limite3)), importo1, (scaglione1_a - scaglione1_da) * aliquota1, importo2, (scaglione2_a - scaglione2_da) * aliquota2, importo3, (scaglione3_a - scaglione3_da) * aliquota3, totale_irpef, importo1 + importo2 + importo3, VSTACK(HSTACK(intestazioni), HSTACK(scaglione1_da, scaglione1_a, aliquota1, importo1), HSTACK(scaglione2_da, scaglione2_a, aliquota2, importo2), HSTACK(scaglione3_da, scaglione3_a, aliquota3, importo3), HSTACK(\"TOTALE IRPEF\", \"\", \"\", totale_irpef))))"},
  {nome: "rr_calc_trattamento_integrativo",
   formula: "=LAMBDA(ImponibileFiscale,GiorniDetrazione, IF(ImponibileFiscale < 15000, 1200 / 365 * GiorniDetrazione, 0))"},
  {nome: "rr_cerca_vert_semplificato",
   formula: "=LAMBDA(da_questo_foglio_seleziona_la_CELLA_con_il_CodDipendente,passa_altro_foglio_e_seleziona_l_INTERA_colonna_in_cui_sono_presenti_i_codici_dipendenti,sempre_altro_foglio_seleziona_l_INTERA_colonna_in_cui_è_presente_il_campo_da_abbinare, IF(OR(ROWS(da_questo_foglio_seleziona_la_CELLA_con_il_CodDipendente) <> 1, COLUMNS(da_questo_foglio_seleziona_la_CELLA_con_il_CodDipendente) <> 1), \"Attenzione! nel primo parametro di questa formula deve tenere conto solo di una CELLA e non di un intervallo (da correggere!)\", IF(ROWS(passa_altro_foglio_e_seleziona_l_INTERA_colonna_in_cui_sono_presenti_i_codici_dipendenti) <> ROWS(sempre_altro_foglio_seleziona_l_INTERA_colonna_in_cui_è_presente_il_campo_da_abbinare), \"Attenzione il numero di righe del secondo parametro (pari a \" & ROWS(passa_altro_foglio_e_seleziona_l_INTERA_colonna_in_cui_sono_presenti_i_codici_dipendenti) & \") non corrisponde alle righe del terzo parametro (pari a \" & ROWS(sempre_altro_foglio_seleziona_l_INTERA_colonna_in_cui_è_presente_il_campo_da_abbinare) & \") il numero di righe deve essere uguale (da correggere!)\", IF(COLUMNS(passa_altro_foglio_e_seleziona_l_INTERA_colonna_in_cui_sono_presenti_i_codici_dipendenti) <> 1, \"Attenzione! il secondo parametro di questa formula deve tenere conto solo di una colonna, ossia quella in cui è presente il codice dipendente dell'altro foglio (da correggere!)\", IF(COLUMNS(sempre_altro_foglio_seleziona_l_INTERA_colonna_in_cui_è_presente_il_campo_da_abbinare) <> 1, \"Attenzione! il terzo parametro di questa formula deve tenere conto solo di una colonna, ossia quella in cui è presente il campo da abbinare dell'altro foglio (da correggere!)\", XLOOKUP(da_questo_foglio_seleziona_la_CELLA_con_il_CodDipendente, passa_altro_foglio_e_seleziona_l_INTERA_colonna_in_cui_sono_presenti_i_codici_dipendenti, sempre_altro_foglio_seleziona_l_INTERA_colonna_in_cui_è_presente_il_campo_da_abbinare, \"NON_TROVATO!\", 0))))))"},
  {nome: "rr_elenco_feste_dal_2000_al_2099",
   formula: "=LAMBDA(anno_inizio,anno_fine,giorno_patrono_obbligatorio,mese_patrono_obbligatorio,giorno_festivo1_obbligatorio,mese_festivo1_obbligatorio,giorno_festivo2_obbligatorio,mese_festivo2_obbligatorio, LET(elenco_feste, SORT(VSTACK(DATE(SEQUENCE(100, 1, 2000), 1, 1), DATE(SEQUENCE(100, 1, 2000), 1, 6), DATE(SEQUENCE(100, 1, 2000), 8, 15), DATE(SEQUENCE(100, 1, 2000), 11, 1), DATE(SEQUENCE(100, 1, 2000), 12, 8), DATE(SEQUENCE(100, 1, 2000), 12, 25), DATE(SEQUENCE(100, 1, 2000), 12, 26), DATE(SEQUENCE(100, 1, 2000), 4, 25), DATE(SEQUENCE(100, 1, 2000), 5, 1), DATE(SEQUENCE(100, 1, 2000), 6, 2), {36640;38439;40273;42100;43934;45768;47595;49394;51228;53062;54889;56723;58550;60356;62183;64017;65844;67678;69505;71339;36997;38824;40658;42457;44291;46118;47952;49779;51613;53412;55246;57073;58907;60734;62568;64395;66201;68028;69862;71696;37347;39181;41008;42842;44669;46475;48302;50136;51963;53797;55631;57458;59257;61091;62925;64752;66586;68413;70219;72046;37732;39531;41365;43192;45026;46860;48687;50521;52320;54154;55981;57815;59642;61476;63275;65109;66936;68770;70597;72431;38089;39916;41750;43577;45383;47210;49044;50871;52705;54532;56338;58165;59999;61833;63660;65494;67293;69127;70954;72788}, IF(OR(mese_patrono_obbligatorio = 0, giorno_patrono_obbligatorio = 0), DATE(1900, 1, 1), DATE(SEQUENCE(100, 1, 2000), mese_patrono_obbligatorio, giorno_patrono_obbligatorio)), IF(OR(mese_festivo1_obbligatorio = 0, giorno_festivo1_obbligatorio = 0), DATE(1900, 1, 1), DATE(SEQUENCE(100, 1, 2000), mese_festivo1_obbligatorio, giorno_festivo1_obbligatorio)), IF(OR(mese_festivo2_obbligatorio = 0, giorno_festivo2_obbligatorio = 0), DATE(1900, 1, 1), DATE(SEQUENCE(100, 1, 2000), mese_festivo2_obbligatorio, giorno_festivo2_obbligatorio))), 1, 1), elenco_feste_filtrate, UNIQUE(FILTER(elenco_feste, (YEAR(elenco_feste) <= anno_fine) * (YEAR(elenco_feste) >= anno_inizio))), riga_intestazione, {\"FESTIVITA'\",\"GG SETT.\"}, dettaglio, HSTACK(elenco_feste_filtrate, TEXT(elenco_feste_filtrate, \"gggg\")), VSTACK(riga_intestazione, dettaglio)))"},
  {nome: "rr_enasarco_firr",
   formula: "=LAMBDA(provvione_annua,mesi_riferimento,pluri_0_mono_1, LET(scaglione1, ROUND(IF(pluri_0_mono_1 = 0, 6200, 12400) / 12 * mesi_riferimento, 2), scaglione2, ROUND(IF(pluri_0_mono_1 = 0, 9300, 18600) / 12 * mesi_riferimento, 2), IF(provvione_annua <= scaglione1, ROUND(provvione_annua * 4%, 2), IF(AND(provvione_annua > scaglione1, provvione_annua <= scaglione2), ROUND(scaglione1 * 4% + (provvione_annua - scaglione1) * 2%, 2), IF(provvione_annua > scaglione2, ROUND(scaglione1 * 4% + (scaglione2 - scaglione1) * 2% + (provvione_annua - scaglione2) * 1%, 2))))))"},
  {nome: "rr_enasarco_firr_dettaglio",
   formula: "=LAMBDA(Provviogioni,NumeroMesi,pluri_0_mono_1, LET(intestazioni, {\"SCAGLIONE DA\",\"SCAGLIONE A\",\"ALIQUOTA\",\"IMPORTO\"}, aliquota1, 4%, aliquota2, 2%, aliquota3, 1%, limite1, IF(pluri_0_mono_1 = 0, 6200, 12400) / 12 * NumeroMesi, limite2, IF(pluri_0_mono_1 = 0, 9300, 18600) / 12 * NumeroMesi, limite3, 9999999, scaglione1_da, 0, scaglione1_a, IF(Provviogioni < limite1, Provviogioni, limite1), scaglione2_da, IF(Provviogioni < limite1, 0, scaglione1_a), scaglione2_a, IF(Provviogioni < limite1, 0, IF(AND(Provviogioni >= limite1, Provviogioni < limite2), Provviogioni, limite2)), scaglione3_da, IF(Provviogioni < limite2, 0, scaglione2_a), scaglione3_a, IF(Provviogioni < limite2, 0, IF(AND(Provviogioni >= limite2, Provviogioni < limite3), Provviogioni, limite3)), importo1, (scaglione1_a - scaglione1_da) * aliquota1, importo2, (scaglione2_a - scaglione2_da) * aliquota2, importo3, (scaglione3_a - scaglione3_da) * aliquota3, totale_firr, importo1 + importo2 + importo3, VSTACK(HSTACK(intestazioni), HSTACK(scaglione1_da, scaglione1_a, aliquota1, importo1), HSTACK(scaglione2_da, scaglione2_a, aliquota2, importo2), HSTACK(scaglione3_da, scaglione3_a, aliquota3, importo3), HSTACK(\"TOTALE FIRR\", IF(pluri_0_mono_1 = 0, \"PLURI\", \"MONO\"), \"\", totale_firr))))"},
  {nome: "rr_ivs_aggiuntivo_valore_annuo",
   formula: "=LAMBDA(anno_di_riferimento, IFERROR(VLOOKUP(anno_di_riferimento, {2023,52190;2022,48279;2021,47379;2020,47379;2019,47143;2018,46630;2017,46123;2016,46123;2015,46123;2014,46031;2013,45530;2012,44204;2011,43042;2010,42364;2009,42069;2008,40765;2007,40083;2006,39297;2005,38641;2004,37883;2003,36959;2002,36093;2001,35143.86;2000,34253.49;1999,33714.31;1998,33118.32;1997,32564.67;1996,31342.22;1995,29736.56;1994,28592.6;1993,27617.53}, 2, 0), \"valore non trovato\"))"},
  {nome: "rr_ivs_aggiuntivo_valore_mensile",
   formula: "=LAMBDA(anno_di_riferimento, IFERROR(VLOOKUP(anno_di_riferimento, {2023,4349;2022,4023;2021,3948;2020,3948;2019,3929;2018,3886;2017,3844;2016,3844;2015,3844;2014,3836;2013,3794;2012,3684;2011,3587;2010,3530;2009,3506;2008,3397;2007,3340;2006,3274;2005,3220;2004,3157;2003,3080;2002,3008;2001,2928.83;2000,2854.46;1999,2809.53;1998,2759.95;1997,2713.98;1996,2611.72;1995,2477.96;1994,2382.93;1993,2301.46}, 2, 0), \"valore non trovato\"))"},
  {nome: "rr_massimale_ctr_elenco",
   formula: "=LAMBDA(anno_di_rifermento, IFERROR(VLOOKUP(anno_di_rifermento, {2023,113520;2022,105014;2021,103055;2020,103055;2019,102543;2018,101427;2017,100324;2016,100324;2015,100324;2014,100123;2013,99034;2012,96149;2011,93622;2010,92147;2009,91507;2008,88669;2007,87187;2006,85478;2005,84049;2004,82401;2003,80391;2002,78507;2001,76442.85;2000,74505.62;1999,73332.23;1998,72035.41;1997,70831.03;1996,68172.31}, 2, 0), \"valore non trovato\"))"},
  {nome: "rr_Minimi_CCNL_Terziario",
   formula: "=LAMBDA({\"CCNL TERZIARIO (0780)\",\"\",\"\",\"\",\"\",\"\";\"DA APRILE 2024\",\"\",\"\",\"\",\"\",\"\";\"Liv\",\"PAGA BASE\",\"CONTIGENZA\",\"IND. FUNZ.QUADRO\",\"TERZO ELEMENTO\",\"TOTALE\";\"Quadro\",2070.25,540.37,260.76,11.36,2882.74;\"1 Liv\",1864.88,537.52,0,11.36,2413.76;\"2 Liv\",1613.11,532.54,0,11.36,2157.01;\"3 Liv\",1378.78,527.9,0,11.36,1918.04;\"4 Liv\",1192.46,524.22,0,11.36,1728.04;\"5 Liv\",1077.35,521.94,0,11.36,1610.65;\"\",\"\",\"\",\"\",\"\",\"\";\"DA MARZO 2025\",\"\",\"\",\"\",\"\",\"\";\"Liv\",\"PAGA BASE\",\"CONTIGENZA\",\"IND. FUNZ.QUADRO\",\"TERZO ELEMENTO\",\"TOTALE\";\"Quadro\",2122.33,540.37,260.76,11.36,2934.82;\"1 Liv\",1911.8,537.52,0,11.36,2460.68;\"2 Liv\",1653.69,532.54,0,11.36,2197.59;\"3 Liv\",1413.47,527.9,0,11.36,1952.73;\"4 Liv\",1222.46,524.22,0,11.36,1758.04;\"5 Liv\",1104.45,521.94,0,11.36,1637.75;\"\",\"\",\"\",\"\",\"\",\"\";\"DA NOVEMBRE 2025\",\"\",\"\",\"\",\"\",\"\";\"Liv\",\"PAGA BASE\",\"CONTIGENZA\",\"IND. FUNZ.QUADRO\",\"TERZO ELEMENTO\",\"TOTALE\";\"Quadro\",2183.09,540.37,260.76,11.36,2995.58;\"1 Liv\",1966.54,537.52,0,11.36,2515.42;\"2 Liv\",1701.04,532.54,0,11.36,2244.94;\"3 Liv\",1453.94,527.9,0,11.36,1993.2;\"4 Liv\",1257.46,524.22,0,11.36,1793.04;\"5 Liv\",1136.07,521.94,0,11.36,1669.37;\"\",\"\",\"\",\"\",\"\",\"\";\"DA NOVEMBRE 2026\",\"\",\"\",\"\",\"\",\"\";\"Liv\",\"PAGA BASE\",\"CONTIGENZA\",\"IND. FUNZ.QUADRO\",\"TERZO ELEMENTO\",\"TOTALE\";\"Quadro\",2243.85,540.37,260.76,11.36,3056.34;\"1 Liv\",2021.28,537.52,0,11.36,2570.16;\"2 Liv\",1748.39,532.54,0,11.36,2292.29;\"3 Liv\",1494.41,527.9,0,11.36,2033.67;\"4 Liv\",1292.46,524.22,0,11.36,1828.04;\"5 Liv\",1167.69,521.94,0,11.36,1700.99;\"\",\"\",\"\",\"\",\"\",\"\";\"DA FEBBRAIO 2027\",\"\",\"\",\"\",\"\",\"\";\"Liv\",\"PAGA BASE\",\"CONTIGENZA\",\"IND. FUNZ.QUADRO\",\"TERZO ELEMENTO\",\"TOTALE\";\"Quadro\",2313.29,540.37,260.76,11.36,3125.78;\"1 Liv\",2083.84,537.52,0,11.36,2632.72;\"2 Liv\",1802.5,532.54,0,11.36,2346.4;\"3 Liv\",1540.66,527.9,0,11.36,2079.92;\"4 Liv\",1332.46,524.22,0,11.36,1868.04;\"5 Liv\",1203.83,521.94,0,11.36,1737.13})"},
  {nome: "rr_premio_inail",
   formula: "=LAMBDA(imponibile_inail,aliquota_inail_NON_mettere_il_segno_della_percentuale, imponibile_inail * aliquota_inail_NON_mettere_il_segno_della_percentuale / 1000 + imponibile_inail * aliquota_inail_NON_mettere_il_segno_della_percentuale / 1000 * 1%)"},
  {nome: "rr_quota_tfr_al_netto_ctr_0_50perc",
   formula: "=LAMBDA(imponibile_tfr,imponibile_inps,max_ctr_1_soggetto_0_non_soggetto,apprendista_1_si_0_no,valore_max_ctr, LET(quota_tfr_lorda, ROUND(imponibile_tfr / 13.5, 2), ctr_0_50, IF(apprendista_1_si_0_no = 1, 0, IF(AND(max_ctr_1_soggetto_0_non_soggetto = 1, imponibile_inps > valore_max_ctr), ROUND(valore_max_ctr * 0.5%, 2), ROUND(imponibile_inps * 0.5%, 2))), quota_tfr_lorda - ctr_0_50))"},
  {nome: "rr_super_codice_zucchetti",
   formula: "=LAMBDA(CodiceAzienda,CodiceDipendente, TEXT(CodiceAzienda, \"000000\") & TEXT(CodiceDipendente, \"0000000\"))"}
];

const VERSIONE_LAMBDA = "v5";

// ---------------------------------------------------------------------------------------------
// Excel (via Office.js) accetta i nomi LAMBDA solo se scritti come nel formato file:
// parametri e variabili LET con prefisso "_xlpm." e (forse) funzioni recenti con "_xlfn.".
// convertiFormula() fa questa trasformazione. Le formule originali restano invariate in FORMULE.
// ---------------------------------------------------------------------------------------------
const PREFISSI_FUNZIONI = {
  LAMBDA: "_xlfn.LAMBDA", LET: "_xlfn.LET", XLOOKUP: "_xlfn.XLOOKUP", SEQUENCE: "_xlfn.SEQUENCE",
  UNIQUE: "_xlfn.UNIQUE", VSTACK: "_xlfn.VSTACK", HSTACK: "_xlfn.HSTACK",
  FILTER: "_xlfn._xlws.FILTER", SORT: "_xlfn._xlws.SORT"
};

function convertiFormula(formula, conPrefissiFunzioni) {
  const tok = [];
  const n = formula.length;
  const reId = /[A-Za-z_\u00C0-\u024F]/, reIdC = /[A-Za-z0-9_.\u00C0-\u024F]/;
  let i = 0;
  while (i < n) {
    const ch = formula[i];
    if (ch === '"') {
      let j = i + 1;
      while (j < n) {
        if (formula[j] === '"') { if (formula[j + 1] === '"') { j += 2; continue; } break; }
        j++;
      }
      tok.push({ t: "str", v: formula.slice(i, j + 1) }); i = j + 1;
    } else if (ch === "'") {
      let j = formula.indexOf("'", i + 1); if (j < 0) j = n - 1;
      tok.push({ t: "str", v: formula.slice(i, j + 1) }); i = j + 1;
    } else if (/[0-9]/.test(ch)) {
      let j = i + 1;
      while (j < n && /[0-9.]/.test(formula[j])) j++;
      tok.push({ t: "num", v: formula.slice(i, j) }); i = j;
    } else if (reId.test(ch)) {
      let j = i + 1;
      while (j < n && reIdC.test(formula[j])) j++;
      let k = j; while (formula[k] === " ") k++;
      tok.push({ t: formula[k] === "(" ? "fn" : "id", v: formula.slice(i, j) }); i = j;
    } else {
      tok.push({ t: "op", v: ch }); i++;
    }
  }

  // Passo 1: trova i nomi dichiarati (parametri di LAMBDA e variabili di LET)
  const dichiarati = new Set();
  const pila = [];
  let pend = null;
  const unico = (a) => a.length === 1 && tok[a[0]].t === "id";
  const chiudi = (f) => {
    f.args.push(f.cur);
    if (f.tipo === "LAMBDA") {
      f.args.slice(0, -1).forEach((a) => { if (unico(a)) dichiarati.add(tok[a[0]].v.toLowerCase()); });
    } else if (f.tipo === "LET") {
      for (let q = 0; q < f.args.length - 1; q += 2) if (unico(f.args[q])) dichiarati.add(tok[f.args[q][0]].v.toLowerCase());
    }
  };
  for (let k = 0; k < tok.length; k++) {
    const x = tok[k];
    if (x.t === "op" && x.v === " ") continue;
    const top = pila[pila.length - 1];
    if (x.t === "fn") { pend = x.v.toUpperCase(); if (top) top.cur.push(k); continue; }
    if (x.t === "op" && x.v === "(") { pila.push({ tipo: pend || "group", args: [], cur: [] }); pend = null; continue; }
    if (x.t === "op" && x.v === "{") { pila.push({ tipo: "brace", args: [], cur: [] }); continue; }
    if (x.t === "op" && (x.v === ")" || x.v === "}")) {
      const f = pila.pop();
      if (f) chiudi(f);
      const padre = pila[pila.length - 1];
      if (padre) padre.cur.push(k);
      continue;
    }
    if (x.t === "op" && (x.v === "," || x.v === ";") && top && top.tipo !== "brace" && top.tipo !== "group") {
      top.args.push(top.cur); top.cur = []; continue;
    }
    if (top) top.cur.push(k);
  }

  // Passo 2: riscrive la formula
  return tok.map((x) => {
    if (x.t === "fn") {
      const p = conPrefissiFunzioni && PREFISSI_FUNZIONI[x.v.toUpperCase()];
      return p || x.v;
    }
    if (x.t === "id" && dichiarati.has(x.v.toLowerCase())) return "_xlpm." + x.v;
    return x.v;
  }).join("");
}

// ---------------------------------------------------------------------------------------------

function dettaglioErrore(e) {
  return (e.code ? e.code : "") + (e.code ? ": " : "") + e.message;
}

async function eliminaNomeSeEsiste(nome) {
  try {
    await Excel.run(async (ctx) => {
      const n = ctx.workbook.names.getItemOrNullObject(nome);
      n.load("isNullObject");
      await ctx.sync();
      if (!n.isNullObject) { n.delete(); await ctx.sync(); }
    });
  } catch (e) { /* niente */ }
}

async function creaNome(nome, formula, inDuePassaggi) {
  await Excel.run(async (ctx) => {
    if (inDuePassaggi) {
      const n = ctx.workbook.names.add(nome, "=0");
      await ctx.sync();
      n.formula = formula;
    } else {
      ctx.workbook.names.add(nome, formula);
    }
    await ctx.sync();
  });
}

const STRATEGIE = [
  { nome: "diretto",                        conv: (f) => f,                         due: false },
  { nome: "_xlpm",                          conv: (f) => convertiFormula(f, false), due: false },
  { nome: "_xlpm + _xlfn",                  conv: (f) => convertiFormula(f, true),  due: false },
  { nome: "_xlpm, due passaggi",            conv: (f) => convertiFormula(f, false), due: true },
  { nome: "_xlpm + _xlfn, due passaggi",    conv: (f) => convertiFormula(f, true),  due: true }
];
let strategiaVincente = null;

// Prova le strategie in ordine. Restituisce { ok, strategia } oppure { ok:false, errori:[...] }
async function aggiungiNome(nome, formula) {
  const ordine = STRATEGIE.slice();
  if (strategiaVincente !== null) ordine.unshift(ordine.splice(strategiaVincente, 1)[0]);
  const errori = [];
  for (const st of ordine) {
    try {
      await creaNome(nome, st.conv(formula), st.due);
      strategiaVincente = STRATEGIE.indexOf(st);
      return { ok: true, strategia: st.nome };
    } catch (e) {
      errori.push(st.nome + " -> " + dettaglioErrore(e));
      await eliminaNomeSeEsiste(nome);
    }
  }
  return { ok: false, errori: errori };
}

// Prove su un nome temporaneo (poi eliminato) per capire cosa accetta Excel
async function proveNomi() {
  const NOME = "rr_prova_temporanea";
  const prove = [
    ["=SUM(1,2)", async (ctx) => { ctx.workbook.names.add(NOME, "=SUM(1,2)"); await ctx.sync(); }],
    ["=SUM(1;2)", async (ctx) => { ctx.workbook.names.add(NOME, "=SUM(1;2)"); await ctx.sync(); }],
    ["=LAMBDA(x,x+1)", async (ctx) => { ctx.workbook.names.add(NOME, "=LAMBDA(x,x+1)"); await ctx.sync(); }],
    ["=LAMBDA(_xlpm.x,_xlpm.x+1)", async (ctx) => { ctx.workbook.names.add(NOME, "=LAMBDA(_xlpm.x,_xlpm.x+1)"); await ctx.sync(); }],
    ["=_xlfn.LAMBDA(_xlpm.x,_xlpm.x+1)", async (ctx) => { ctx.workbook.names.add(NOME, "=_xlfn.LAMBDA(_xlpm.x,_xlpm.x+1)"); await ctx.sync(); }],
    ["=LET(a,1,a+1)", async (ctx) => { ctx.workbook.names.add(NOME, "=LET(a,1,a+1)"); await ctx.sync(); }],
    ["=_xlfn.LET(_xlpm.a,1,_xlpm.a+1)", async (ctx) => { ctx.workbook.names.add(NOME, "=_xlfn.LET(_xlpm.a,1,_xlpm.a+1)"); await ctx.sync(); }],
    ["=LAMBDA(x;x+1) (con formula locale)", async (ctx) => { ctx.workbook.names.addFormulaLocal(NOME, "=LAMBDA(x;x+1)"); await ctx.sync(); }]
  ];
  const righe = [];
  for (const [descrizione, fn] of prove) {
    let esito = "ok";
    try { await Excel.run(fn); } catch (e) { esito = "ERRORE (" + (e.code || e.message) + ")"; }
    righe.push("   " + descrizione + ": " + esito);
    await eliminaNomeSeEsiste(NOME);
  }
  return righe.join("\n");
}

async function macroFormuleLambda() {
  let aggiunte = 0, presenti = 0;
  const usate = {};
  const falliti = [];

  for (const f of FORMULE) {
    let esiste = false;
    try {
      await Excel.run(async (ctx) => {
        const n = ctx.workbook.names.getItemOrNullObject(f.nome);
        n.load("isNullObject");
        await ctx.sync();
        esiste = !n.isNullObject;
      });
    } catch (e) { /* si prova comunque ad aggiungere */ }

    if (esiste) { presenti++; continue; }
    const r = await aggiungiNome(f.nome, f.formula);
    if (r.ok) { aggiunte++; usate[r.strategia] = (usate[r.strategia] || 0) + 1; }
    else falliti.push({ nome: f.nome, errori: r.errori });
  }

  let msg = "Formule LAMBDA (" + VERSIONE_LAMBDA + "): " + aggiunte + " aggiunte, " + presenti + " già presenti" + (falliti.length ? "" : " ✓");
  if (aggiunte) msg += "\nMetodo riuscito: " + Object.keys(usate).map((k) => k + " (" + usate[k] + ")").join(", ");
  if (falliti.length) {
    msg += "\nNon aggiunte: " + falliti.length + " su " + FORMULE.length;
    msg += "\n\nPrimo errore (" + falliti[0].nome + "):\n   " + falliti[0].errori.join("\n   ");
    const orig = FORMULE.find((x) => x.nome === falliti[0].nome).formula;
    msg += "\n\nFormula convertita (primi 250 caratteri):\n" + convertiFormula(orig, true).slice(0, 250);
    msg += "\n\nProve:\n" + await proveNomi();
    try {
      const d = Office.context.diagnostics;
      msg += "\n\nExcel " + d.version + " - " + d.platform;
    } catch (e) { /* niente */ }
  }
  return msg;
}
