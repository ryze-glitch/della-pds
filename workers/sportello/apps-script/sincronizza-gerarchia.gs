/**
 * Sincronizza gli agenti del foglio "Gerarchia Generale" (scheda MATRICOLE OPERATORI) con il sito della Polizia.
 *
 * ATTENZIONE: va incollato in un progetto Apps Script SEPARATO e privato, creato da script.google.com
 * (Nuovo progetto), NON da "Estensioni → Apps Script" dentro il foglio. Così chi ha accesso al foglio
 * non può vedere né il codice né la chiave: il progetto è visibile solo a chi lo ha creato.
 *
 * Installazione (una volta sola):
 *  1. Vai su script.google.com → "Nuovo progetto". Cancella il codice presente e incolla tutto questo file. Salva.
 *  2. Impostazioni del progetto (ingranaggio a sinistra) → "Proprietà dello script" → "Aggiungi proprietà":
 *       nome SYNC_KEY, valore = la chiave (la stessa del secret SYNC_KEY su GitHub). Salva.
 *  3. In alto scegli la funzione "attiva" e premi "Esegui". Google chiede di autorizzare lo script: accetta.
 *  4. Scegli la funzione "sincronizzaOra" ed "Esegui": nel registro delle esecuzioni compare quanti agenti ha inviato.
 *
 * Da quel momento ogni modifica alla scheda (anche fatta da altri) viene inviata al sito entro pochi secondi,
 * e comunque ogni 5 minuti. Il ruolo (allievo / istruttore / admin) si gestisce dal sito e non viene toccato.
 */

var ID_FOGLIO = '12VhLXV-f8J7BfaGREjSn9DiH91hafzGqcpo_K9D6Ej8'; // non è un segreto: senza accesso al foglio non serve a nulla
var URL_SITO = 'https://iprp-sportello.ryze63131.workers.dev/formazione/sync/agenti';
var SCHEDA = 'MATRICOLE OPERATORI';

// Crea i due trigger: a ogni modifica del foglio e ogni 5 minuti.
function attiva() {
  disattiva();
  ScriptApp.newTrigger('allaModifica').forSpreadsheet(SpreadsheetApp.openById(ID_FOGLIO)).onEdit().create();
  ScriptApp.newTrigger('sincronizzaSilenzioso').timeBased().everyMinutes(5).create();
  Logger.log('Sincronizzazione automatica attiva.');
}

function disattiva() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    var f = t.getHandlerFunction();
    if (f === 'allaModifica' || f === 'sincronizzaSilenzioso') ScriptApp.deleteTrigger(t);
  });
}

// Letto dalla scheda: cerca da sé la riga delle intestazioni e le colonne, così regge spostamenti e righe nuove.
function leggiAgenti_() {
  var foglio = SpreadsheetApp.openById(ID_FOGLIO).getSheetByName(SCHEDA);
  if (!foglio) throw new Error('Scheda "' + SCHEDA + '" non trovata.');
  var valori = foglio.getDataRange().getValues();
  var intest = -1, col = {};
  for (var i = 0; i < valori.length && intest < 0; i++) {
    var riga = valori[i].map(function (c) { return String(c).trim().toUpperCase(); });
    var iId = riga.indexOf('ID DISCORD'), iNome = riga.indexOf('NOME E COGNOME');
    if (iId >= 0 && iNome >= 0) { intest = i; col = { id: iId, nome: iNome, matricola: riga.indexOf('MATRICOLA'), qualifica: riga.indexOf('QUALIFICA') }; }
  }
  if (intest < 0) throw new Error('Intestazioni non trovate (servono "NOME e COGNOME" e "ID DISCORD").');
  var righe = [];
  for (var r = intest + 1; r < valori.length; r++) {
    var v = valori[r];
    var id = String(v[col.id] || '').replace(/\D/g, '');
    var nome = String(v[col.nome] || '').trim();
    if (!id || !nome) continue;
    righe.push({
      nome: nome,
      matricola: col.matricola >= 0 ? String(v[col.matricola] || '').trim() : '',
      qualifica: col.qualifica >= 0 ? String(v[col.qualifica] || '').trim() : '',
      discordId: id
    });
  }
  return righe;
}

function invia_(forza) {
  var props = PropertiesService.getScriptProperties();
  var chiave = props.getProperty('SYNC_KEY');
  if (!chiave) throw new Error('Manca la proprietà SYNC_KEY (Impostazioni del progetto → Proprietà dello script).');
  var righe = leggiAgenti_();
  var corpo = JSON.stringify({ righe: righe });
  var impronta = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, corpo));
  if (!forza && props.getProperty('ULTIMA_IMPRONTA') === impronta) return { saltato: true, righe: righe.length };
  var res = UrlFetchApp.fetch(URL_SITO, { method: 'post', contentType: 'application/json', payload: corpo, headers: { 'X-Sync-Key': chiave }, muteHttpExceptions: true });
  var codice = res.getResponseCode();
  if (codice !== 200) throw new Error('Il sito ha risposto ' + codice + ': ' + res.getContentText().slice(0, 200));
  props.setProperty('ULTIMA_IMPRONTA', impronta);
  return JSON.parse(res.getContentText());
}

// Da lanciare a mano dall'editor: invia subito e scrive il risultato nel registro.
function sincronizzaOra() {
  var e = invia_(true);
  Logger.log('Fatto: ' + e.totale + ' agenti nel foglio — aggiunti ' + e.aggiunti + ', aggiornati ' + e.aggiornati + ', rimossi ' + e.rimossi + '.');
}

// Modifica del foglio: a raffica si invia al massimo ogni 15 secondi (il trigger a tempo recupera il resto).
function allaModifica(e) {
  if (e && e.range && e.range.getSheet().getName() !== SCHEDA) return;
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(3000)) return;
  try {
    var props = PropertiesService.getScriptProperties();
    var ora = Date.now();
    if (ora - Number(props.getProperty('ULTIMO_INVIO') || 0) < 15000) return;
    props.setProperty('ULTIMO_INVIO', String(ora));
    invia_(false);
  } catch (err) {
    console.error(err);
  } finally {
    lock.releaseLock();
  }
}

function sincronizzaSilenzioso() {
  try { invia_(false); } catch (err) { console.error(err); }
}
