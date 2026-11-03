/**
 * Sincronizza gli agenti del foglio "Gerarchia Generale" (scheda MATRICOLE OPERATORI) con il sito della Polizia.
 *
 * Installazione (una volta sola):
 *  1. Nel foglio: Estensioni → Apps Script. Cancella il codice presente e incolla tutto questo file. Salva.
 *  2. Ricarica il foglio: compare il menu "Sito Polizia".
 *  3. Menu "Sito Polizia" → "1. Imposta la chiave" e incolla la chiave (la stessa del secret SYNC_KEY su GitHub).
 *  4. Menu "Sito Polizia" → "2. Attiva la sincronizzazione automatica" (Google chiederà di autorizzare lo script).
 *  5. Menu "Sito Polizia" → "Sincronizza adesso" per la prima volta.
 *
 * Da quel momento ogni modifica alla scheda viene inviata al sito entro pochi secondi, e comunque ogni 5 minuti.
 * Il ruolo (allievo / istruttore / admin) si gestisce dal sito: la sincronizzazione non lo cambia.
 */

var URL_SITO = 'https://iprp-sportello.ryze63131.workers.dev/formazione/sync/agenti';
var SCHEDA = 'MATRICOLE OPERATORI';

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Sito Polizia')
    .addItem('Sincronizza adesso', 'sincronizzaOra')
    .addSeparator()
    .addItem('1. Imposta la chiave', 'impostaChiave')
    .addItem('2. Attiva la sincronizzazione automatica', 'attivaAutomatica')
    .addItem('Disattiva la sincronizzazione automatica', 'disattivaAutomatica')
    .addToUi();
}

function impostaChiave() {
  var ui = SpreadsheetApp.getUi();
  var r = ui.prompt('Chiave di sincronizzazione', 'Incolla la chiave (stessa del secret SYNC_KEY su GitHub):', ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;
  var chiave = r.getResponseText().trim();
  if (chiave.length < 16) { ui.alert('La chiave deve avere almeno 16 caratteri.'); return; }
  PropertiesService.getScriptProperties().setProperty('SYNC_KEY', chiave);
  ui.alert('Chiave salvata.');
}

function attivaAutomatica() {
  disattivaAutomatica();
  var ss = SpreadsheetApp.getActive();
  ScriptApp.newTrigger('allaModifica').forSpreadsheet(ss).onEdit().create();
  ScriptApp.newTrigger('sincronizzaSilenzioso').timeBased().everyMinutes(5).create();
  SpreadsheetApp.getUi().alert('Sincronizzazione automatica attiva.');
}

function disattivaAutomatica() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    var f = t.getHandlerFunction();
    if (f === 'allaModifica' || f === 'sincronizzaSilenzioso') ScriptApp.deleteTrigger(t);
  });
}

// Letto dalla scheda: cerca da sé la riga delle intestazioni e le colonne, così regge spostamenti e righe nuove.
function leggiAgenti_() {
  var foglio = SpreadsheetApp.getActive().getSheetByName(SCHEDA);
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
  if (!chiave) throw new Error('Chiave non impostata: usa il menu "Sito Polizia" → "1. Imposta la chiave".');
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

function sincronizzaOra() {
  var ui = SpreadsheetApp.getUi();
  try {
    var e = invia_(true);
    ui.alert('Sincronizzazione completata', e.totale + ' agenti nel foglio — aggiunti: ' + e.aggiunti + ', aggiornati: ' + e.aggiornati + ', rimossi: ' + e.rimossi + '.', ui.ButtonSet.OK);
  } catch (err) {
    ui.alert('Sincronizzazione non riuscita', String(err.message || err), ui.ButtonSet.OK);
  }
}

// Modifica manuale: a raffica si invia al massimo ogni 15 secondi (il trigger a tempo recupera il resto).
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
